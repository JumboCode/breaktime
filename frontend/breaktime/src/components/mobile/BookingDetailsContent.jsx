import PropTypes from "prop-types";

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const suffix =
        day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
        day === 3 || day === 23 ? 'rd' : 'th';
    return `${monthName} ${day}${suffix}, ${weekday}`;
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

export default function BookingDetailsContent({ booking, onEdit }) {
    const date = formatDate(booking.timestamp || booking.service_date);
    const startTime = formatTime(booking.duration?.startTime || booking.start_time);
    const endTime = formatTime(booking.duration?.endTime);

    return (
        <div className="flex flex-col gap-[4vw]">
            <div className="flex flex-col gap-[2vw]">
                <span className="text-[4vw] text-[#2F2F2F]">Date</span>
                <span className="w-fit px-[3vw] py-[1.5vw] bg-[#D6DFFF] text-dark-navy text-[4vw] rounded-2xl">
                    {date}
                </span>
            </div>

            <div className="flex flex-col gap-[2vw]">
                <span className="text-[4vw] text-[#2F2F2F]">Time</span>
                <div className="flex items-center gap-[2vw]">
                    <span className="px-[3vw] py-[1.5vw] bg-[#D6DFFF] text-dark-navy text-[4vw] rounded-2xl">
                        {startTime}
                    </span>
                    {endTime && (
                        <>
                            <span className="text-gray-400 text-[3.5vw]">to</span>
                            <span className="px-[3vw] py-[1.5vw] bg-[#D6DFFF] text-dark-navy text-[4vw] rounded-2xl">
                                {endTime}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <p className="text-[3.5vw] text-gray-400">
                Need a different time?{' '}
                <button onClick={onEdit} className="text-dark-navy underline">
                    Edit booking
                </button>
            </p>

            <div className="flex gap-[3vw] mt-[2vw]">
                <button className="flex-1 py-[3vw] border border-[#B27DED] text-[#B27DED] text-[4vw] rounded-2xl">
                    cancel booking
                </button>
                <button className="flex-1 py-[3vw] bg-[#B27DED] text-white text-[4vw] rounded-2xl">
                    send a note
                </button>
            </div>
        </div>
    );
}

BookingDetailsContent.propTypes = {
    booking: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
};
