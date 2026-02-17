import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import MainCalendar from "../components/MainCalendar";
import CalendarCorner from "../assets/maincal/CalendarCorner.svg";
import { useState, useEffect, useCallback } from "react";
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
    const [userType] = useState('Staff');
    const [bookings, setBookings] = useState([]);
    // Track the current date displayed on the calendar so we can fetch
    // bookings for the correct month when the user navigates
    const [calendarDate, setCalendarDate] = useState(new Date());

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
        if (diff < 0) diff += 7;

        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        return targetDate.toISOString().split('T')[0];
    };

    /**
     * mapBackendBooking - Maps a backend booking object to frontend format
     *
     * Backend format:
     * { bookingID, userID, clientName, serviceID, duration: [{ day, startTime, endTime }] }
     *
     * Frontend format:
     * { id, client, service, date (YYYY-MM-DD), startTime, endTime }
     */
    const mapBackendBooking = (b) => ({
        ...b,
        id: b.bookingID,
        client: b.clientName || b.userID,
        service: b.serviceID,
        ...(b.duration && b.duration[0] ? {
            date: getDateFromDay(b.duration[0].day),
            startTime: b.duration[0].startTime,
            endTime: b.duration[0].endTime,
        } : {})
    });

    /**
     * fetchMonthlyBookings - Fetches bookings for a specific month/year
     *
     * This is called:
     *   1. On initial page load (component mount)
     *   2. When the user navigates to a different month on the calendar
     *   3. When the calendar view changes (month ↔ week)
     *   4. When a booking is created, updated, or deleted (via onBookingChange)
     *
     * @param {Date} date - The date whose month/year to fetch bookings for
     */
    const fetchMonthlyBookings = useCallback(async (date = new Date()) => {
        const month = date.getMonth() + 1; // JS months are 0-indexed, API expects 1-indexed
        const year = date.getFullYear();

        try {
            // TODO (Backend Integration): Once the GET /booking/monthlyBookings endpoint is
            // implemented, replace the line below with:
            //
            //   const response = await apiCall(
            //     `/booking/monthlyBookings?month=${month}&year=${year}`,
            //     'GET', null, null
            //   );
            //
            // The endpoint should return { bookings: [...] } containing only active bookings
            // (isActive === true) whose timestamp falls within the given month and year.
            //
            // Current fallback: fetches ALL bookings via /booking/all
            const response = await apiCall('/booking/all', 'GET', null, null);

            if (response.bookings) {
                const mappedBookings = response.bookings.map(mapBackendBooking);
                setBookings(mappedBookings);
            }
        } catch (err) {
            console.warn('Could not fetch bookings:', err);
        }
    }, []);

    // Fetch bookings on mount and whenever the displayed month changes
    useEffect(() => {
        fetchMonthlyBookings(calendarDate);
    }, [calendarDate, fetchMonthlyBookings]);

    /**
     * handleDateChange - Called by MainCalendar when user navigates to a new date.
     * Updates calendarDate which triggers the useEffect to refetch bookings.
     */
    const handleDateChange = useCallback((newDate) => {
        setCalendarDate(newDate);
    }, []);

    /**
     * handleViewChange - Called by MainCalendar when the view switches (month ↔ week).
     * Refetches bookings to ensure the calendar data is fresh for the new view.
     */
    const handleViewChange = useCallback(() => {
        fetchMonthlyBookings(calendarDate);
    }, [calendarDate, fetchMonthlyBookings]);

    /**
     * handleBookingChange - Called by ModalContainer after a booking is created,
     * updated, or deleted. Refetches bookings from the backend so the calendar
     * displays the latest data.
     */
    const handleBookingChange = useCallback(() => {
        fetchMonthlyBookings(calendarDate);
    }, [calendarDate, fetchMonthlyBookings]);

    return (
        // ModalProvider wraps the app to provide modal context to all children
        <ModalProvider>
            <div className="bg-indigo-purple h-screen w-screen overflow-hidden">
                <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType} />
                <div className="flex p-[30px] pt-[10px] gap-[30px]">
                    <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                        <SideBar userType={userType}/>
                    </div>

                    <div className={`h-[calc(100vh-120px)] relative bg-cal-bg border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}>
                        <div>
                            <img src={CalendarCorner} className="absolute bottom-0 m-[-30px]"/>
                            <img src={CalendarCorner} className="absolute top-0 right-0 m-[-30px] rotate-180"/>
                        </div>

                        <div className="bg-cal-bg p-[50px] main-cal-wrapper">
                            {/* MainCalendar receives bookings to display as events.
                                onDateChange/onViewChange trigger refetches for fresh data. */}
                            <MainCalendar
                                bookings={bookings}
                                onDateChange={handleDateChange}
                                onViewChange={handleViewChange}
                            />
                        </div>
                    </div>
                </div>
                {/*
                  ModalContainer handles all popup modals and API calls
                  - Receives bookings state and setBookings to update after CRUD operations
                  - Creates, updates, and deletes bookings via API
                  - Updates local state to reflect changes immediately
                */}
                {/* onBookingChange triggers a refetch after create/update/delete */}
                <ModalContainer
                    bookings={bookings}
                    setBookings={setBookings}
                    onBookingChange={handleBookingChange}
                />
            </div>
        </ModalProvider>
    );
}
