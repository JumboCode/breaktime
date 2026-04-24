import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../customcalendar.css';
import { useModal } from '/src/components/popups/staff_booking/useModal.js';

// Initialize moment as the date localizer for react-big-calendar
const localizer = momentLocalizer(moment);

/**
 * bookingToEvent - Converts a booking object to a calendar event format
 *
 * The calendar requires events with { id, title, start, end } format.
 * Bookings can come in two formats:
 *   1. Frontend format: { date: "2026-02-03", startTime: "09:00", endTime: "10:00" }
 *   2. Backend format: { duration: [{ day: "monday", startTime: "09:00", endTime: "10:00" }] }
 *
 * This function handles both formats and converts them to Date objects.
 *
 * @param {Object} booking - The booking object to convert
 * @returns {Object} Calendar event with id, title, start, end, and resource (original booking)
 */
const bookingToEvent = (booking) => {
  let startDate, endDate;

  if (booking.date && booking.startTime) {
    // CASE 1: Frontend format - has actual date string (YYYY-MM-DD)
    // Parse the date and time strings into Date objects
    const [year, month, day] = booking.date.split('-').map(Number);
    const [startHour, startMin] = (booking.startTime || '09:00').split(':').map(Number);
    const [endHour, endMin] = (booking.endTime || '10:00').split(':').map(Number);

    // Create Date objects (month is 0-indexed in JavaScript)
    startDate = new Date(year, month - 1, day, startHour, startMin);
    endDate = new Date(year, month - 1, day, endHour, endMin);

  } else if (booking.duration && booking.duration.length > 0) {
    // CASE 2: Backend format - has duration array with day name (e.g., "monday")
    // We need to calculate the actual date from the day name
    const duration = booking.duration[0];
    const today = new Date();

    // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
    const targetDay = dayMap[duration.day] || 0;
    const currentDay = today.getDay();
    const diff = targetDay - currentDay;

    // Calculate the date for this day of the week
    const eventDate = new Date(today);
    eventDate.setDate(today.getDate() + diff);

    // Parse the time strings
    const [startHour, startMin] = duration.startTime.split(':').map(Number);
    const [endHour, endMin] = duration.endTime.split(':').map(Number);

    startDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), startHour, startMin);
    endDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), endHour, endMin);

  } else {
    // CASE 3: Fallback - no valid date info, use current time
    startDate = new Date();
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
  }

  return {
    id: booking.id || booking.bookingID,
    title: booking.client || booking.userID || 'Booking', // Display client name, fallback to userID
    start: startDate,
    end: endDate,
    resource: booking, // Store original booking data - used when clicking on event
  };
};

/**
 * CustomToolbar - Custom toolbar component for the calendar
 * Includes navigation buttons, view switchers, and "add new" button
 */
function CustomToolbar({ label, onNavigate, onView, view, onAddNew }) {
  return (
    <div className="rbc-toolbar">
      <div className="toolbar-top-row">

        <span className="rbc-toolbar-label label-group">{label}</span>

        <span className="rbc-btn-group nav-group">
          <button onClick={() => onNavigate("PREV")}></button>
          <button onClick={() => onNavigate("TODAY")}>Today</button>
          <button onClick={() => onNavigate("NEXT")}></button>
        </span>

        <span className="scheduling-color-bar">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </span>

        <span className="rbc-btn-group view-group calendar-nav-buttons">
          <button
            className={view === "month" ? "active-calendar-view" : ""}
            onClick={() => onView("month")}
          >
            Monthly
          </button>

          <button
            className={view === "week" ? "active-calendar-view" : ""}
            onClick={() => onView("week")}
          >
            Weekly
          </button>
        </span>

      </div>

      <div className="toolbar-bottom-row">
        <span className="rbc-btn-group actions-group">
          {/* "add new" button - opens the Add Booking modal */}
          <button className="calendar-nav-buttons" onClick={onAddNew}>add new</button>
          <input type="search" className="calendar-nav-buttons" placeholder="search for booking..."/>
          <button className="calendar-nav-buttons">all bookings</button>
        </span>
      </div>
    </div>
  );
}

/**
 * CustomEvent - Custom event rendering component
 * Displays time and title for each event on the calendar
 */
const CustomEvent = ({ event }) => {
  const timeString = event.start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  return (
    <div>
      <span className="event-time">{timeString}</span>
      <span > </span>
      <span className="event-title">{event.title}</span>
    </div>
  );
};

/**
 * MyCalendar - Main calendar component
 *
 * Features:
 * - Displays bookings as calendar events
 * - Click on empty slot → opens Add Booking modal with date pre-filled
 * - Click on existing event → opens Modify Booking modal
 * - Click "add new" button → opens Add Booking modal
 *
 * @param {Array} bookings - Array of booking objects to display
 */
const MyCalendar = ({ bookings = [], date: dateProp, onNavigate: onNavigateProp, view: viewProp, onView: onViewProp }) => {
  const [internalDate, setInternalDate] = useState(new Date());
  const date = dateProp ?? internalDate;
  const setDate = onNavigateProp ?? setInternalDate;
  const [internalView, setInternalView] = useState('month');
  const view = viewProp ?? internalView;
  const setView = onViewProp ?? setInternalView;
  const { openModal } = useModal(); // Hook to control modal state

  /**
   * handleAddNew - Called when "add new" button is clicked
   * Opens the Add Booking modal without any pre-filled data
   */
  const handleAddNew = () => {
    openModal("add");
  };

  /**
   * handleSelectEvent - Called when user clicks on an existing event
   * Opens the Modify Booking modal with the booking data
   *
   * @param {Object} event - The calendar event that was clicked
   *                         event.resource contains the original booking data
   */
  const handleSelectEvent = (event) => {
    openModal("modify", event.resource);
  };

  /**
   * handleSelectSlot - Called when user clicks on an empty calendar slot
   * Opens the Add Booking modal with the selected date pre-filled
   *
   * @param {Object} slotInfo - Contains start/end dates of the selected slot
   */
  const handleSelectSlot = (slotInfo) => {
    // Convert the selected date to YYYY-MM-DD format for the form
    const selectedDate = slotInfo.start.toISOString().split('T')[0];
    openModal("add", { date: selectedDate });
  };

  // Convert all bookings to calendar event format
  const events = bookings.map(bookingToEvent);

  return (
    <div>
      <Calendar
        className="main-bookings-calendar"
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        selectable                        // Enable clicking on empty slots
        onSelectEvent={handleSelectEvent} // Handler for clicking on events
        onSelectSlot={handleSelectSlot}   // Handler for clicking on empty slots
        components={{
          toolbar: (props) => <CustomToolbar {...props} view={view} onAddNew={handleAddNew}/>,
          event: CustomEvent
        }}
      />
    </div>
  );
};

MyCalendar.propTypes = {
  bookings: PropTypes.array,
  date: PropTypes.instanceOf(Date),
  onNavigate: PropTypes.func,
  view: PropTypes.string,
  onView: PropTypes.func,
};

export default MyCalendar;
