import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiCall } from '/src/utils/general.js';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export default function ServiceGuidelines({ service }) {
    const [expandedSection, setExpandedSection] = useState(null);
    const [serviceData, setServiceData] = useState(null);

    const mobile = isMobile();

    useEffect(() => {
        apiCall('/service/getService', 'POST', { serviceID: service.name.toLowerCase() })
            .then(data => setServiceData(data))
            .catch(() => console.error('Failed to fetch service data'));
    }, [service.name]);

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

    const rules = serviceData?.rules ?? {};

    const allSections = [
        { id: "expectations", title: "Expectations & Rules", content: rules.expectations },
        { id: "provided", title: "What's Provided", content: rules.provided },
        { id: "bring", title: "What You Need to Bring", content: rules.bring },
    ];

    const sections = allSections.filter(s => typeof s.content === 'string' && s.content.length > 0);

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
                                <p className={s.contentText}>{section.content}</p>
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
