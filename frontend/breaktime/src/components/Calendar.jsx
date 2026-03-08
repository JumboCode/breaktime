import SideCalendar from "./SideCalendar";

function Calendar({ bookings = [], onViewAllClick, onDayClick }) {
    return (
        <div className="h-full flex flex-col">
            <SideCalendar bookings={bookings} onViewAllClick={onViewAllClick} onDayClick={onDayClick} />
        </div>
    );
}

export default Calendar;