import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const calendarStyles = `
    .react-calendar__tile--active {
        background: #ABB9FF !important;
        border-radius: 50%;
        color: black !important;
    }
    .react-calendar__tile:hover {
        background: #D6DFFF !important;
        border-radius: 50%;
    }
    .react-calendar__navigation__label {
        font-size: 20px;
        font-weight: 500;
        color: #262445;
        background: transparent !important;
        font-family: 'Poppins';
    }
    .react-calendar__tile--now {
        background: transparent;
        color: inherit !important;
    }
    .react-calendar__month-view__days__day--neighboringMonth {
        color: #262445 !important;
        opacity: 30%;
    }
    .react-calendar__month-view__days__day--weekend {
        color: #262445;
        font-family: 'Poppins';
    }
    .react-calendar__tile {
        padding: auto;
        font-size: 18px;
        font-family: 'Poppins';
        color: #262445;
    }
    .react-calendar__month-view__weekdays {
        font-size: 18px;
        font-weight: 500;
        color: #262445;
        text-transform: uppercase;
        font-family: 'Poppins';
    }
    .react-calendar__month-view__weekdays__weekday {
        padding: 5px 0px;
        text-align: center;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
        text-decoration: none;
        cursor: default;
    }
    .react-calendar__tile:disabled {
        background: transparent !important;
        color: #262445 !important;
        opacity: 20%;
        cursor: not-allowed;
    }
`;

const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM"];

export default function EditBookingContent({ booking, onCancel }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calendarNaturalWidth = 400;
    const calendarNaturalHeight = 420;
    const calendarScale = (windowWidth * 0.9) / calendarNaturalWidth;

    const handleDateChange = (date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
            setSelectedTime('');
        } else {
            setSelectedDate(date);
            setSelectedTime('');
        }
    };

    return (
        <div className="flex flex-col gap-[3vw]">
            <p className="text-[5vw] text-dark-navy font-medium">Editing your booking.</p>

            <div className="flex flex-col gap-[2vw]">
                <span className="text-[4vw] text-[#2F2F2F]">Service</span>
                <div className="px-[3vw] py-[2vw] bg-[#D6DFFF] rounded-2xl w-fit">
                    <span className="text-dark-navy text-[4vw]">{booking.serviceID}</span>
                </div>
            </div>

            {/* Calendar */}
            <div className="flex flex-col gap-[2vw]">
                <style>{calendarStyles}</style>
                <div style={{
                    transform: `scale(${calendarScale})`,
                    transformOrigin: 'top left',
                    width: `${calendarNaturalWidth}px`,
                    height: `${calendarNaturalHeight * calendarScale - 100}px`,
                }}>
                    <Calendar
                        className="border-none [&&]:!bg-transparent [&&]:!border-0"
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                        nextLabel={<ChevronRight strokeWidth={6} color="#B27DED" />}
                        prevLabel={<ChevronLeft strokeWidth={6} color="#B27DED" />}
                        next2Label={null}
                        prev2Label={null}
                    />
                </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-[2vw]">
                <span className="text-[4vw] text-[#2F2F2F]">Time</span>
                {selectedDate ? (
                    <div className="flex gap-[2vw] flex-wrap">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={`px-[3vw] py-[1.5vw] rounded-3xl text-[3.5vw] cursor-pointer transition-colors
                                    bg-[#ABB9FF] text-[#262445]
                                    ${selectedTime === slot ? 'opacity-100' : 'opacity-40'}`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-[3.5vw] opacity-70">Select a day to see available time slots</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-[3vw] mt-[2vw]">
                <button
                    onClick={onCancel}
                    className="flex-1 py-[3vw] border border-[#B27DED] text-[#B27DED] text-[4vw] rounded-2xl"
                >
                    cancel
                </button>
                <button className="flex-1 py-[3vw] bg-[#B27DED] text-white text-[4vw] rounded-2xl">
                    update
                </button>
            </div>
        </div>
    );
}

EditBookingContent.propTypes = {
    booking: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
};
