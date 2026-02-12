import { useState } from "react";
import Calendar from "./Calendar";
import Notifications from "./Notifications";
import NextBookings from "./NextBookings";
import { useModal } from "./popup/useModal";
import { useModal } from "./popup/useModal";

const SideBar = ({ userType }) => {
    const [notificationData, setNotificationData] = useState({
        numNotifications: 0 // Get notification data from notifications tab??
    });
    const { openModal } = useModal();

    const isSidebarOpen = true;


    return (
        <div>
            {userType === 'Staff' ?
                <div className="flex flex-col h-[calc(100vh-120px)] w-[350px]">
                    <h1 className="text-white text-[42px] mb-8 leading-12">Welcome Back, Labubu!</h1>
                    <div className="flex flex-col gap-6 h-full">
                        <button
                            onClick={() => openModal("add")}
                            className="bg-lime text-indigo-purple font-semibold py-3 px-6 rounded-full hover:opacity-90 transition-opacity"
                        >
                            + Add Booking
                        </button>
                        <div className="h-fit border-2 border-dark-purple rounded-3xl p-4"><Calendar/></div>
                        <div className="h-6/20 border-2 border-dark-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType}/></div>
                        <div className="text-light-purple-subtle absolute bottom-0 mb-6">
                            Contact Us:
                            <br />
                            (508) 319 - 1679
                            <br />
                            info@breaktime.org
                        </div>
                    </div>
                </div>
            :
                <div className="flex flex-col h-[calc(100vh-120px)] w-[350px]"> 
                    <h1 className="text-dark-navy text-[42px] mb-8 leading-12">Welcome Back, Labubu!</h1>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="h-6/20 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><NextBookings/></div>
                        <div className="h-6/20 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType}/></div>
                        <div className="text-dark-navy absolute bottom-0 mb-6">
                            Contact Us:
                            <br />
                            (508) 319 - 1679
                            <br />
                            info@breaktime.org
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default SideBar;