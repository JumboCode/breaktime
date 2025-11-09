import { useState } from "react";

function Notifications() {
    // Hardcoded notifications array for testing
    const [visibleNotifications, setVisibleNotifications] = useState([
        { id: 1, title: "New Booking", message: "2 hrs ago" },
        { id: 2, title: "Cancellation", message: "1 day ago" },
        { id: 3, title: "Update Required", message: "3 hrs ago" },
        { id: 4, title: "Reminder", message: "5 hrs ago" },
        { id: 5, title: "New Message", message: "1 day ago" }
    ]);

    // Handle notification deletion
    const handleDeleteNotification = (id) => {
        setVisibleNotifications(prevNotifications => 
            prevNotifications.filter(notification => notification.id !== id)
        );
    };

    return (
        <div className="bg-indigo-purple rounded-2xl p-5 w-full max-w-md border-2 border-indigo-purple font-all font-light">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl text-white">Notifications</h3>
                <span className="text-light-purple text-sm">Open Inbox (20+)</span>
            </div>
            
            {/* Scrollable notifications container */}
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                {visibleNotifications.length === 0 ? (
                    <div className="text-center py-8 text-light-purple">
                        No new notifications
                    </div>
                ) : (
                    visibleNotifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className="bg-dark-purple rounded-2xl p-4 flex items-center gap-3 relative border-2 border-dark-purple"
                        >
                            {/* Icon placeholder */}
                            <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-dark-purple font-semibold">?</span>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1">
                                <h4 className="font-normal text-white text-base">
                                    {notification.title}

                                <p className=" text-sm mt-1">
                                    {notification.message}
                                </p>
                                </h4>
                            </div>
                            
                            {/* More button */}
                            <button className="px-4 py-1 border-2 border-lime-500 text-lime-500 rounded-full text-sm font-normal hover:bg-lime-500 hover:text-dark-navy transition-colors mt-[8%]">
                                More
                            </button>
                            
                            {/* Close button */}
                            <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="absolute top-3 right-3 text-lime-500 hover:text-lime-500/80 text-2xl font-normal leading-none w-6 h-6 flex items-center justify-center"
                                aria-label="Delete notification"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notifications;