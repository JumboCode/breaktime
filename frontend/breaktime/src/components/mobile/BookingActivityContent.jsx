import PropTypes from "prop-types";

export default function BookingActivityContent({ booking: _booking }) {
    return (
        <div className="flex flex-col gap-[3vw]">
            <p className="text-gray-400 text-[3.5vw]">No recent activity.</p>
        </div>
    );
}

BookingActivityContent.propTypes = {
    booking: PropTypes.object.isRequired,
};
