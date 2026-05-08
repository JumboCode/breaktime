import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiCall, toDateStr, toDayName, toDisplayTime } from '/src/utils/general.js';
import { useUser } from '@clerk/clerk-react';
import { FailurePopup, ConfirmationPopup, SuccessPopup, DuplicateBookingPopup } from '/src/components/popups/staff_booking/LandingStatusPopups';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export default function BookingForm({ service, onSuccess }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [extraTime, setExtraTime] = useState('');
    const [note, setNote] = useState('');
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [serviceData, setServiceData] = useState(null);

    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        apiCall('/service/getService', 'POST', { serviceID: service.name.toLowerCase() })
            .then(data => setServiceData(data))
            .catch(() => console.error('Failed to fetch service data'));
    }, [service.name]);
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        }
        const dateStr = toDateStr(selectedDate);
        setLoadingSlots(true);
        setSelectedTime('');
        apiCall('/service/getTimeslots', 'POST', { serviceID: service.name.toLowerCase(), date: dateStr })
            .then(slots => {
                setTimeSlots(slots.map(s => toDisplayTime(s.startTime)));
            })
            .catch(() => setTimeSlots([]))
            .finally(() => setLoadingSlots(false));
    }, [selectedDate, service.name]);

    const mobile = isMobile();
    const calendarNaturalWidth = 400;
    const calendarNaturalHeight = 420;
    const calendarScale = mobile ? (windowWidth * 0.9) / calendarNaturalWidth : 1;

    const s = mobile ? {
        container: "flex flex-col gap-[3vw] font-poppins overflow-x-hidden px-[5vw]",
        label: "text-[4vw] text-[#2F2F2F]",
        badge: "px-[3vw] py-[1vw] rounded-2xl text-[4vw]",
        input: "px-[3vw] py-[1vw] rounded-2xl bg-[#D6DFFF] text-[4vw] text-[#262445] outline-none border-none w-[45vw]",
        timeButton: "px-[3vw] py-[1.5vw] rounded-3xl text-[3.5vw] cursor-pointer transition-colors bg-[#ABB9FF] text-[#262445]",
        extraTimeButton: "px-[3vw] py-[1.5vw] rounded-3xl w-[40vw] bg-[#ABB9FF] text-[#262445] text-[4vw] text-center cursor-pointer",
        textarea: "px-[3vw] py-[2vw] rounded-3xl w-full h-[20vw] bg-[#D6DFFF] text-[#262445] text-[4vw] resize-none outline-none",
        submitButton: "mt-[2vw] w-[45vw] py-[3vw] bg-[#B27DED] text-[#F0F7F2] text-[4vw] rounded-2xl",
        chevronSize: windowWidth * 0.05,
    } : {
        container: "flex flex-col gap-4 font-poppins overflow-x-hidden",
        label: "text-[22px] text-[#2F2F2F]",
        badge: "px-8 py-2 rounded-2xl text-[18px]",
        input: "px-4 py-2 rounded-2xl bg-[#D6DFFF] text-[18px] text-[#262445] outline-none border-none w-[180px]",
        timeButton: "px-4 py-2 rounded-3xl text-[16px] cursor-pointer transition-colors bg-[#ABB9FF] text-[#262445]",
        extraTimeButton: "px-4 py-2 rounded-3xl w-[160px] bg-[#ABB9FF] text-[#262445] text-[18px] text-center cursor-pointer",
        textarea: "px-4 py-1 rounded-3xl w-[260px] h-[60px] bg-[#D6DFFF] text-[#262445] text-[18px] resize-none outline-none",
        submitButton: "mt-4 w-[180px] h-[45px] bg-[#B27DED] text-[#F0F7F2] text-lg rounded-2xl",
        chevronSize: 20,
    };

    const handleDateChange = (date) => {
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
            setSelectedTime('');
        } else {
            setSelectedDate(date);
            setSelectedTime('');
        }
    };

    const calculateTimes = (timeSlot, extraTime, duration) => {
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        let totalMinutes = minutes + duration;
        if (extraTime === '+30 minutes') totalMinutes += 30;
        hours += Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        const endTime = `${String(hours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        return { startTime, endTime };
    };

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            setShowPopup('failure');
        } else {
            setShowPopup('confirmation');
        }
    };

    const handleConfirm = async () => {
        if (!isLoaded || !isSignedIn || !user) return;
        const { startTime, endTime } = calculateTimes(selectedTime, extraTime,  serviceData?.serviceDurationInterval || 30);
        const dateStr = toDateStr(selectedDate);
        try {
            await apiCall('/booking/create', 'POST', {
                userID: user.username,
                serviceID: service?.name?.toLowerCase() || "service",
                duration: { day: toDayName(dateStr), startTime, endTime },
                clientName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username,
                timestamp: dateStr,
                notes: note,
            }, null);
            setShowPopup('success');
        } catch (error) {
            console.error("Error creating booking:", error);
            setShowPopup(error?.status === 409 ? 'duplicate' : 'failure');
        }
    };

    return (
        <div className={s.container}>

            {/* User Info */}
            <button type="button" onClick={() => setUserInfoOpen((p) => !p)}
                className="w-full flex items-center text-left">
                <div className="flex flex-row items-center gap-[2vw]">
                    <span className={s.label}>User Info</span>
                    <ChevronRight strokeWidth={4} color="#B27DED" size={s.chevronSize} />
                    <div className={`${s.badge} bg-[#B9FF00] text-[#2F2F2F] mr-2`}>YA User</div>
                    <div className={`${s.badge} bg-[#ABB9FF] text-[#2F2F2F]`}>
                        {([user.firstName, user.lastName].filter(Boolean).join(' ') || user.username).toUpperCase()}
                    </div>
                </div>
            </button>

            {/* Calendar */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Date</span>
                <div style={{
                    transform: `scale(${calendarScale})`,
                    transformOrigin: 'top left',
                    width: mobile ? `${calendarNaturalWidth}px` : 'auto',
                    height: mobile ? `${(calendarNaturalHeight * calendarScale) - 100}px` : 'auto',
                }}>
                    <style>{`
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
                        .react-calendar__nextLabel, .react-calendar__prevLabel {
                            background: transparent !important;
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
                    `}</style>
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
                <span className={s.label}>Time</span>
                {selectedDate ? (
                    loadingSlots ? (
                        <div className={`opacity-70 ${mobile ? 'text-[3.5vw]' : 'text-[16px]'}`}>
                            Loading available times...
                        </div>
                    ) : timeSlots.length === 0 ? (
                        <div className={`opacity-70 ${mobile ? 'text-[3.5vw]' : 'text-[16px]'}`}>
                            No available times for this date
                        </div>
                    ) : (
                        <div className="flex gap-[1vw] flex-wrap">
                            {timeSlots.map((slot) => (
                                <button key={slot} type="button"
                                    onClick={() => setSelectedTime(slot)}
                                    className={`${s.timeButton} ${selectedTime === slot ? 'opacity-100' : 'opacity-40'}`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )
                ) : (
                    <div className={`opacity-70 ${mobile ? 'text-[3.5vw]' : 'text-[16px]'}`}>
                        Select a day to see available time slots
                    </div>
                )}
            </div>

            {/* Extra time */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Request for more time?</span>
                <button type="button"
                    onClick={() => setExtraTime(prev => prev === '+30 minutes' ? '' : '+30 minutes')}
                    className={`${s.extraTimeButton} ${extraTime === '+30 minutes' ? 'opacity-100' : 'opacity-40'}`}
                >
                    +30 minutes
                </button>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Leave a note</span>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="(optional) request any accommodation ..."
                    className={`opacity-40 focus:opacity-100 ${s.textarea}`}
                />
            </div>

            {/* Submit */}
            <button type="button" onClick={handleSubmit}
                className={`opacity-40 hover:opacity-100 ${s.submitButton}`}>
                Submit Booking
            </button>

            {/* Popups */}
            {showPopup === 'failure' && <FailurePopup onClose={() => setShowPopup(null)} />}
            {showPopup === 'duplicate' && <DuplicateBookingPopup onClose={() => setShowPopup(null)} />}
            {showPopup === 'confirmation' && (
                <ConfirmationPopup onClose={() => setShowPopup(null)} onConfirm={handleConfirm} />
            )}
            {showPopup === 'success' && <SuccessPopup onClose={() => { setShowPopup(null); onSuccess?.(); }} />}
        </div>
    );
}

BookingForm.propTypes = {
    service: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    onSuccess: PropTypes.func,
};