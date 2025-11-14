import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../customcalendar.css';

const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, onView, view }) {
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
          <button className="calendar-nav-buttons">add new</button>
          <input type="search" className="calendar-nav-buttons" placeholder="search for booking..."/>
          <button className="calendar-nav-buttons">all bookings</button>
        </span>
      </div>
    </div>
  );
}

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const myEventsList = [
    {
      title: 'Meeting',
      start: new Date(2025, 10, 15, 10, 0, 0),
      end: new Date(2025, 10, 15, 12, 0, 0),
    },
    {
      title: 'Lunch',
      start: new Date(2025, 10, 25, 13, 0, 0),
      end: new Date(2025, 10, 25, 14, 0, 0),
    },
  ];

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={date}
        onNavigate={setDate}
        view={view}
        onView={setView}
        components={{
          toolbar: (props) => <CustomToolbar {...props} view={view} />
        }}
      />
    </div>
  );
};

export default MyCalendar;