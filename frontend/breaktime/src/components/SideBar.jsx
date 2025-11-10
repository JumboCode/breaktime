import { useState } from "react";
import Calendar from "./Calendar";
import Notifications from "./Notifications";


function SideBar() {
    const [notificationData, setNotificationData] = useState({
        numNotifications: 0 // Get notification data from notifications tab??
    });

    const isSidebarOpen = true;
    
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] p-[30px] pt-[10px] w-md">
            <h1 className="text-white text-[42px] mb-8 leading-12">Welcome Back, Labubu!</h1>
            <div className="flex flex-col gap-6 h-full">
                <div className="h-fit border-2 border-dark-purple rounded-3xl p-4"><Calendar/></div>
                <div className="h-6/20 border-2 border-dark-purple rounded-3xl p-4 overflow-hidden"><Notifications/></div>

            </div>
        </div>
    );

}

export default SideBar;