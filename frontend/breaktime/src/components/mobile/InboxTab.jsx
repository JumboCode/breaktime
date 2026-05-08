import { useState } from "react";
import PropTypes from "prop-types";
import { apiCall } from "../../utils/general";
import InboxBookingSlideOut from "../inboxSlideOut/InboxSlideOut";
import SendMessageModal from "../popups/messaging/SendMessageModal";

const UpdateIcon = () => (
    <div className="w-[7vw] h-[7vw] rounded-full bg-light-purple flex items-center justify-center shrink-0">
        <svg className="w-[4vw] h-[4vw]" fill="none" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" stroke="white">
            <path d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

const ActionIcon = () => (
    <div className="w-[7vw] h-[7vw] rounded-full bg-dot-red flex items-center justify-center shrink-0">
        <span className="text-lime-500 font-bold text-[4vw] leading-none select-none">!</span>
    </div>
);

const MessageIcon = () => (
    <div className="w-[7vw] h-[7vw] rounded-full bg-dark-purple flex items-center justify-center shrink-0">
        <svg className="w-[4vw] h-[4vw]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75M21.75 6.75A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
        </svg>
    </div>
);

function getTimeAgo(timestamp) {
    const then = new Date(timestamp);
    if (isNaN(then.getTime())) return timestamp;

    const now = new Date();
    const diffMs = now - then;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
        return diffHours === 0 ? 'Just now' : `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays <= 3) {
        return `${diffDays} Day${diffDays === 1 ? '' : 's'} Ago`;
    } else {
        return then.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true });
    }
}

function getMessageIcon(type) {
    if (type === 'UPDATE') return <UpdateIcon />;
    if (type === 'MESSAGE') return <MessageIcon />;
    return <ActionIcon />;
}

function getMessageSubtitle(msg) {
    if (msg.type === 'MESSAGE') return msg.senderName ? `From: ${msg.senderName}` : 'Direct Message';
    if (msg.bookingID) return `Booking #${msg.bookingID}`;
    return '';
}

function mapActivities(activities = []) {
    return activities.map((act) => {
        const [type, val, ts] = act;
        if (type === 'canceled') return ['update', 'canceled',  val, val];
        if (type === 'modified') return ['update', 'modified',  val, val];
        if (type === 'messaged') return ['update', 'messaged',  null, val];
        if (type === 'approved') return ['update', 'approved',  val, val];
        if (type === 'rejected') return ['update', 'rejected',  val, val];
        if (type === 'time')     return ['action', 'time',      val, ts ?? val];
        if (type === 'note')     return ['action', 'note',      val, val];
        return ['update', 'confirmed', val, val];
    });
}

function MessageItem({ msg, onMore, onToggleRead }) {
    const stopAndToggle = (e) => {
        e.stopPropagation();
        onToggleRead(msg._id);
    };

    return (
        <div
            className="flex items-center gap-[3vw] bg-white rounded-4xl px-[4vw] py-[3vw] shadow-sm shadow-light-purple cursor-pointer"
            onClick={() => onMore(msg)}
        >
            <div className="shrink-0">
                {getMessageIcon(msg.type)}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-[4vw] ${msg.isRead ? 'font-normal' : 'font-bold'} text-dark-navy truncate`}>
                    {msg.title}
                </p>
                <span className="text-[3vw] text-gray-400 whitespace-nowrap">{getTimeAgo(msg.timestamp)}</span>
            </div>

            <button
                onClick={stopAndToggle}
                className="shrink-0 border border-gray-300 rounded-full px-[3vw] py-[1vw] text-[3.5vw] text-gray-600 cursor-pointer whitespace-nowrap"
            >
                {msg.isRead ? 'mark unread' : 'mark read'}
            </button>
        </div>
    );
}

MessageItem.propTypes = {
    msg: PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        title: PropTypes.string,
        senderName: PropTypes.string,
        bookingID: PropTypes.string,
        isRead: PropTypes.bool,
        timestamp: PropTypes.string,
    }).isRequired,
    onMore: PropTypes.func.isRequired,
    onToggleRead: PropTypes.func.isRequired,
};

export default function MobileInboxView({ messages = [], setMessages, userRole = "ya" }) {
    const [activeTab, setActiveTab] = useState('all');
    const [slideOutBooking, setSlideOutBooking] = useState(null);
    const [showComposeModal, setShowComposeModal] = useState(false);

    const toggleRead = (id) => {
        const msg = messages.find(m => m._id === id);
        const newIsRead = !msg.isRead;

        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newIsRead } : m));

        apiCall('/notification/markRead', 'PATCH', { _id: id, isRead: newIsRead }, null)
            .catch(err => console.error('Failed to update read status:', err));
    };

    const filteredMessages = messages.filter(msg => {
        return (
            activeTab === 'all' ||
            (activeTab === 'action' && msg.type === 'ALERT') ||
            (activeTab === 'update' && msg.type === 'UPDATE') ||
            (activeTab === 'messages' && msg.type === 'MESSAGE')
        );
    });

    const handleMore = (msg) => {
        if (!msg.isRead) toggleRead(msg._id);

        if (msg.type === 'MESSAGE') {
            setSlideOutBooking({ ...msg, isMessage: true });
        } else if (msg.bookingID) {
            apiCall(`/booking/getByBookingID?bookingID=${msg.bookingID}`, 'GET', null, null)
                .then(data => setSlideOutBooking({ ...data.booking, activity: mapActivities(data.booking.activity) }))
                .catch(err => { console.error('Failed to fetch booking:', err); setSlideOutBooking({ activity: [] }); });
        }
    };

    const defaultTabStyle = "text-[4vw] transition-all duration-200 font-all";
    const activeTabStyle = " text-dark-navy font-semibold";
    const inactiveTabStyle = " text-gray-400";

    const unreadCount = messages.filter(m => !m.isRead).length;
    const unreadActionCount = messages.filter(m => !m.isRead && m.type === 'ALERT').length;
    const unreadUpdateCount = messages.filter(m => !m.isRead && m.type === 'UPDATE').length;
    const unreadMessageCount = messages.filter(m => !m.isRead && m.type === 'MESSAGE').length;

    const TabBtn = ({ tabKey, label, count }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={defaultTabStyle + (activeTab === tabKey ? activeTabStyle : inactiveTabStyle)}
        >
            {label}
            {count ? <span className="ml-[1.5vw] text-[3vw] text-bright-purple font-semibold">{count}</span> : ''}
        </button>
    );

    TabBtn.propTypes = { tabKey: PropTypes.string, label: PropTypes.string, count: PropTypes.number };

    return (
        <div className="flex flex-col font-all px-[30px] pb-[6vw]">
            {/* Header */}
            <div className="w-fit h-fit mt-[23px] flex flex-col text-[14vw] font-light">
                <span className="-my-4">Check</span>
                <span className="-my-4">Your</span>
                <span className="text-bright-purple -my-4">Messages</span>
            </div>

            {/* Compose button */}
            <button
                onClick={() => setShowComposeModal(true)}
                className="mt-[3vw] self-start border border-gray-300 rounded-full px-[4vw] py-[1.5vw] text-[3.5vw] text-gray-500 font-all"
            >
                send a message
            </button>

            {/* Tabs */}
            <div className="flex items-center gap-[5vw] mt-10 mb-[3vw]">
                <TabBtn tabKey="all" label="All" count={unreadCount || undefined} />
                {userRole === 'staff' && <TabBtn tabKey="action" label="Action Required" count={unreadActionCount || undefined} />}
                <TabBtn tabKey="update" label="Updates" count={unreadUpdateCount || undefined} />
                <TabBtn tabKey="messages" label="Messages" count={unreadMessageCount || undefined} />
            </div>

            {/* Message list */}
            <div className="flex flex-col gap-[3vw]">
                {filteredMessages.length === 0 ? (
                    <p className="text-gray-400 text-[3.5vw] mt-[4vw]">No messages found.</p>
                ) : (
                    filteredMessages.map(msg => (
                        <MessageItem
                            key={msg._id}
                            msg={msg}
                            onMore={handleMore}
                            onToggleRead={toggleRead}
                        />
                    ))
                )}
            </div>

            <InboxBookingSlideOut
                isOpen={!!slideOutBooking}
                onClose={() => setSlideOutBooking(null)}
                booking={slideOutBooking}
                userRole={userRole}
            />

            {showComposeModal && (
                <SendMessageModal
                    role={userRole}
                    onClose={() => setShowComposeModal(false)}
                    onSent={() => setShowComposeModal(false)}
                />
            )}
        </div>
    );
}

MobileInboxView.propTypes = {
    messages: PropTypes.array,
    setMessages: PropTypes.func,
    userRole: PropTypes.string,
};
