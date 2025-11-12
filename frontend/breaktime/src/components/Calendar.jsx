import { useState } from "react";
import CalendarPlaceholder from "../assets/navigation/Calendar.png";

function Calendar() {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl text-white">Bookings</h3>
                <span className="text-light-grey opacity-[60%] underline text-sm cursor-pointer">View All Bookings (20+)</span>
            </div>
            <img className="h-[170px]" src={CalendarPlaceholder}/>
        </div>
    );
}

export default Calendar;