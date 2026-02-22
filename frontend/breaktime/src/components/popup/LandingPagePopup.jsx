import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from "react";
import ServiceImage from "../../assets/popup-icons/ServiceImage.png";
import ButtonGoBack from "../../assets/popup-icons/ButtonGoBack.png";
import BookButton from "../../assets/popup-icons/BookButton.png";
import { FailurePopup, ConfirmationPopup, SuccessPopup } from './LandingStatusPopups';
import { apiCall } from "../../utils/general.js";
import { useUser } from '@clerk/clerk-react';



function LandingPagePopup({onClose, service }) {
    const [expandedSection, setExpandedSection] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [serviceInfoOpen, setServiceInfoOpen] = useState(false);
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [extraTime, setExtraTime] = useState('');
    const [note, setNote] = useState('');

    const [showPopup, setShowPopup] = useState(null);
    const [clientName, setClientName] = useState('')

    // Available time slots
    const timeSlots = [
        "9:00 AM", "9:30 AM", "10:00 AM"
    ];

    // Extra time options
    const extraTimeOptions = [
        "+30 minutes",
    ];

    const serviceDetails = {
        "Laundry": {
            expectations: [
                "The Resource Hub’s Laundry Center allows you to leave Breaktime with cleaned and dried clothes. One cycle, which includes both washing and drying, takes 90 minutes, though you remain in the space for up to three hours. While you wait for your clothes to dry, you’re welcome to hang out in our Resource Hub, play some games, charge your devices, and/or chat with Breaktime staff.",
            ],
            provided: ["Laundry Machines", "Laundry Detergent", "Folding area"],
            bring: ["Clothes for washing"],
        },
        "Test Store Appointment": {
            expectations: [
                "The Resource Hub’s no-cost store offers clothing, hygiene products, menstrual products, and food to shop visitors. Feel free to stock up on everything you need at the Breaktime store without worry about costs.",
            ],
            provided: [
                "Staff at Breaktime’s resource hub will help you select items from the store. They’ll also note items needed at “check-out” so that we can restock for future visitors, and they’ll offer a bag with which you can take your things.",
            ],
            bring: ["Nothing!"],
        },
        "Shower": {
            expectations: [
                "You can book a 20-minute shower appointment in Breaktime’s Resource Hub. The Hub’s brand-new showers can help you feel refreshed and energized as you continue with your day. When you shower at Breaktime, you’re welcome to spend up to 90 minutes in our space.",
            ],
            provided: ["Shampoo", "Conditioner", "Body Wash", "Towel", "Shower Shoes", "Shower Caddy"],
            bring: ["Nothing!"],
        },
    };

    const details = serviceDetails[service?.name] ?? { expectations: ["TBD"], provided: ["TBD"], bring: ["TBD"] };
    console.log("service name:", service?.name);
    const sections = [
        { id: "expectations", title: "Expectations & Rules", content: details.expectations },
        { id: "provided", title: "What's Provided", content: details.provided },
        { id: "bring", title: "What You Need to Bring", content: details.bring },
        { id: "notices", title: "Notices / Messages", content: ["TBD"] },
    ];

    const handleGoBack = () => {
        setShowPopup(null);
        setIsBooking(false);
        setSelectedDate(null);
        setSelectedTime('');
        setExtraTime('');
        setNote('');
        setUserInfoOpen(false);
        setServiceInfoOpen(false);
        onClose();
    };

    const calculateTimes = (timeSlot, extraTime) => {
        // Parse "9:00 AM" into hours and minutes
        const [time, period] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // Start time in "HH:MM" format
        const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        // Default slot is 30 min, add extra time if selected
        let totalMinutes = minutes + 30;
        if (extraTime === '+30 minutes') totalMinutes += 30;

        hours += Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        const endTime = `${String(hours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

        return { startTime, endTime };
    };
    
    const toggleSection = (id) => {
        setExpandedSection((prev) => (prev === id ? null : id));
    };

    const handleBookingClick = () => {
        setIsBooking(true);
    };


    const handleDateChange = (date) => {
        // If clicking the same date, unselect it
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            setSelectedDate(null);
            setSelectedTime(''); // Also clear the selected time
        } else {
            setSelectedDate(date);
            setSelectedTime(''); // Reset time when date changes
        }
    };

    // Submit button handler
    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) {
            setShowPopup('failure');
        } else {
            setShowPopup('confirmation');
        }
    };

    const getDayFromDate = (dateString) => {
        if (!dateString) return 'monday';
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const date = new Date(dateString);
            return days[date.getDay()] || 'monday';
        };
    
    const { user, isLoaded, isSignedIn } = useUser();

    const handleConfirm = async () => {
        if (!isLoaded) return;          
        if (!isSignedIn || !user) return;
        const { startTime, endTime } = calculateTimes(selectedTime, extraTime);

        try {
            const requestData =  {
                userID: user.id,
                serviceID: service?.name || "Service",
                duration: [{
                    day: getDayFromDate(selectedDate),
                    startTime: startTime,  
                    endTime: endTime,    
                }],
                clientName: clientName.trim(),
            };

            const response = await apiCall('/booking/create', 'POST', requestData, null);
            setShowPopup('success');
        } catch (error) {
            console.error("Error creating booking:", error);
            setShowPopup('failure');
        }
    };

    const handleSuccessClose = () => {
        setShowPopup(null);
        setIsBooking(false);
        setSelectedDate(null);
        setSelectedTime('');
        setExtraTime('');
        setNote('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F0F7F2] font-poppins text-[#262445]">
        <div className="overflow-auto h-[100vh] w-full bg-[#F0F7F2] font-poppins text-[#262445] relative">
            <div className="absolute bottom-2 top-16 left-20 w-[90%] h-[84%] items-center justify-center 
            border-1 border-solid border-[#B27DED] rounded-lg font-poppins cursor-pointer">
                <button 
                    type="button" 
                    onClick={handleGoBack} 
                    className="mb-4 mt-2 ml-2 flex gap-2 font-poppins items-center justify-center w-[140px] h-[45px] bg-[#B27DED] 
                    text-[#F0F7F2] font-normal text-lg rounded-2xl pr-2 pb-1 py-1 hover:bg-[#943BF6] hover:underline">
                    <ChevronLeft strokeWidth={7} color="#F0F7F2"/>
                    go back
                </button>
                

                <div className="flex flex-col">
                    <h2 className="text-6xl font-thin text-[#B27DED] text-align ml-30 font-poppins mt-10 max-w-[400px] break-words">
                        {service?.name ?? "Service"}
                    </h2>

                    <img
                    src={service?.imageImport ?? ServiceImage}
                    alt={service?.name ?? "Service"}
                    className="w-[300px] ml-30 mt-7"
                    />
                    {!isBooking? ( <button 
                          type="button"
                            onClick={handleBookingClick} 
                            className="flex gap-2 font-poppins items-center justify-center hover:bg-[#943BF6] hover:underline mt-4 ml-31 w-[160px] h-[50px] bg-[#B27DED] text-[#F0F7F2] font-normal text-lg rounded-2xl pl-1 py-1"
                        > Book Now <ChevronRight strokeWidth={7} color="#F0F7F2" />
                    </button> ): (
                    <button 
                            type="button" 
                            onClick={handleSubmit}
                            className="mt-4 ml-60 w-[180px] h-[45px] opacity-40 hover:opacity-100 active:opacity-100 bg-[#B27DED] text-[#F0F7F2] font-normal text-lg rounded-2xl p-0"
                        > Submit Booking
                    </button>
                    )}
                </div>

                <div className="absolute top-10 right-10 font-poppins">
                    {!isBooking ? (
                        <div className="w-[520px] mt-50 mr-30 mt-7 h-[360px] scrollbar-purple overflow-y-auto
                         pr-4 ">
                            {sections.map((section) => {
                                const isOpen = expandedSection === section.id;
                            return (
                                <div key={section.id} className="mb-8">
                                {/* header row */}
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.id)}
                                    className="
                                    w-full flex items-center gap-3
                                    text-left
                                    text-[22px] font-medium text-[#2F2F2F]
                                    "
                                >
                                    <span>{section.title}</span>
                                    {isOpen ? <ChevronDown strokeWidth={4} color="#B27DED" /> : <ChevronRight strokeWidth={4} color="#B27DED" />}
                                </button>
                                {isOpen && (
                                    <div className="mt-4 pl-6 space-y-2">
                                    {section.content.map((item, i) => (
                                        <p key={i} className="text-[18px] font-thin">
                                        {item}
                                        </p>
                                    ))}
                                    </div>
                                )}
                                </div>
                            );
                            })}
                        </div>
                    ) : (
                    <div className="w-[520px] mt-20 grid mr-[120px] mt-5 flex flex-col gap-4 font-poppins">
                        <button type="button"
                            onClick={() => setUserInfoOpen((p) => !p)}
                            className="w-full flex items-left text-left"
                        >
                            <div className="flex flex-row items-center">
                            <div className="flex items-center gap-4 w-[150px]">
                            <span className="text-[22px] font-small text-[#2F2F2F]"> User Info </span>
                            <ChevronRight strokeWidth={4} color="#B27DED" />
                            </div>

                            <div className="px-8 py-2 mr-5 rounded-2xl bg-[#B9FF00] text-[#2F2F2F] text-[18px] font-small"> YA User</div>
                            <div className="px-15 py-2 rounded-2xl bg-[#ABB9FF] text-[#2F2F2F] text-[18px] font-small"> 123123 </div>
                            </div>
                        </button>
                   
                        {userInfoOpen && (
                            <div className="flex flex-row items-center ml-47 w-[150px]">
                                <div className="flex items-center gap-x-5">
                                    <div className="text-[18px] mr-6 font-poppins font-small text-[#2F2F2F]">
                                        Name
                                    </div>
                               <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Enter your name"
                                    className="px-4 py-2 ml-5 rounded-2xl bg-[#D6DFFF] text-[18px] font-small text-[#262445] outline-none border-none focus:ring-0 placeholder-[#262445]/50 w-[180px]"
                                />
                                </div>
                            </div>
                            )}

                        <div className="flex gap-0 items-start flex-row">
                        <button type="button"
                            onClick={() => setServiceInfoOpen((p) => !p)}
                            className="flex items-center text-left"
                        >

                            <div className="flex items-center gap-4 w-[150px]">
                            <span className="text-[22px] font-small text-[#2F2F2F]"> Service </span>
                            <ChevronRight strokeWidth={4} color="#B27DED" />
                            </div>
                        </button>
                        
                        {serviceInfoOpen && (
                            <div className="ml-8 mt-1 text-[18px] font-poppins font-small">
                                <div className="grid grid-cols-[60px_auto] items-start gap-y-5">
                                <div>Date</div>
                                <>
                                  <style>{`
                                    .react-calendar__tile--active {
                                    background: #ABB9FF !important;
                                    border-radius: 50%;
                                    color: black !important;
                                    text-decoration: underline 1px solid #262445;
                                    justify-content: center;
                                    align-items: center;

                                    }

                                    /* Hover state for tiles */
                                    .react-calendar__tile:hover {
                                    background: #D6DFFF !important;
                                    border-radius: 50%;
                                    }

                                    /* Today's date when selected */
                                    .react-calendar__tile--now:enabled:hover,
                                    .react-calendar__tile--now:enabled:active{
                                    }

    
                                    /* Month/Year label */
                                    .react-calendar__navigation__label {
                                    font-size: 20px;
                                    font-weight: 500;
                                    color: #262445;;
                                    background: transparent !important;
                                    font-family: 'Poppins';
                                    align-items: left;
                                    }

                                    /* Today's date - no style*/
                                    .react-calendar__tile--now {
                                    background: transparent;
                                    color: inherit !important;
                                    }

                                    /* Disabled dates (outside current month) */
                                    .react-calendar__month-view__days__day--neighboringMonth {
                                    color: 262445 !important;
                                    opacity: 30%;
                                    }

                                    /* Weekend days */
                                    .react-calendar__month-view__days__day--weekend {
                                    color: #262445;
                                    font-family: 'Poppins';
                                    }

                                    .react-calendar__nextLabel, .react-calendar__prevLabel {
                                    background: transparent !important;
                                    }

                                    /* All tiles (date cells) */
                                    .react-calendar__tile {
                                    padding: auto;
                                    font-size: 18px;
                                    font-family: 'Poppins';
                                    color: #262445;
                                    }

                                    /* Day labels (Mon, Tue, Wed, etc.) */
                                    .react-calendar__month-view__weekdays {
                                    font-size: 18px;
                                    font-weight: 500;
                                    color: #262445;
                                    text-transform: uppercase;
                                    font-family: 'Poppins';
                                    padding: 5px -2px;
                                    }

                                    /* Individual day label (each abbr element) */
                                    .react-calendar__month-view__weekdays__weekday {
                                    padding: 5px 0px;
                                    text-align: center;
                                    }

                                    /* Remove underline from abbreviation */
                                    .react-calendar__month-view__weekdays__weekday abbr {
                                    text-decoration: none;
                                    cursor: default;
                                    }
                                  `}</style>
                                  <div className="ml-15 origin-top-left scale-80">
                                    <Calendar
                                        className="border-none [&&]:!bg-transparent [&&]:!border-0"
                                        onChange={handleDateChange}
                                        value={selectedDate}
                                        nextLabel={<ChevronRight strokeWidth={6} color="#B27DED" />}
                                        prevLabel={<ChevronLeft strokeWidth={6} color="#B27DED" />}
                                        next2Label={null}
                                        prev2Label={null}
                                    />
                                </div>
                                </>

                                <div className="-mt-17">Time</div>
                                <div className="-mt-17 ml-10">
                                    {selectedDate ? (
                                        <div className="flex gap-3 flex-wrap">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={`px-4 py-2 opacity-40 rounded-3xl text-[16px] cursor-pointer transition-colors ${
                                                        selectedTime === slot 
                                                            ? 'bg-[#ABB9FF] text-[#262445] opacity-100' 
                                                            : 'bg-[#ABB9FF] text-[#262445] hover:bg-[#c0cbff]'
                                                    }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-[##262445] opacity-70">
                                            Select a day to see available time slots
                                        </div>
                                    )}
                                </div>

                                <div className="-mt-8 w-[200px]">Request for more time?</div>
                                <div className="-mt-9 ml-42">
                                    <button
                                        type="button"
                                        onClick={() => setExtraTime(prev => prev === '+30 minutes' ? '' : '+30 minutes')}
                                        className={`px-4 py-2 rounded-3xl w-[160px] bg-[#ABB9FF] text-[#262445] text-[18px] text-center cursor-pointer ${
                                            extraTime === '+30 minutes' ? 'opacity-100' : 'opacity-40'
                                        }`}
                                    >
                                        +30 minutes
                                    </button>
                                </div>

                                <div className="-mt-2 w-[200px]">Leave a note</div>
                                <div className="-mt-1 ml-18">
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="(optional) request any accommodation ..."
                                        className="px-4 py-2 opacity-40 active:opacity-100 focus:opacity-100 rounded-3xl w-[260px] h-[70px] bg-[#D6DFFF] text-[#262445] text-[18px] resize-none outline-none placeholder-[#262445]"
                                    />
                                </div>
                                </div>
                            </div>                            
                            )}
                        </div>
                    </div>)}
                </div>
            </div>

            {/* Render popups */}
            {showPopup === 'failure' && <FailurePopup onClose={() => setShowPopup(null)} />}
            {showPopup === 'confirmation' && (
                <ConfirmationPopup 
                    onClose={() => setShowPopup(null)} 
                    onConfirm={handleConfirm}
                />
            )}
            {showPopup === 'success' && <SuccessPopup onClose={handleSuccessClose} />}
        </div>
        </div>
    );
}
export default LandingPagePopup;