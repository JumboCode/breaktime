import { useState } from "react";
import AppointmentHistory from "./AppointmentHistory";
import AppointmentDetailsPage from "/src/pages/mobile/AppointmentDetailsPage";

export default function AppointmentTab() {
    const [selectedBooking, setSelectedBooking] = useState(null);

    if (selectedBooking) {
        return (
            <AppointmentDetailsPage
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        );
    }

    return (
        <div className="font-all">
            <div className="w-fit h-fit ml-[30px] mt-[23px] flex flex-col text-[14vw] font-extralight">
                <span className="-my-4">View</span>
                <span className="-my-4">Your</span>
                <span className="text-bright-purple -my-4 font-light">Bookings</span>
            </div>

            <div className="w-full px-[30px] mt-10">
                <AppointmentHistory onSelectBooking={setSelectedBooking} />
            </div>
        </div>
    );
}