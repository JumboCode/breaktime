import NavBar from "/src/components/NavBar";
import SideBar from "/src/components/SideBar";
import MainCalendar from "/src/components/MainCalendar";
import InboxView from "../components/InboxView";
import CalendarCorner from "/src/assets/maincal/CalendarCorner.svg";
import { useState, useEffect } from "react";
import ModalProvider from "/src/components/popups/staff_booking/ModalProvider";
import ModalContainer from "/src/components/popups/staff_booking/ModalContainer";
import { apiCall } from "/src/utils/general";

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
    const [currentView, setCurrentView] = useState('calendar');
    const [bookings, setBookings] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState('month');

    const handleDayClick = (date) => {
        setCalendarDate(date);
        setCalendarView('day');
    };

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
                        date: b.timestamp,
                        ...(b.duration ? {
                            startTime: b.duration.startTime,
                            endTime: b.duration.endTime,
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
                <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType} currentView={currentView} onViewChange={setCurrentView} />
                <div className="flex p-[30px] pt-[10px] gap-[30px]">
                    <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                        <SideBar
                            userType={userType}
                            bookings={bookings}
                            onViewAllClick={(widgetDate) => setCalendarDate(widgetDate)}
                            onDayClick={handleDayClick}
                            onOpenInbox={() => setCurrentView('inbox')}
                        />
                    </div>

                    <div className={`h-[calc(100vh-120px)] relative border-none rounded-[20px] font-all ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'} ${currentView === 'inbox' ? '' : 'bg-cal-bg text-cal-font'}`}>
                        {currentView === 'inbox' ? (
                            <InboxView />
                        ) : (
                            <>
                                <div>
                                    <img src={CalendarCorner} className="absolute bottom-0 m-[-30px]"/>
                                    <img src={CalendarCorner} className="absolute top-0 right-0 m-[-30px] rotate-180"/>
                                </div>
                                <div className="bg-cal-bg p-[50px] main-cal-wrapper">
                                    {/* MainCalendar receives bookings and controlled date from HomePage */}
                                    <MainCalendar bookings={bookings} date={calendarDate} onNavigate={setCalendarDate} view={calendarView} onView={setCalendarView} />
                                </div>
                            </>
                        )}
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
