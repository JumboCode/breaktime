import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../customcalendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const myEventsList = [
    {
      title: 'Meeting',
      start: new Date(2025, 10, 15, 10, 0, 0), // Year, Month (0-indexed), Day, Hour, Minute, Second
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
      />
    </div>
  );
};

export default MyCalendar;