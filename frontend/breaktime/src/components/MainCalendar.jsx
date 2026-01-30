import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../customcalendar.css';
import { useModal } from './popup/useModal';

const localizer = momentLocalizer(moment);

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
          <button className="calendar-nav-buttons" onClick={onAddNew}>add new</button>
          <input type="search" className="calendar-nav-buttons" placeholder="search for booking..."/>
          <button className="calendar-nav-buttons">all bookings</button>
        </span>
      </div>
    </div>
  );
}

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

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const { openModal } = useModal();

  // TODO: Backend - GET /api/bookings to fetch events
  const myEventsList = [
    {
      id: 1,
      title: 'Meeting',
      client: 'John Doe',
      service: 'meeting',
      start: new Date(2025, 10, 15, 10, 0, 0),
      end: new Date(2025, 10, 15, 12, 0, 0),
    },
    {
      id: 2,
      title: 'Lunch',
      client: 'Jane Smith',
      service: 'meeting',
      start: new Date(2025, 10, 25, 13, 0, 0),
      end: new Date(2025, 10, 25, 14, 0, 0),
    },
  ];

  // Handle clicking on an event - opens view modal
  const handleSelectEvent = (event) => {
    const bookingData = {
      id: event.id,
      client: event.client || event.title,
      service: event.service || 'meeting',
      date: event.start.toISOString().split('T')[0],
      startTime: event.start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      endTime: event.end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    openModal("view", bookingData);
  };

  // Handle clicking on empty slot - opens add modal
  const handleSelectSlot = () => {
    openModal("add");
  };

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
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: (props) => <CustomToolbar {...props} view={view} onAddNew={() => openModal("add")}/>,
          event: CustomEvent
        }}
      />
    </div>
  );
};

export default MyCalendar;