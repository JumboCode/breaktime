import Calendar from "./Calendar";
import Notifications from "./Notifications";
import NextBookings from "./NextBookings";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";

const SideBar = ({ userType, bookings = [], onViewAllClick, onDayClick, onOpenInbox, onOpenAppointments, onOpenBooking, onOpenNotification, unreadCount = 0, notifications = [], onDismiss }) => {
    const { user } = useUser();


    return (
        <div>
            {userType === 'Staff' ?
                <div className="flex flex-col h-[calc(100vh-120px)] w-[350px]">
                    <h1 className="text-white text-[42px] mb-8 leading-12">Welcome Back, {user.firstName}!</h1>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="h-fit border-2 border-dark-purple rounded-3xl p-4"><Calendar bookings={bookings} onViewAllClick={onViewAllClick} onDayClick={onDayClick}/></div>
                        <div className="h-6/20 border-2 border-dark-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType} onOpenInbox={onOpenInbox} unreadCount={unreadCount} notifications={notifications} onDismiss={onDismiss} onOpenNotification={onOpenNotification}/></div>
                        
                    </div>
                </div>
            :
                <div className="flex flex-col h-[calc(100vh-120px)] w-[350px]"> 
                    <h1 className="text-dark-navy text-[42px] mb-8 leading-12">Welcome Back, {user.username.toUpperCase()}!</h1>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="h-6/20 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><NextBookings onOpenAppointments={onOpenAppointments} onOpenBooking={onOpenBooking}/></div>
                        <div className="h-6/20 border-2 border-bright-purple rounded-3xl p-4 overflow-hidden"><Notifications userType={userType} onOpenInbox={onOpenInbox} unreadCount={unreadCount} notifications={notifications} onDismiss={onDismiss} onOpenNotification={onOpenNotification}/></div>
                        <div className="text-dark-navy absolute bottom-0 mb-6">
                            Contact Us:
                            <br />
                            (508) 319 - 1679
                            <br />
                            resourcehub@breaktime.org
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

SideBar.propTypes = {
    userType: PropTypes.string,
    bookings: PropTypes.array,
    onViewAllClick: PropTypes.func,
    onDayClick: PropTypes.func,
    onOpenInbox: PropTypes.func,
    onOpenAppointments: PropTypes.func,
    onOpenBooking: PropTypes.func,
    onOpenNotification: PropTypes.func,
    unreadCount: PropTypes.number,
    notifications: PropTypes.array,
    onDismiss: PropTypes.func,
};

export default SideBar;