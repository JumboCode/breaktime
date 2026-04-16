import { useState } from "react";
import Calendar from "./Calendar";
import Notifications from "./Notifications";
import NextBookings from "./NextBookings";
import { useModal } from "./popups/staff_booking/useModal";
import { useUser } from "@clerk/clerk-react";

const SideBar = ({ userType, bookings = [], onViewAllClick, onDayClick }) => {
    const [notificationData, setNotificationData] = useState({
        numNotifications: 0 // Get notification data from notifications tab??
    });
    const { openModal } = useModal();
    const { user } = useUser();
    const isSidebarOpen = true;

    return (
        <div>
            {userType === 'Staff' ?
                <div className="flex flex-col h-[calc(100vh-120px)] w-[350px]">
                    <h1 className="text-white text-[clamp(2rem,4vw,2.625rem)] mb-4 leading-tight">Welcome Back, {user.firstName}!</h1>
                    <div className="flex flex-col gap-4 h-full min-h-0">
                        <div className="flex-[3] min-h-0 border-2 border-dark-purple rounded-3xl p-4 overflow-hidden"><Calendar bookings={bookings} onViewAllClick={onViewAllClick} onDayClick={onDayClick}/></div>
                        <div className="flex-[2] min-h-0 border-2 border-dark-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType}/></div>
                        <div className="text-light-purple-subtle mt-auto text-sm leading-relaxed shrink-0">
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
                    <h1 className="text-dark-navy text-[clamp(2rem,4vw,2.625rem)] mb-4 leading-tight">Welcome Back, {user.username.toUpperCase()}!</h1>
                    <div className="flex flex-col gap-4 h-full min-h-0">
                        <div className="flex-1 min-h-0 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><NextBookings/></div>
                        <div className="flex-1 min-h-0 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType}/></div>
                        <div className="text-dark-navy mt-auto text-sm leading-relaxed shrink-0">
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