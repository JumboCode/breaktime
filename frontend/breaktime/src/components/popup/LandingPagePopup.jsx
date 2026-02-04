import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from "react";
import ServiceImage from "../../assets/popup-icons/ServiceImage.png";
import ButtonGoBack from "../../assets/popup-icons/ButtonGoBack.png";
import BookButton from "../../assets/popup-icons/BookButton.png";
import SubmitButton from "../../assets/popup-icons/SubmitButton.png";


function LandingPagePopup() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const [serviceInfoOpen, setServiceInfoOpen] = useState(false);

    const sections = [
    {
        id: "expectations",
        title: "Expectations & Rules",
        content: [
        "1. Make sure you clean before you use",
        "2. Make sure you clean again before you use",
        "3. Please make sure you clean before you use",
        ],
    },
        { id: "provided", title: "What's Provided", content: ["TBD"] },
        { id: "bring", title: "What You Need to Bring", content: ["TBD"] },
        { id: "notices", title: "Notices / Messages", content: ["TBD"] },
    ];

    
    const toggleSection = (id) => {
        setExpandedSection((prev) => (prev === id ? null : id));
    };

    const handleBookingClick = () => {
        setIsBooking(true);
    };

    return (
        <div className="min-h-screen w-full bg-[#F0F7F2] font-poppins relative">
            <div className="absolute bottom-2 top-16 left-20 w-[1250px] h-[680px] 
            border-1 border-solid border-[#B27DED] rounded-lg font-poppins cursor-pointer">
                <img
                    src={ButtonGoBack}
                    alt="Go Back Button"
                    className="w-[150px] h-[47px] mb-4 mt-2 ml-2"
                />

                <div className="flex flex-col">
                    <h2 className = "text-6xl font-thin text-[#B27DED] text-align ml-30 font-poppins mt-10">
                    Shower <br></br>Service</h2>
                    <img
                        src={ServiceImage}
                        alt="Service"
                        className="w-[300px] ml-30 mt-7"
                    />
                    {!isBooking? (<button onClick={handleBookingClick} className="">
                        <img
                            src={BookButton}
                            alt="Book button"
                            className="w-[150px] h-[47px] ml-30 mt-7"
                        />
                    </button> ): (
                        <button type="button" onClick={() => console.log("Booking Submitted!")}>
                            <img
                                src={SubmitButton}
                                alt="Submit button"
                                className="w-[150px] h-[47px] ml-30 mt-7 cursor-pointer"
                            />
                        </button>
                    )}
                </div>

                <div className="absolute top-10 right-10">
                    {!isBooking ? (
                        <div className="w-[520px] mt-40 mr-30 mt-7 h-[360px] scrollbar-purple overflow-y-auto
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
                    <div className="w-[520px] grid mr-[120px] mt-5 flex flex-col gap-4 ">
                        <button type="button"
                            onClick={() => setUserInfoOpen((p) => !p)}
                            className="w-full flex items-center text-left"
                        >
                            <div className="flex flex-row grid-cols-3 items-center">
                            <div className="flex items-center gap-4 w-[150px]">
                            <span className="text-[22px] font-small text-[#2F2F2F]"> User Info </span>
                            <ChevronRight strokeWidth={4} color="#B27DED" />
                            </div>

                            <div className="px-8 py-3 mr-5 rounded-full bg-[#B9FF00] text-[#2F2F2F] text-[18px] font-small"> YA User</div>
                            <div className="px-8 py-3 rounded-full bg-[#ABB9FF] text-[#2F2F2F] text-[18px] font-small"> 123123 </div>
                            </div>
                        </button>
                   
                        {userInfoOpen && (
                            <div className="flex flex-row items-center ml-45 w-[150px]">
                                <div className="flex items-center gap-6">
                                    <div className="text-[18px] mr-6 font-small text-[#2F2F2F]">
                                        Name
                                    </div>
                                <div className="px-8 py-3 ml-8 rounded-full bg-[#D6DFFF] text-[18px] font-small">
                                    Allen
                                </div>
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
                            <div className="ml-8 mt-1 text-[18px] font-small">
                                <div className="grid grid-cols-[60px_auto] items-start gap-y-5">
                                <div>Date</div>
                                <div className="ml-15 origin-top-left scale-80">
                                    <Calendar
                                    className="border-none"
                                    nextLabel={<ChevronRight strokeWidth={2} />}
                                    prevLabel={<ChevronLeft strokeWidth={2} />}
                                    />
                                </div>

                                <div>Time</div>
                                <div className="text-gray-400 ml-10">
                                    Select a day to see available time slots
                                </div>

                                <div className="w-[200px]">Request for more time?</div>
                                <div className="ml-40">
                                    <div className="px-10 py-4 rounded-full w-[200px] bg-[#D6DFFF] text-[#6B7280] text-[18px] text-center">
                                    +30 minutes
                                    </div>
                                </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    );
}
export default LandingPagePopup;
