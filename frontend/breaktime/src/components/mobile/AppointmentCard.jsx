import PropTypes from 'prop-types';

const getTimeUntil = (service_date, start_time) => {
    const now = new Date();
    const [year, month, day] = service_date.split('-').map(Number);
    const [hours, minutes] = start_time.split(':').map(Number);
    const serviceDateTime = new Date(year, month - 1, day, hours, minutes);

    const diffMs = serviceDateTime - now;
    if (diffMs <= 0) {
        // Format as "Completed on Jan 27"
        const date = new Date(year, month - 1, day);
        return `Completed on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const serviceMidnight = new Date(year, month - 1, day);
    const diffDays = Math.round((serviceMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} away`;
    } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return diffHours === 0 ? 'Now' : `${diffHours} hr${diffHours === 1 ? '' : 's'} away`;
    }
};

const isPast = (service_date, start_time) => {
    const now = new Date();
    const [year, month, day] = service_date.split('-').map(Number);
    const [hours, minutes] = start_time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes) < now;
};

export default function AppointmentCard({ appointment, onOpen }) {
    const { service_name, service_icon, service_date, start_time, status } = appointment;
    const timeUntil = getTimeUntil(service_date, start_time);
    const past = isPast(service_date, start_time) || status === 'canceled';

    return (
        <div
            className={`relative rounded-4xl px-[4vw] py-[3vw] flex items-center gap-[3vw] overflow-hidden cursor-pointer
            ${past ? 'bg-light-purple-subtle' : 'bg-bright-purple'}`}
            onClick={onOpen}
        >

            {/* Faded overlay for past appointments */}
            {past && (
                <div className="absolute inset-0 bg-white/30 rounded-2xl pointer-events-none" />
            )}

            {/* Service icon */}
            <div className="w-fit h-fit flex items-center justify-center shrink-0 relative z-10">
                {service_icon
                    ? <img src={service_icon} alt={service_name} className="w-[7vw] h-[7vw] object-contain"/>
                    : <span className="text-dark-navy font-bold text-[5vw]">?</span>
                }
            </div>

            {/* Service info */}
            <div className="flex flex-col flex-1 relative z-10">
                <p className="text-white font-normal text-[4.5vw]">{service_name.charAt(0).toUpperCase() + service_name.slice(1)} Service</p>
                <p className="text-white text-[3.5vw] opacity-80">{timeUntil}</p>
            </div>

            {/* More button */}
            <div className="border border-lime-500 text-lime-500 text-[3.5vw] px-[3vw] py-[2vw] rounded-full relative z-10">
                More
            </div>
        </div>
    );
}

AppointmentCard.propTypes = {
    appointment: PropTypes.shape({
        service_name: PropTypes.string.isRequired,
        service_icon: PropTypes.string,
        service_date: PropTypes.string.isRequired,
        start_time: PropTypes.string.isRequired,
        status: PropTypes.string,
        bookingID: PropTypes.string,
    }).isRequired,
    onOpen: PropTypes.func,
};