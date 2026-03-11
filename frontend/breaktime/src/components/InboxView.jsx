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
];

const SERVICE_BADGE_COLORS = {
    'Shower Service': 'bg-cyan-200 text-cyan-900',
    'Laundry Service': 'bg-emerald-200 text-emerald-900',
};

// Filled medium-purple circle with white checkmark — used for update messages
const UpdateIcon = () => (
    <div className="w-10 h-10 rounded-full bg-dark-purple flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" stroke="white">
            <path d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

// Filled red circle with white exclamation — used for action-required messages
const ActionIcon = () => (
    <div className="w-10 h-10 rounded-full bg-red flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-xl leading-none select-none">!</span>
    </div>
);

function ServiceBadge({ service }) {
    const colorClass = SERVICE_BADGE_COLORS[service] || 'bg-gray-200 text-gray-800';
    return (
        <span className={`${colorClass} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}>
            {service}
        </span>
    );
}

function ExtraTimeBadge({ time }) {
    return (
        <span className="bg-lime-200 text-lime-900 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
            {time}
        </span>
    );
}

function NoteBadge({ note }) {
    const truncated = note.length > 38 ? note.slice(0, 38) + '...' : note;
    return (
        <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full max-w-[260px] truncate inline-block">
            {truncated}
        </span>
    );
}

function MessageItem({ msg, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-4 px-8 py-4 border-b border-gray-100 cursor-pointer transition-colors
                ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
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

                {/* Inline action controls — visual only (no backend yet) */}
                {msg.subtype === 'extra_time' && (
                    <div className="flex items-center gap-4 mt-2">
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer">Approve</button>
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer">Reject</button>
                        <button className="text-sm underline text-gray-400 ml-auto cursor-pointer">Mark as read</button>
                    </div>
                )}
                {(msg.subtype === 'note' || msg.subtype === 'general_inquiry') && (
                    <div className="flex items-center mt-2">
                        <button className="text-sm underline text-dark-navy font-medium cursor-pointer">Send a message</button>
                        <button className="text-sm underline text-gray-400 ml-auto cursor-pointer">Mark as read</button>
                    </div>
                )}
                {msg.type === 'update' && (
                    <div className="flex items-center mt-2">
                        <button className="text-sm underline text-gray-400 ml-auto cursor-pointer">
                            {msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        </button>
                    </div>
                )}
            </div>

            {/* Timestamp */}
            <div className="text-sm text-gray-400 flex-shrink-0 mt-1">
                {msg.timeAgo}
            </div>
        </div>
    );
}

function DetailPanel({ message, onClose }) {
    const isUpdate = message.type === 'update';

    return (
        <div className="w-[380px] flex-shrink-0 border-l border-dashed border-gray-200 flex flex-col overflow-y-auto p-6">
            {/* Panel header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {isUpdate ? <UpdateIcon /> : <ActionIcon />}
                    <span className="font-bold text-dark-navy text-lg leading-tight">{message.title}</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer flex-shrink-0 ml-2"
                >
                    ×
                </button>
            </div>

            <p className="text-sm text-gray-400 mb-5">{message.detailDate}</p>

            {/* Extra time detail */}
            {message.subtype === 'extra_time' && (
                <>
                    <div className="border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
                        <div className="flex gap-3 text-sm">
                            <span className="text-gray-500 w-24 flex-shrink-0">Requested:</span>
                            <span className="text-red font-semibold">+30 minutes</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <span className="text-gray-500 w-24 flex-shrink-0">Note:</span>
                            <span className="text-dark-navy italic">"{message.note}"</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 bg-red text-white rounded-full py-2 font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                            Approve
                        </button>
                        <button className="flex-1 border border-gray-300 text-dark-navy rounded-full py-2 font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            Reject
                        </button>
                    </div>
                </>
            )}

            {/* Note / general inquiry detail */}
            {(message.subtype === 'note' || message.subtype === 'general_inquiry') && (
                <>
                    <div className="border border-gray-200 rounded-xl p-4 mb-5">
                        <div className="flex gap-3 text-sm">
                            <span className="text-gray-500 w-12 flex-shrink-0">Note:</span>
                            <span className="text-dark-navy italic">"{message.note}"</span>
                        </div>
                    </div>
                    <button className="w-full bg-red text-white rounded-full py-2 font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity">
                        Send A Message
                    </button>
                </>
            )}

            {/* Update (confirmed/modified/canceled) detail */}
            {isUpdate && (
                <div className="border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                    {message.subtype === 'confirmed' && 'This booking has been confirmed.'}
                    {message.subtype === 'modified' && 'This booking has been modified.'}
                    {message.subtype === 'canceled' && 'This booking has been canceled.'}
                </div>
            )}
        </div>
    );
}

export default function InboxView() {
    const [activeTab, setActiveTab] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);

    const filteredMessages = DUMMY_MESSAGES.filter(msg => {
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
                    ? 'bg-indigo-purple text-white'
                    : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}{count !== undefined ? ` ${count}` : ''}
        </button>
    );

    const FilterBtn = ({ filterKey, label }) => (
        <button
            onClick={() => setReadFilter(filterKey)}
            className={`text-sm font-medium px-3 py-1 rounded-full transition-colors cursor-pointer
                ${readFilter === filterKey
                    ? 'bg-indigo-purple text-white'
                    : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-white rounded-[20px] h-full flex flex-col font-all overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-3">
                <h1 className="text-3xl font-bold text-dark-navy">Inbox</h1>
                <button className="border border-gray-300 rounded-full px-4 py-1 text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                    send a message
                </button>
            </div>

            {/* Tabs + Read filter */}
            <div className="flex items-center px-8 py-3 gap-2">
                <div className="flex items-center gap-2 flex-1">
                    <TabBtn tabKey="all" label="ALL" count={DUMMY_MESSAGES.length} />
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
            <p className="px-8 pb-1 text-xs text-gray-400">click to see details</p>

            {/* Body: message list + optional detail panel */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-100">
                {/* Message list */}
                <div className="flex-1 overflow-y-auto scrollbar">
                    {filteredMessages.length === 0 ? (
                        <p className="text-center text-gray-400 mt-12 text-sm">No messages</p>
                    ) : (
                        filteredMessages.map(msg => (
                            <MessageItem
                                key={msg.id}
                                msg={msg}
                                isSelected={selectedMessage?.id === msg.id}
                                onClick={() => handleMessageClick(msg)}
                            />
                        ))
                    )}
                </div>

                {/* Detail panel — appears when a message is selected */}
                {selectedMessage && (
                    <DetailPanel
                        message={selectedMessage}
                        onClose={() => setSelectedMessage(null)}
                    />
                )}
            </div>
        </div>
    );
}
