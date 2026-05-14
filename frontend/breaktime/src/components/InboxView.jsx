import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiCall } from "../utils/general";
import InboxBookingSlideOut from "./inboxSlideOut/InboxSlideOut";
import SendMessageModal from "./popups/messaging/SendMessageModal";

// Filled medium-purple circle with white checkmark — used for update messages
const UpdateIcon = () => (
    <div className="w-10 h-10 rounded-full bg-light-purple flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" stroke="white">
            <path d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

// Filled red circle with white exclamation — used for action-required messages
const ActionIcon = () => (
    <div className="w-10 h-10 rounded-full bg-dot-red flex items-center justify-center flex-shrink-0">
        <span className="text-lime-500 font-bold text-xl leading-none select-none">!</span>
    </div>
);

// Filled purple circle with envelope — used for direct messages
const MessageIcon = () => (
    <div className="w-10 h-10 rounded-full bg-dark-purple flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white">
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

function MessageItem({ msg, onClick, onToggleRead }) {
    const stopAndToggle = (e) => {
        e.stopPropagation();
        onToggleRead(msg._id);
    };

    return (
        <div
            onClick={onClick}
            className="flex items-start gap-4 px-8 py-4 mx-8 my-4 shadow-sm shadow-light-purple rounded-2xl cursor-pointer transition-colors hover:bg-staff-main-comp-hover"
        >
            <div className="mt-1 flex-shrink-0">
                {getMessageIcon(msg.type)}
            </div>

            <div className="flex-1 min-w-0">
                <span className={`${msg.isRead ? 'font-normal' : 'font-bold'} text-dark-navy text-base`}>{msg.title}</span>
                <p className="text-sm text-gray-500 mt-1">{getMessageSubtitle(msg)}</p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0 gap-2">
                <span className="text-sm text-gray-400 whitespace-nowrap">{getTimeAgo(msg.timestamp)}</span>
                <button className="text-sm underline text-dark-navy cursor-pointer" onClick={stopAndToggle}>
                    {msg.isRead ? 'Mark as unread' : 'Mark as read'}
                </button>
            </div>
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
    onClick: PropTypes.func.isRequired,
    onToggleRead: PropTypes.func.isRequired,
};

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

export default function InboxView({ messages = [], setMessages, userRole = "staff", pendingNotificationID = null, onClearPendingNotification }) {
    const [activeTab, setActiveTab] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [slideOutBooking, setSlideOutBooking] = useState(null);
    const [showComposeModal, setShowComposeModal] = useState(false);

    const toggleRead = (id) => {
        const msg = messages.find(m => m._id === id);
        const newIsRead = !msg.isRead;

        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newIsRead } : m));

        apiCall('/notification/markRead', 'PATCH', { _id: id, isRead: newIsRead }, null)
            .catch(err => console.error('Failed to update read status:', err));
    };

    useEffect(() => {
        if (!pendingNotificationID || messages.length === 0) return;
        const msg = messages.find(m => m._id === pendingNotificationID);
        if (!msg) return;
        if (!msg.isRead) {
            setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
            apiCall('/notification/markRead', 'PATCH', { _id: msg._id, isRead: true }, null).catch(() => {});
        }
        if (msg.type === 'MESSAGE') {
            setSlideOutBooking({ ...msg, isMessage: true });
        } else if (msg.bookingID) {
            apiCall(`/booking/getByBookingID?bookingID=${msg.bookingID}`, 'GET', null, null)
                .then(data => setSlideOutBooking({ ...data.booking, activity: mapActivities(data.booking.activity) }))
                .catch(() => setSlideOutBooking({ activity: [] }));
        }
        onClearPendingNotification?.();
    }, [pendingNotificationID, messages, setMessages, onClearPendingNotification]);

    const filteredMessages = messages.filter(msg => {
        const tabMatch =
            activeTab === 'all' ||
            (activeTab === 'action' && msg.type === 'ALERT') ||
            (activeTab === 'update' && msg.type === 'UPDATE') ||
            (activeTab === 'messages' && msg.type === 'MESSAGE');
        const readMatch =
            readFilter === 'all' ||
            (readFilter === 'read' && msg.isRead) ||
            (readFilter === 'unread' && !msg.isRead);
        return tabMatch && readMatch;
    });

    const handleMessageClick = (msg) => {
        if (!msg.isRead) toggleRead(msg._id);

        if (msg.type === 'MESSAGE') {
            setSlideOutBooking({ ...msg, isMessage: true });
        } else if (msg.bookingID) {
            apiCall(`/booking/getByBookingID?bookingID=${msg.bookingID}`, 'GET', null, null)
                .then(data => setSlideOutBooking({ ...data.booking, activity: mapActivities(data.booking.activity) }))
                .catch(err => { console.error('Failed to fetch booking:', err); setSlideOutBooking({ activity: [] }); });
        }
    };

    const TabBtn = ({ tabKey, label, count }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`text-sm font-medium px-4 py-1 rounded-full transition-colors cursor-pointer
                ${activeTab === tabKey
                    ? 'bg-dark-purple text-white'
                    : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}{count !== undefined ? <span className="ml-2 bg-white text-dark-purple rounded-full px-1">{count}</span> : ''}
        </button>
    );
    TabBtn.propTypes = { tabKey: PropTypes.string.isRequired, label: PropTypes.string.isRequired, count: PropTypes.number };

    const FilterBtn = ({ filterKey, label }) => (
        <button
            onClick={() => setReadFilter(filterKey)}
            className={`text-sm font-medium px-4 py-1 rounded-full transition-colors cursor-pointer
                ${readFilter === filterKey
                    ? 'bg-dark-purple text-white'
                    : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}
        </button>
    );
    FilterBtn.propTypes = { filterKey: PropTypes.string.isRequired, label: PropTypes.string.isRequired };

    const unreadCount = messages.filter(m => !m.isRead).length;
    const unreadActionCount = messages.filter(m => !m.isRead && m.type === 'ALERT').length;
    const unreadUpdateCount = messages.filter(m => !m.isRead && m.type === 'UPDATE').length;
    const unreadMessageCount = messages.filter(m => !m.isRead && m.type === 'MESSAGE').length;

    return (
        <div className="bg-staff-main-comp-bg rounded-[20px] h-full flex flex-col font-all overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-3">
                <h1 className="text-3xl font-bold text-dark-navy">Inbox</h1>
                <button
                    onClick={() => setShowComposeModal(true)}
                    className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-500 hover:bg-staff-main-comp-hover transition-colors cursor-pointer"
                >
                    send a message
                </button>
            </div>

            {/* Tabs + Read filter */}
            <div className="flex items-center mx-7 my-2 px-2 py-1 gap-2 border border-gray-300 rounded-full">
                <div className="flex items-center gap-2 flex-1">
                    <TabBtn tabKey="all" label="ALL" count={unreadCount || undefined} />
                    {userRole === 'staff' && <TabBtn tabKey="action" label="Action Required" count={unreadActionCount || undefined} />}
                    {userRole !== 'staff' && <TabBtn tabKey="update" label="Updates" count={unreadUpdateCount || undefined} />}
                    <TabBtn tabKey="messages" label="Messages" count={unreadMessageCount || undefined} />
                </div>
                <div className="flex items-center gap-2">
                    <FilterBtn filterKey="unread" label="Unread" />
                    <FilterBtn filterKey="read" label="Read" />
                    <FilterBtn filterKey="all" label="ALL" />
                </div>
            </div>

            {/* Hint */}
            <p className="px-8 pb-1 text-xs text-gray-600">click to see details</p>

            {/* Body: message list */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-100">
                <div className="flex-1 overflow-y-auto scrollbar-purple">
                    {filteredMessages.length === 0 ? (
                        <p className="text-center text-gray-400 mt-12 text-sm">No messages</p>
                    ) : (
                        filteredMessages.map(msg => (
                            <MessageItem
                                key={msg._id}
                                msg={msg}
                                onClick={() => handleMessageClick(msg)}
                                onToggleRead={toggleRead}
                            />
                        ))
                    )}
                </div>
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

InboxView.propTypes = {
    messages: PropTypes.array,
    setMessages: PropTypes.func,
    userRole: PropTypes.string,
    pendingNotificationID: PropTypes.string,
    onClearPendingNotification: PropTypes.func,
};
