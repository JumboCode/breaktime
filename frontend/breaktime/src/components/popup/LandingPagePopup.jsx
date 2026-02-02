import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from "react";
import ServiceImage from "../../assets/popup-icons/ServiceImage.png";
import ButtonGoBack from "../../assets/popup-icons/ButtonGoBack.png";
import BookButton from "../../assets/popup-icons/BookButton.png";


function LandingPagePopup() {
    const [expandedSection, setExpandedSection] = useState("expectations");
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

    return (
        <div className="min-h-screen w-full bg-[#F0F7F2] relative">
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
                    <img
                        src={BookButton}
                        alt="Book button"
                        className="w-[150px] h-[47px] ml-30 mt-7"
                    />
                </div>

                <div className="absolute top-60 right-10">
                    <div className="w-[520px] mr-30 mt-7 h-[360px] scrollbar-purple overflow-y-auto
                         pr-4">
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
                </div>
            </div>
        </div>
    );
}
export default LandingPagePopup;
