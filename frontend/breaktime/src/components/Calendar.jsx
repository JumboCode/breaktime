import SideCalendar from "./SideCalendar";

function Calendar({ bookings = [], onViewAllClick }) {
    return (
        <div className="h-full flex flex-col">
            <SideCalendar bookings={bookings} onViewAllClick={onViewAllClick} />
        </div>
    );
}

export default Calendar;