import { useState } from "react";

const DUMMY_MESSAGES = [
    {
        id: 1,
        type: 'update',
        subtype: 'confirmed',
        title: 'Booking Confirmed',
        service: 'Shower Service',
        bookingId: '#123456',
        timeAgo: '4 hours ago',
        isRead: false,
        detailDate: 'Requested on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 2,
        type: 'update',
        subtype: 'confirmed',
        title: 'Booking Confirmed',
        service: 'Laundry Service',
        bookingId: '#123456',
        timeAgo: '4 hours ago',
        isRead: true,
        detailDate: 'Requested on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 3,
        type: 'action',
        subtype: 'extra_time',
        title: 'Requested Extra Time',
        bookingId: '#123456',
        timeAgo: '4 hours ago',
        requestedTime: '+30 min',
        isRead: false,
        note: "I'm so sorry I forgot about my detergent so I had to run home to get them",
        detailDate: 'Requested on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 4,
        type: 'action',
        subtype: 'note',
        title: 'Left A Note',
        bookingId: '#123456',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "I'm wondering if I can have two extra chairs for my shower booking because I'm sad",
        detailDate: 'Left on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 5,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 6,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 7,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 8,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 9,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 10,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 11,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
    {
        id: 12,
        type: 'action',
        subtype: 'general_inquiry',
        title: 'Send A Message',
        source: 'General Inquiry',
        timeAgo: '4 hours ago',
        isRead: false,
        note: "How can I sign up for weekly job training?",
        detailDate: 'Sent on Monday, Oct 15th, 12:45 PM',
    },
];

const SERVICE_BADGE_COLOR = 'bg-[#7DDCFB] text-black';

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

function ServiceBadge({ service }) {
    return (
        <span className={`${SERVICE_BADGE_COLOR} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}>
            {service}
        </span>
    );
}

function ExtraTimeBadge({ time }) {
    return (
        <span className="bg-light-purple text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            {time}
        </span>
    );
}

function NoteBadge({ note }) {
    const truncated = note.length > 38 ? note.slice(0, 38) + '...' : note;
    return (
        <span className="bg-light-purple text-white text-xs px-3 py-1 rounded-full max-w-[260px] truncate inline-block">
            {truncated}
        </span>
    );
}

function MessageItem({ msg, isSelected, onClick, onToggleRead }) {
    const stopAndToggle = (e) => {
        e.stopPropagation();
        onToggleRead(msg.id);
    };

    return (
        <div
            onClick={onClick}
            className="flex items-start gap-4 px-8 py-4 mx-8 my-4 shadow-sm shadow-light-purple rounded-2xl cursor-pointer transition-colors hover:bg-staff-main-comp-hover"
        >
            {/* Conditional icon based on message type */}
            <div className="mt-1 flex-shrink-0">
                {msg.type === 'update' ? <UpdateIcon /> : <ActionIcon />}
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-dark-navy text-base">{msg.title}</span>
                    {msg.service && <ServiceBadge service={msg.service} />}
                    {msg.subtype === 'extra_time' && msg.requestedTime && (
                        <ExtraTimeBadge time={msg.requestedTime} />
                    )}
                    {(msg.subtype === 'note' || msg.subtype === 'general_inquiry') && msg.note && (
                        <NoteBadge note={msg.note} />
                    )}
                </div>

                <p className="text-sm text-gray-500 mt-1">
                    {msg.bookingId ? `Booking ${msg.bookingId}` : msg.source}
                </p>
            </div>

            {/* Right column: timestamp on top, action buttons below — all right-aligned */}
            <div className="flex flex-col items-end flex-shrink-0 gap-2">
                <span className="text-sm text-gray-400 whitespace-nowrap">{msg.timeAgo}</span>

                {msg.subtype === 'extra_time' && (
                    <div className="flex items-center gap-3">
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer" onClick={e => e.stopPropagation()}>Approve</button>
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer" onClick={e => e.stopPropagation()}>Reject</button>
                        <button className="text-sm underline text-dark-navy cursor-pointer" onClick={stopAndToggle}>
                            {msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        </button>
                    </div>
                )}
                {(msg.subtype === 'note' || msg.subtype === 'general_inquiry') && (
                    <div className="flex items-center gap-3">
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer" onClick={e => e.stopPropagation()}>Send a message</button>
                        <button className="text-sm underline text-dark-navy cursor-pointer" onClick={stopAndToggle}>
                            {msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        </button>
                    </div>
                )}
                {msg.type === 'update' && (
                    <button className="text-sm underline text-dark-navy cursor-pointer" onClick={stopAndToggle}>
                        {msg.isRead ? 'Mark as unread' : 'Mark as read'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function InboxView() {
    const [activeTab, setActiveTab] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setMessages] = useState(DUMMY_MESSAGES);

    const toggleRead = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m));
        // Keep the detail panel in sync if this message is currently selected
        setSelectedMessage(prev => prev?.id === id ? { ...prev, isRead: !prev.isRead } : prev);
    };

    const filteredMessages = messages.filter(msg => {
        const tabMatch =
            activeTab === 'all' ||
            (activeTab === 'action' && msg.type === 'action') ||
            (activeTab === 'update' && msg.type === 'update');
        const readMatch =
            readFilter === 'all' ||
            (readFilter === 'read' && msg.isRead) ||
            (readFilter === 'unread' && !msg.isRead);
        return tabMatch && readMatch;
    });

    const handleMessageClick = (msg) => {
        setSelectedMessage(prev => prev?.id === msg.id ? null : msg);
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

    return (
        <div className="bg-staff-main-comp-bg rounded-[20px] h-full flex flex-col font-all overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-3">
                <h1 className="text-3xl font-bold text-dark-navy">Inbox</h1>
                <button className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-500 hover:bg-staff-main-comp-hover transition-colors cursor-pointer">
                    send a message
                </button>
            </div>

            {/* Tabs + Read filter */}
            <div className="flex items-center mx-7 my-2 px-2 py-1 gap-2 border border-gray-300 rounded-full">
                <div className="flex items-center gap-2 flex-1">
                    <TabBtn tabKey="all" label="ALL" count={messages.length} />
                    <TabBtn tabKey="action" label="Action Required" />
                    <TabBtn tabKey="update" label="Updates" />
                </div>
                <div className="flex items-center gap-2">
                    <FilterBtn filterKey="unread" label="Unread" />
                    <FilterBtn filterKey="read" label="Read" />
                    <FilterBtn filterKey="all" label="ALL" />
                </div>
            </div>

            {/* Hint */}
            <p className="px-8 pb-1 text-xs text-gray-600">click to see details</p>

            {/* Body: message list + optional detail panel */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-100">
                {/* Message list */}
                <div className="flex-1 overflow-y-auto scrollbar-purple">
                    {filteredMessages.length === 0 ? (
                        <p className="text-center text-gray-400 mt-12 text-sm">No messages</p>
                    ) : (
                        filteredMessages.map(msg => (
                            <MessageItem
                                key={msg.id}
                                msg={msg}
                                isSelected={selectedMessage?.id === msg.id}
                                onClick={() => handleMessageClick(msg)}
                                onToggleRead={toggleRead}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
