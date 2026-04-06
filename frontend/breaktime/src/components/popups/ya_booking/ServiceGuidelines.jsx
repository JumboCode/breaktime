import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import PropTypes from 'prop-types';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

const serviceDetails = {
    "Laundry": {
        expectations: ["The Resource Hub's Laundry Center allows you to leave Breaktime with cleaned and dried clothes. One cycle, which includes both washing and drying, takes 90 minutes, though you remain in the space for up to three hours. While you wait for your clothes to dry, you're welcome to hang out in our Resource Hub, play some games, charge your devices, and/or chat with Breaktime staff."],
        provided: ["Laundry Machines", "Laundry Detergent", "Folding area"],
        bring: ["Clothes for washing"],
    },
    "Test Store Appointment": {
        expectations: ["The Resource Hub's no-cost store offers clothing, hygiene products, menstrual products, and food to shop visitors. Feel free to stock up on everything you need at the Breaktime store without worry about costs."],
        provided: ["Staff at Breaktime's resource hub will help you select items from the store. They'll also note items needed at \"check-out\" so that we can restock for future visitors, and they'll offer a bag with which you can take your things."],
        bring: ["Nothing!"],
    },
    "Shower": {
        expectations: ["You can book a 20-minute shower appointment in Breaktime's Resource Hub. The Hub's brand-new showers can help you feel refreshed and energized as you continue with your day. When you shower at Breaktime, you're welcome to spend up to 90 minutes in our space."],
        provided: ["Shampoo", "Conditioner", "Body Wash", "Towel", "Shower Shoes", "Shower Caddy"],
        bring: ["Nothing!"],
    },
};

export default function ServiceGuidelines({ service }) {
    const [expandedSection, setExpandedSection] = useState(null);

    const mobile = isMobile();

    const s = mobile ? {
        container: "overflow-y-auto pr-[3vw]",
        sectionWrapper: "mb-[5vw]",
        sectionButton: "w-full flex items-center gap-[2vw] text-left text-[4.5vw] font-medium text-[#2F2F2F]",
        contentWrapper: "mt-[2vw] pl-[4vw] space-y-[1vw]",
        contentText: "text-[3.5vw] font-thin",
        chevronSize: 18,
    } : {
        container: "scrollbar-purple overflow-y-auto pr-4",
        sectionWrapper: "mb-8",
        sectionButton: "w-full flex items-center gap-3 text-left text-[22px] font-medium text-[#2F2F2F]",
        contentWrapper: "mt-4 pl-6 space-y-2",
        contentText: "text-[18px] font-thin",
        chevronSize: 24,
    };

    const details = serviceDetails[service?.name] ?? { expectations: ["TBD"], provided: ["TBD"], bring: ["TBD"] };

    const sections = [
        { id: "expectations", title: "Expectations & Rules", content: details.expectations },
        { id: "provided", title: "What's Provided", content: details.provided },
        { id: "bring", title: "What You Need to Bring", content: details.bring },
        { id: "notices", title: "Notices / Messages", content: ["TBD"] },
    ];

    const toggleSection = (id) => {
        setExpandedSection((prev) => (prev === id ? null : id));
    };

    return (
        <div className={s.container}>
            {sections.map((section) => {
                const isOpen = expandedSection === section.id;
                return (
                    <div key={section.id} className={s.sectionWrapper}>
                        <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className={s.sectionButton}
                        >
                            <span>{section.title}</span>
                            {isOpen
                                ? <ChevronDown strokeWidth={4} color="#B27DED" size={s.chevronSize} />
                                : <ChevronRight strokeWidth={4} color="#B27DED" size={s.chevronSize} />
                            }
                        </button>
                        {isOpen && (
                            <div className={s.contentWrapper}>
                                {section.content.map((item, i) => (
                                    <p key={i} className={s.contentText}>{item}</p>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

ServiceGuidelines.propTypes = {
    service: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};