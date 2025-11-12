import { useState } from "react";

function Notifications() {
    class Notification {
        constructor(id, title, message) {
            this.id = id;
            this.title = title;
            this.message = message;
        }
    }

    const [visibleNotifications, setVisibleNotifications] = useState([
        new Notification(1, "New Booking", "2 hrs ago"),
        new Notification(2, "Cancellation", "1 day ago"),
        new Notification(3, "Update Required", "3 hrs ago"),
        new Notification(4, "Reminder", "5 hrs ago"),
        new Notification(5, "New Message", "1 day ago")
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
                <span className="text-light-grey opacity-[60%] underline text-sm cursor-pointer">Open Inbox ({visibleNotifications.length})</span>
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
                            className="bg-dark-purple rounded-2xl p-[4px]"
                        >
                            <div className="rounded-2xl p-3 flex items-center gap-3 relative h-14">

                            <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-dark-purple font-semibold">?</span>
                            </div>
                            

                            <div className="flex-1 text-white">
                                <h4 className=" text-md font-semibold">{notification.title}</h4>

                                <p className="text-sm mt-1">{notification.message}</p>
                            </div>
                            <button className="px-3 py-[2px] absolute bottom-[2px] right-2 border-1 border-lime-500 text-white rounded-full text-sm cursor-pointer hover:bg-lime-500 hover:text-dark-navy transition-colors">
                                More
                            </button>
                            
                            <button
                                onClick={() => handleDeleteNotification(notification.id)}
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
}

export default Notifications;