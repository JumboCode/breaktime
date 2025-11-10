import { useState } from "react";
import Calender from "./Calender";
import Notifications from "./Notifications";


function SideBar() {
    const [notificationData, setNotificationData] = useState({
        numNotifications: 0 // Get notification data from notifications tab??
    });

    const isSidebarOpen = true;
    
    return (
        <div className="flex flex-col h-screen bg-indigo-purple p-3 w-md">
            <h1 className="text-white text-2xl font-semibold mb-6">Welcome Back Labubu!</h1>
            <div className="flex flex-col gap-6 h-full">
                <div className="border-2 border-light-purple rounded-2xl p-4 flex-shrink-0"><Calender />
                </div>
                <div className="h-5/20 border-2 border-light-purple rounded-2xl p-2 overflow-hidden"><Notifications />
                </div>
            </div>
        
        </div>
    );

}

export default SideBar;