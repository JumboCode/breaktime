import Calendar from 'react-calendar';
import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import '../sidecalendar.css';
import { toDateStr } from '/src/utils/general.js';

/**
 * SideCalendar - Sidebar calendar widget for the staff landing page
 *
 * Displays a mini calendar with indicator dots on dates that have bookings:
 *   - Purple dot: date has at least one active booking
 *   - Red dot: date has at least one booking with an approved time extension
 *
 * @param {Array}    bookings        - Array of booking objects
 * @param {Function} onViewAllClick  - Called when "View All Bookings" is clicked;
 *                                     receives the currently displayed month's Date
 */
const SideCalendar = ({ bookings = [], onViewAllClick, onDayClick }) => {
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  /**
   * Build lookup sets for fast date → indicator lookups.
   * Keys are ISO date strings (YYYY-MM-DD).
   */
  const { bookedDates, pendingDates } = useMemo(() => {
    const booked = new Set();
    const pending = new Set();

    bookings.forEach((booking) => {
      // Skip inactive bookings
      if (booking.active === false || booking.status === 'inactive') return;

      // Resolve the date string (YYYY-MM-DD) from the booking
      let dateStr = null;

      if (booking.date) {
        // Frontend format
        dateStr = booking.date;
      } else if (booking.duration && booking.duration.length > 0) {
        // Backend format – derive actual date from day name relative to today
        const dayMap = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
          thursday: 4, friday: 5, saturday: 6,
        };
        const targetDay = dayMap[booking.duration[0].day] ?? 0;
        const today = new Date();
        const diff = targetDay - today.getDay();
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() + diff);
        dateStr = toDateStr(eventDate);
      }

      if (!dateStr) return;

      booked.add(dateStr);

      // Mark as accommodated if a time extension was approved
      if (Array.isArray(booking.activity) && booking.activity.some(a => a[0] === 'approved')) {
        pending.add(dateStr);
      }
    });

    return { bookedDates: booked, pendingDates: pending };
  }, [bookings]);

  /**
   * tileContent – renders indicator dots inside each calendar tile
   */
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const key = toDateStr(date);
    const hasBooking = bookedDates.has(key);
    const hasPending = pendingDates.has(key);

    if (!hasBooking && !hasPending) return null;

    return (
      <div className="side-cal-dots">
        {hasPending && <span className="side-cal-dot dot-red" />}
        {hasBooking && <span className="side-cal-dot dot-purple" />}
      </div>
    );
  };

  /**
   * tileClassName – adds 'current-week-tile' to every day in the current week
   */
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    if (date >= startOfWeek && date <= endOfWeek) return 'current-week-tile';
    return null;
  };

  const handleViewAll = () => {
    if (onViewAllClick) onViewAllClick(activeStartDate);
  };

  return (
    <div className="side-cal-wrapper">
      {/* Header row */}
      <div className="side-cal-header">
        <span className="side-cal-title">Bookings</span>
        <button className="side-cal-view-all" onClick={handleViewAll}>
          View All Bookings
        </button>
      </div>

      <Calendar
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate: d }) => setActiveStartDate(d)}
        tileContent={tileContent}
        tileClassName={tileClassName}
        /* Hide the "drill-up" prev2/next2 buttons */
        prev2Label={null}
        next2Label={null}
        /* Don't let users drill into decade/year views */
        minDetail="month"
        showNavigation={true}
        onClickDay={(date) => onDayClick && onDayClick(date)}
        locale="en-US"
      />

      {/* Legend */}
      <div className="side-cal-legend">
        <span className="side-cal-legend-item italic">
          Confirmed Bookings <span className="side-cal-dot dot-purple" />
        </span>
        <span className="side-cal-legend-item italic">
          Provided Accommodations <span className="side-cal-dot dot-red" />
        </span>
      </div>
    </div>
  );
};

SideCalendar.propTypes = {
  bookings: PropTypes.array,
  onViewAllClick: PropTypes.func,
  onDayClick: PropTypes.func,
};

export default SideCalendar;