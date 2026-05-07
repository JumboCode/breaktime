import { useState } from "react";
import { apiCall } from "../utils/general";

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
        return timestamp;
    }
}

function MessageItem({ msg, isSelected, onClick, onToggleRead }) {
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
                {msg.type === 'UPDATE' ? <UpdateIcon /> : <ActionIcon />}
            </div>

            <div className="flex-1 min-w-0">
                <span className="font-bold text-dark-navy text-base">{msg.title}</span>
                <p className="text-sm text-gray-500 mt-1">
                    {msg.bookingID ? `Booking #${msg.bookingID}` : 'General Inquery'}
                </p>
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

export default function InboxView({ messages = [], setMessages }) {
    const [activeTab, setActiveTab] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);

    const toggleRead = (id) => {
        const msg = messages.find(m => m._id === id);
        const newIsRead = !msg.isRead;

        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newIsRead } : m));
        setSelectedMessage(prev => prev?._id === id ? { ...prev, isRead: newIsRead } : prev);

        apiCall('/notification/markRead', 'PATCH', { _id: id, isRead: newIsRead }, null)
            .catch(err => console.error('Failed to update read status:', err));
    };

    const filteredMessages = messages.filter(msg => {
        const tabMatch =
            activeTab === 'all' ||
            (activeTab === 'action' && msg.type === 'ALERT') ||
            (activeTab === 'update' && msg.type === 'UPDATE');
        const readMatch =
            readFilter === 'all' ||
            (readFilter === 'read' && msg.isRead) ||
            (readFilter === 'unread' && !msg.isRead);
        return tabMatch && readMatch;
    });

    const handleMessageClick = (msg) => {
        setSelectedMessage(prev => prev?._id === msg._id ? null : msg);
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
                    <TabBtn tabKey="all" label="ALL" count={messages.filter(m => !m.isRead).length} />
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
                                key={msg._id}
                                msg={msg}
                                isSelected={selectedMessage?._id === msg._id}
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
