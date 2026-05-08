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

const Notifications = ({ userType, onOpenInbox, unreadCount = 0, notifications = [], onDismiss }) => {
    const visible = notifications.filter(n => !n.wasNotified && !n.isRead);

    // Colors that change based on Staff view vs YA view
    const notificationTextColor = userType === "Staff" ? "text-white" : "text-dark-navy";
    const notificationBoxColor = userType === "Staff" ? "bg-dark-purple" : "bg-bright-purple";
    const openInboxTextColor = userType === "Staff" ? "text-light-grey" : "text-dark-navy";

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold text-xl ${notificationTextColor}`}>Notifications</h3>
                <span onClick={onOpenInbox} className={`${openInboxTextColor} opacity-[60%] underline text-sm cursor-pointer`}>Open Inbox ({unreadCount})</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar">
                {visible.length === 0 ? (
                    <div className="text-center py-8 text-light-purple">
                        No new notifications
                    </div>
                ) : (
                    visible.map((notification) => (
                        <div
                            key={notification._id}
                            className={`${notificationBoxColor} rounded-2xl p-[4px]`}
                        >
                            <div className="rounded-2xl p-3 flex items-center gap-3 relative h-14">
                                <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-dark-purple font-semibold">?</span>
                                </div>

                                <div className="flex-1 text-white">
                                    <h4 className="text-md font-semibold">{notification.title}</h4>
                                    <p className="text-sm mt-1">{getTimeAgo(notification.timestamp)}</p>
                                </div>

                                <button className="px-3 py-[2px] absolute bottom-[2px] right-2 border-1 border-lime-500 text-white rounded-full text-sm cursor-pointer hover:bg-lime-500 hover:text-dark-navy transition-colors">
                                    More
                                </button>

                                <button
                                    onClick={() => onDismiss(notification._id)}
                                    className="absolute top-0 right-2 text-lime-500 hover:text-lime-500/80 cursor-pointer text-3xl font-normal leading-none w-6 h-6 flex items-center justify-center text-md"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
