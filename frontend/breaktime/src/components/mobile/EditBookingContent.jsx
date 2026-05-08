import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiCall } from '/src/utils/general.js';
import { FailurePopup, SuccessPopup } from '/src/components/popups/staff_booking/LandingStatusPopups';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;

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

const getDayFromDate = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
};

const calculateTimes = (timeSlot) => {
    const [time, period] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const totalMinutes = minutes + 30;
    hours += Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    const endTime = `${String(hours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    return { startTime, endTime };
};

export default function EditBookingContent({ booking, onCancel, onSuccess }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [showPopup, setShowPopup] = useState(null);
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const mobile = isMobile();

    const s = mobile ? {
        container: "flex flex-col gap-[3vw] font-poppins",
        heading: "text-[5vw] text-dark-navy font-medium",
        label: "text-[4vw] text-[#2F2F2F]",
        pill: "px-[3vw] py-[1vw] rounded-2xl bg-[#D6DFFF] text-[4vw] text-[#262445]",
        timeButton: "px-[3vw] py-[1.5vw] rounded-3xl text-[3.5vw] cursor-pointer transition-colors bg-[#ABB9FF] text-[#262445]",
        primaryBtn: "flex-1 py-[3vw] bg-[#B27DED] text-[#F0F7F2] text-[4vw] rounded-2xl",
        outlineBtn: "flex-1 py-[3vw] border border-[#B27DED] text-[#B27DED] text-[4vw] rounded-2xl",
        placeholder: "text-[3.5vw] opacity-70",
        chevronSize: windowWidth * 0.05,
    } : {
        container: "flex flex-col gap-4 font-poppins",
        heading: "text-[22px] text-dark-navy font-medium",
        label: "text-[22px] text-[#2F2F2F]",
        pill: "px-4 py-2 rounded-2xl bg-[#D6DFFF] text-[18px] text-[#262445]",
        timeButton: "px-4 py-2 rounded-3xl text-[16px] cursor-pointer transition-colors bg-[#ABB9FF] text-[#262445]",
        primaryBtn: "flex-1 py-3 bg-[#B27DED] text-[#F0F7F2] text-[18px] rounded-2xl",
        outlineBtn: "flex-1 py-3 border border-[#B27DED] text-[#B27DED] text-[18px] rounded-2xl",
        placeholder: "text-[16px] opacity-70",
        chevronSize: 20,
    };

    const calendarNaturalWidth = 400;
    const calendarNaturalHeight = 420;
    const calendarScale = mobile ? (windowWidth * 0.9) / calendarNaturalWidth : 1;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const handleDateChange = (date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
            setSelectedTime('');
        } else {
            setSelectedDate(date);
            setSelectedTime('');
        }
    };

    const handleUpdate = async () => {
        if (!selectedDate || !selectedTime) {
            setShowPopup('failure');
            return;
        }

        const { startTime, endTime } = calculateTimes(selectedTime);
        const bookingID = booking.bookingID || booking.id;
        const newTimestamp = selectedDate.toISOString().split('T')[0];
        const newDuration = { day: getDayFromDate(selectedDate), startTime, endTime };

        try {
            await apiCall('/booking/edit', 'PUT', {
                bookingID,
                timestamp: newTimestamp,
                duration: newDuration,
            }, null);
            setPendingUpdate({ timestamp: newTimestamp, duration: newDuration });
            setShowPopup('success');
        } catch (error) {
            console.error('Error updating booking:', error);
            setShowPopup('failure');
        }
    };

    return (
        <div className={s.container}>
            <p className={s.heading}>Editing your booking.</p>

            {/* Calendar */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Date</span>
                <style>{calendarStyles}</style>
                <div style={{
                    transform: `scale(${calendarScale})`,
                    transformOrigin: 'top left',
                    width: mobile ? `${calendarNaturalWidth}px` : 'auto',
                    height: mobile ? `${calendarNaturalHeight * calendarScale - 100}px` : 'auto',
                }}>
                    <Calendar
                        className="border-none [&&]:bg-transparent! [&&]:border-0!"
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={tomorrow}
                        nextLabel={<ChevronRight strokeWidth={6} color="#B27DED" />}
                        prevLabel={<ChevronLeft strokeWidth={6} color="#B27DED" />}
                        next2Label={null}
                        prev2Label={null}
                    />
                </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Time</span>
                {selectedDate ? (
                    <div className="flex gap-[2vw] flex-wrap">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedTime(slot)}
                                className={`${s.timeButton} ${selectedTime === slot ? 'opacity-100' : 'opacity-40'}`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className={s.placeholder}>Select a day to see available time slots</p>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-[3vw] mt-[2vw]">
                <button onClick={onCancel} className={s.outlineBtn}>Cancel</button>
                <button
                    onClick={handleUpdate}
                    className={`opacity-40 hover:opacity-100 ${s.primaryBtn}`}
                >
                    Update
                </button>
            </div>

            {showPopup === 'failure' && (
                <FailurePopup onClose={() => setShowPopup(null)} />
            )}
            {showPopup === 'success' && (
                <SuccessPopup onClose={() => { setShowPopup(null); onSuccess(pendingUpdate); }} />
            )}
        </div>
    );
}

EditBookingContent.propTypes = {
    booking: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};
