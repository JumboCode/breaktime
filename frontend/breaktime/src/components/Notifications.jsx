import { useState } from "react";

function Notifications() {

    const [visibleNotifications, setVisibleNotifications] = useState([
        { id: 1, title: "New Booking", message: "2 hrs ago" },
        { id: 2, title: "Cancellation", message: "1 day ago" },
        { id: 3, title: "Update Required", message: "3 hrs ago" },
        { id: 4, title: "Reminder", message: "5 hrs ago" },
        { id: 5, title: "New Message", message: "1 day ago" }
    ]);


    const handleDeleteNotification = (id) => {
        setVisibleNotifications(prevNotifications => 
            prevNotifications.filter(notification => notification.id !== id)
        );
    };

    return (
        <div className="h-full flex flex-col">

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl text-white">Notifications</h3>
                <span className="text-light-purple text-sm">Open Inbox ({visibleNotifications.length})</span>
            </div>
            

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar">
                {visibleNotifications.length === 0 ? (
                    <div className="text-center py-8 text-light-purple">
                        No new notifications
                    </div>
                ) : (
                    visibleNotifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className="bg-dark-purple rounded-2xl p-[2px]"
                        >
                            <div className="rounded-2xl p-3 flex items-center gap-3 relative h-12">

                            <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-dark-purple font-semibold">?</span>
                            </div>
                            

                            <div className="flex-1">
                                <h4 className="font-normal text-white text-base">
                                    {notification.title}

                                <p className=" text-sm mt-1">
                                    {notification.message}
                                </p>
                                </h4>
                            </div>
                            

                            <button className="px-4 border-2 border-lime-500 text-white rounded-full text-sm font-normal hover:bg-lime-500 hover:text-dark-navy transition-colors mt-[8%] mb-[5%] text-xs">
                                More
                            </button>
                            

                            <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                  className="absolute top-0 right-2 text-lime-500 hover:text-lime-500/80 text-2xl font-normal leading-none w-6 h-6 flex items-center justify-center text-md"
                                aria-label="Delete notification"
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
}

export default Notifications;