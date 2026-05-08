import PropTypes from "prop-types";
import AppointmentHistory from "./AppointmentHistory";

export default function AppointmentTab({ onSelectBooking }) {
    return (
        <div className="font-all">
            <div className="w-fit h-fit ml-[30px] mt-[23px] flex flex-col text-[14vw] font-extralight">
                <span className="-my-4">View</span>
                <span className="-my-4">Your</span>
                <span className="text-bright-purple -my-4 font-light">Bookings</span>
            </div>

            <div className="w-full px-[30px] mt-10">
                <AppointmentHistory onSelectBooking={onSelectBooking} />
            </div>
        </div>
    );
}

AppointmentTab.propTypes = {
    onSelectBooking: PropTypes.func.isRequired,
};
