import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../customcalendar.css';


const localizer = momentLocalizer(moment);

function CustomToolbar({ label, onNavigate, onView }) {
  return (
    <div className="rbc-toolbar">

      <span className="rbc-btn-group nav-group">
        <button onClick={() => onNavigate("BACK")}></button>
        <button onClick={() => onNavigate("TODAY")}>Today</button>
        <button onClick={() => onNavigate("NEXT")}></button>
      </span>

      <span className="rbc-toolbar-label label-group">{label}</span>

      <span className="rbc-btn-group view-group">

        <button onClick={() => onView("month")}>Month</button>
        <button onClick={() => onView("week")}>Week</button>


        

      </span>
      <span className="rbc-btn-group actions-group">
        <button>
          add new
        </button>
        <search>
          search for booking..
        </search>
        <button>
          all bookings
        </button>
      </span>

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
          toolbar: CustomToolbar
        }}
        
      />
    </div>
  );
};

export default MyCalendar;