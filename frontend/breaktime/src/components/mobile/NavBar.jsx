import PropTypes from 'prop-types';

export default function NavBar({ activeTab, setActiveTab }) {

    const defaultButtonStyle = "rounded-full flex-1 py-[5px] text-[5vw] text-gray-400";
    const activeTabStyle = " bg-[#b37ded] rounded-full font-medium text-white px-[3px]";

    return (
        <div className="border border-[#D7C6F0]
                        p-[3px] flex justify-center-safe items-center-safe w-full rounded-full
                        gap-2">
            <button className={defaultButtonStyle + (activeTab === 'book' ? activeTabStyle : "")}
                    onClick={() => setActiveTab('book')}>
                Book
            </button>

            <button className={defaultButtonStyle + (activeTab === 'appointment' ? activeTabStyle : "")}
                    onClick={() => setActiveTab('appointment')}>
                Appointments
            </button>

            <button className={defaultButtonStyle + (activeTab === 'inbox' ? activeTabStyle : "")}
                    onClick={() => setActiveTab('inbox')}>
                Inbox
            </button>
        </div>
    );
}

NavBar.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired
};