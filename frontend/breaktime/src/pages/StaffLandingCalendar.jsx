import NavBar from "../components/NavBar";
import { useState } from "react";

export default function StaffLandingCalendar() {
    return (
        <div className="bg-indigo-purple h-screen w-screen">
            <NavBar />
            <div className="text-light-purple-subtle absolute bottom-0 p-[30px]">
                    Contact Us:
                    <br />
                    (508) 319 - 1679
                    <br />
                    info@breaktime.org
                </div>
        </div>
    );
}