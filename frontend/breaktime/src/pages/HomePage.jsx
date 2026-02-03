import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import MainCalendar from "../components/MainCalendar";
import CalendarCorner from "../assets/maincal/CalendarCorner.svg";
import { useState, useEffect } from "react";
import ModalProvider from "../components/popup/ModalProvider";
import ModalContainer from "../components/popup/ModalContainer";
import { apiCall } from "../utils/general";

/**
 * HomePage - Main landing page for staff members
 *
 * This component:
 * - Displays the calendar with all bookings
 * - Fetches bookings from MongoDB on page load
 * - Provides modal popups for creating, editing, and deleting bookings
 *
 * State Management:
 * - bookings: Array of booking objects (shared between calendar and modals)
 * - setBookings: Function to update bookings (passed to ModalContainer for CRUD operations)
 */
export default function HomePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [bookings, setBookings] = useState([]);

    /**
     * useEffect - Fetch bookings from backend when component mounts
     *
     * API Call: POST /booking/userbookinghistory
     * Request Body: { userID: "YA_1" }
     * Response: { bookings: [...] }
     *
     * The backend stores bookings with:
     *   - userID: "YA_1" (authenticated user)
     *   - clientName: "John Doe" (display name)
     *   - duration: [{ day: "monday", startTime: "09:00", endTime: "10:00" }]
     *
     * We need to map this to frontend format:
     *   - id: bookingID
     *   - client: clientName (for display)
     *   - date: "2026-02-03" (converted from day name)
     *   - startTime, endTime: from duration array
     */
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch all bookings for the calendar
                const response = await apiCall('/booking/all', 'GET', null, null);

                if (response.bookings) {
                    /**
                     * getDateFromDay - Converts a day name to an actual date
                     *
                     * The backend stores "monday", "tuesday", etc.
                     * The frontend forms need "2026-02-03" format.
                     *
                     * This finds the next occurrence of that day from today.
                     * Example: If today is Sunday and day is "tuesday", returns next Tuesday's date.
                     *
                     * @param {string} dayName - Day name like "monday", "tuesday", etc.
                     * @returns {string} Date in YYYY-MM-DD format
                     */
                    const getDateFromDay = (dayName) => {
                        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                        const today = new Date();
                        const targetDay = days.indexOf(dayName?.toLowerCase());
                        if (targetDay === -1) return '';

                        const currentDay = today.getDay();
                        let diff = targetDay - currentDay;
                        if (diff < 0) diff += 7; // If day already passed this week, get next week's

                        const targetDate = new Date(today);
                        targetDate.setDate(today.getDate() + diff);
                        return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD format
                    };

                    /**
                     * Map backend booking format to frontend format
                     *
                     * Backend format:
                     * {
                     *   bookingID: 12,
                     *   userID: "YA_1",
                     *   clientName: "John Doe",
                     *   serviceID: "services",
                     *   duration: [{ day: "monday", startTime: "09:00", endTime: "10:00" }]
                     * }
                     *
                     * Frontend format:
                     * {
                     *   id: 12,
                     *   client: "John Doe",
                     *   service: "services",
                     *   date: "2026-02-03",
                     *   startTime: "09:00",
                     *   endTime: "10:00"
                     * }
                     */
                    const mappedBookings = response.bookings.map(b => ({
                        ...b,                                    // Keep all original fields
                        id: b.bookingID,                         // Map bookingID → id
                        client: b.clientName || b.userID,        // Use clientName, fallback to userID
                        service: b.serviceID,                    // Map serviceID → service
                        // Extract date/time from duration array if available
                        ...(b.duration && b.duration[0] ? {
                            date: getDateFromDay(b.duration[0].day),  // Convert day name to date
                            startTime: b.duration[0].startTime,
                            endTime: b.duration[0].endTime,
                        } : {})
                    }));
                    setBookings(mappedBookings);
                }
            } catch (err) {
                // If API fails (e.g., backend not running), just log warning
                // App will still work with local state
                console.warn('Could not fetch bookings:', err);
            }
        };

        fetchBookings();
    }, []); // Empty dependency array = run once on mount

    return (
        // ModalProvider wraps the app to provide modal context to all children
        <ModalProvider>
            <div className="bg-indigo-purple h-screen w-screen overflow-hidden">
                <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
                <div className="flex p-[30px] pt-[10px] gap-[30px]">
                    <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                        <SideBar />
                    </div>

                    <div className={`h-[calc(100vh-120px)] relative bg-cal-bg border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}>
                        <div>
                            <img src={CalendarCorner} className="absolute bottom-0 m-[-30px]"/>
                            <img src={CalendarCorner} className="absolute top-0 right-0 m-[-30px] rotate-180"/>
                        </div>

                        <div className="bg-cal-bg p-[50px] main-cal-wrapper">
                            {/* MainCalendar receives bookings to display as events */}
                            <MainCalendar bookings={bookings} />
                        </div>
                    </div>
                </div>
                {/*
                  ModalContainer handles all popup modals and API calls
                  - Receives bookings state and setBookings to update after CRUD operations
                  - Creates, updates, and deletes bookings via API
                  - Updates local state to reflect changes immediately
                */}
                <ModalContainer bookings={bookings} setBookings={setBookings} />
            </div>
        </ModalProvider>
    );
}
