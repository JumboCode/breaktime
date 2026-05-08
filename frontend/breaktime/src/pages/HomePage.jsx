import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import MainCalendar from "../components/MainCalendar";
import InboxView from "../components/InboxView";
import UserTableView from "../components/UserTableView";
import CalendarCorner from "../assets/maincal/CalendarCorner.svg";
import { useState, useEffect, useCallback } from "react";
import ModalProvider from "../components/popups/staff_booking/ModalProvider";
import ModalContainer from "../components/popups/staff_booking/ModalContainer";
import { apiCall } from "../utils/general";
import { useUser } from "@clerk/clerk-react";

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
    const [notifications, setNotifications] = useState([]);
    const { user, isLoaded } = useUser();
    const unreadCount = notifications.filter(n => !n.isRead).length;

    /**
     * mapBackendBooking - Maps a backend booking object to frontend format
     *
     * Backend format:
     * { bookingID, userID, clientName, serviceID, timestamp, duration: { day, startTime, endTime } }
     *
     * Frontend format:
     * { id, client, service, date (YYYY-MM-DD), startTime, endTime }
     *
     * Note: timestamp is already a real date string, and duration is a plain object (not an array).
     */
    const mapBackendBooking = (b) => ({
        ...b,
        id: b.bookingID,
        client: b.clientName || b.userID,
        service: b.serviceID,
        date: b.timestamp,
        startTime: b.duration?.startTime,
        endTime: b.duration?.endTime,
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
                setBookings(response.bookings.map(mapBackendBooking));
            }
        } catch (err) {
            console.warn('Could not fetch bookings:', err);
        }
    }, []);

    // Fetch bookings on mount and whenever the displayed month changes
    useEffect(() => {
        fetchMonthlyBookings(calendarDate);
    }, [calendarDate, fetchMonthlyBookings]);

    // Poll notifications every 30 seconds to keep inbox + unread count in sync
    useEffect(() => {
        if (!isLoaded || !user) return;
        const fetchNotifications = () => {
            apiCall('/notification/getInbox', 'POST', { userID: user.username, role: 'staff' }, null)
                .then(data => setNotifications(data.notifications ?? []))
                .catch(() => {});
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isLoaded, user]);

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
                <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType} currentView={currentView} onViewChange={setCurrentView} unreadCount={unreadCount} />
                <div className="flex p-[30px] pt-[10px] gap-[30px]">
                    <div className="block lg:hidden">
                        <h1 className="text-white text-[42px] mb-8 leading-12">Welcome Back, {user?.firstName}!</h1>
                    </div>

                    <div className={`hidden ${isSidebarOpen ? 'lg:block' : ''}`}>
                        <SideBar
                            userType={userType}
                            bookings={bookings}
                            onViewAllClick={(widgetDate) => setCalendarDate(widgetDate)}
                            onDayClick={(date) => setCalendarDate(date)}
                            onOpenInbox={() => setCurrentView('inbox')}
                            unreadCount={unreadCount}
                            notifications={notifications}
                            onDismiss={(id) => {
                                setNotifications(prev => prev.map(n => n._id === id ? { ...n, wasNotified: true } : n));
                                apiCall('/notification/markNotified', 'PATCH', { _id: id }, null).catch(() => {});
                            }}
                        />
                    </div>

                    <div className={`h-[calc(100vh-120px)] relative border-none rounded-[20px] font-all ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'} ${currentView === 'inbox' || currentView === 'users' ? '' : 'bg-staff-main-comp-bg text-cal-font'}`}>
                        {currentView === 'inbox' ? (
                            <InboxView messages={notifications} setMessages={setNotifications} />
                        ) : currentView === 'users' ? (
                            <UserTableView />
                        ) : (
                            <>
                                <div>
                                    <img src={CalendarCorner} className="absolute bottom-0 m-[-30px]"/>
                                    <img src={CalendarCorner} className="absolute top-0 right-0 m-[-30px] rotate-180"/>
                                </div>
                                <div className="bg-staff-main-comp-bg p-[50px] main-cal-wrapper">
                                    {/* MainCalendar receives bookings to display as events.
                                        onDateChange/onViewChange trigger refetches for fresh data. */}
                                    <MainCalendar
                                        bookings={bookings}
                                        onDateChange={handleDateChange}
                                        onViewChange={handleViewChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/*
                  ModalContainer handles all popup modals and API calls.
                  onBookingChange triggers a refetch after create/update/delete.
                */}
                <ModalContainer
                    bookings={bookings}
                    setBookings={setBookings}
                    onBookingChange={handleBookingChange}
                />
            </div>
        </ModalProvider>
    );
}
