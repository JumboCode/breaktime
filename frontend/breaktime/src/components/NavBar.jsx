import Breaktime_Secondary_Logo_SkyBlue from "/src/assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import Breaktime_Secondary_Logo_MidnightBlue from "/src/assets/logos-icons/Logo_Secondary/Breaktime_Secondary_MidnightBlue.png";
import { useState } from "react";
import { useClerk } from '@clerk/clerk-react';

const NavBar = ({ isSidebarOpen, onToggle, userType, currentView, onViewChange, unreadCount = 0 }) => {
    const { signOut } = useClerk();

    const toggleSidebar = () => {
        if (onToggle) onToggle(!isSidebarOpen);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className={`flex h-[80px] ${userType === 'Staff' ? 'bg-indigo-purple' : 'bg-light-grey'} font-all gap-[20px] pr-[40px] pl-[40px] items-center`}>
            <button onClick={toggleSidebar} className="select-none">
                {unreadCount > 0 && (
                    <div className="h-[22px] w-[22px] bg-lime-500 text-indigo-purple font-semibold rounded-[11px] text-center justify-self-end relative top-[8px] left-[6px]">{unreadCount}</div>
                )}
                <div className="flex items-end">
                    <svg className={`h-[24px] ${userType === 'Staff' ? 'stroke-light-purple' : 'stroke-dark-navy'} hover:stroke-lime-500 transition-colors cursor-pointer`} width="49" height="31" viewBox="0 0 49 31" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="4" strokeLinecap="round">
                        <line x1="2" y1="2" x2="47" y2="2"/>
                        <line x1="2" y1="11" x2="47" y2="11"/>
                        <line x1="2" y1="20" x2="47" y2="20"/>
                        <line x1="2" y1="29" x2="47" y2="29"/>
                    </svg>
                </div>
            </button>

            <div className="h-full py-2">
                <img src={userType === 'Staff' ? Breaktime_Secondary_Logo_SkyBlue : Breaktime_Secondary_Logo_MidnightBlue} className="h-full object-contain"/>
            </div>

            <div className={`bg-lime-500 ${userType === 'YA' ? 'border border-dark-navy' : ''} text-indigo-purple font-semibold text-xl rounded-[24px] px-[20px] py-[5px] flex items-center justify-center`}>
                {userType === 'Staff' ? 'Staff Portal' : 'YA USERS'}
            </div>

            {userType === 'Staff' ?
                <div className="flex items-end text-light-purple text-xl gap-[20px]">
                    <div className="font-semibold">View Bookings:</div>
                    <div className="flex gap-[20px] select-none">
                        <button
                            onClick={() => onViewChange('calendar')}
                            className={`cursor-pointer hover:underline w-[93px]
                                ${currentView === 'calendar' ? 'underline' : 'hover:font-semibold'}`}
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={`cursor-pointer hover:underline w-[93px]
                                ${currentView === 'list' ? 'underline' : 'hover:font-semibold'}`}
                        >
                            List
                        </button>
                    </div>
                    <button
                        onClick={() => onViewChange('inbox')}
                        className={`cursor-pointer hover:underline w-[110px]
                            ${currentView === 'inbox' ? 'underline font-semibold' : 'hover:font-semibold'}`}
                    >
                        View Inbox
                    </button>
                    <button
                        onClick={() => handleSignOut()}
                        className="cursor-pointer hover:underline hover:font-semibold w-[93px]"
                    >
                        Sign Out
                    </button>
                </div>
            : userType === 'YA' ?
                <div className="flex items-end text-dark-navy text-xl gap-[20px]">
                    <button
                        onClick={() => onViewChange('services')}
                        className={`cursor-pointer hover:underline w-[93px]
                            ${currentView === 'services' ? 'underline font-semibold' : 'hover:font-semibold'}`}
                    >
                        Services
                    </button>
                    <button
                        onClick={() => onViewChange('inbox')}
                        className={`cursor-pointer hover:underline w-[110px]
                            ${currentView === 'inbox' ? 'underline font-semibold' : 'hover:font-semibold'}`}
                    >
                        View Inbox
                    </button>
                </div>
            :
                <></>
            }
        </div>
    );
};

export default NavBar;