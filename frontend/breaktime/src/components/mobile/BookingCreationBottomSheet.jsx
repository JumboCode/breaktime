import PropTypes from 'prop-types';
import { useState } from 'react';
import BookingForm from '/src/components/popups/ya_booking/BookingForm';
import ServiceGuidelines from '/src/components/popups/ya_booking/ServiceGuidelines';

export default function BottomSheet({ service, defaultTab = 'book', onSuccess }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const defaultButtonStyle = "rounded-full flex-1 py-[5px] text-[5vw] text-gray-400 ";
    const activeTabStyle = " bg-[#b37ded] rounded-full font-medium text-white px-[3px]";

    return (
        <div className="px-[15px] py-[20px] rounded-t-4xl bg-[#ebebec] 
                        absolute bottom-0 left-0 right-0 top-[35vh] h-fit">
            <p className="text-dark-navy font-semibold text-[8vw]">
                {service.name}
            </p>

            {/* Booking/Guidelines Toggle */}
            <div className="border border-gray-300 w-full rounded-full
                        p-[3px] mt-[16px] flex justify-center items-center gap-2">
                <button className={defaultButtonStyle + (activeTab === 'book' ? activeTabStyle : "")}
                        onClick={() => setActiveTab('book')}>
                    Book
                </button>
                <button className={defaultButtonStyle + (activeTab === 'guidelines' ? activeTabStyle : "")}
                        onClick={() => setActiveTab('guidelines')}>
                    Guidelines
                </button>
            </div>

            <div className="mt-4 overflow-y-auto">
                {activeTab === 'book'
                    ? <BookingForm service={service} onSuccess={onSuccess} />
                    : <ServiceGuidelines service={service} />
                }
            </div>
        </div>
    );
}

BottomSheet.propTypes = {
    service: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    defaultTab: PropTypes.string,
    onSuccess: PropTypes.func,
};