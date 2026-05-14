import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import InboxView from "../components/InboxView";
import AppointmentsView from "../components/AppointmentsView";
import CarouselButton from "/src/assets/carousel/SearchBarButton.svg";
import CarouselItem from "../components/YACarouselItem";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";
import LaptopCarouselImage from "/src/assets/carousel/LaptopCarouselImage.png";
import DefaultServiceImage from "/src/assets/popup-icons/ServiceImage.png";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "../utils/general";
import useEmblaCarousel from 'embla-carousel-react';

const SERVICE_IMAGES = {
    'shower': ShowerCarouselImage,
    'laundry': LaundryCarouselImage,
    'store': StoreCarouselImage,
    'laptop': LaptopCarouselImage,
};

const toTitleCase = (s) => s.replace(/\b\w/g, c => c.toUpperCase());

export default function HomePage() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: true,
        containScroll: false,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userType] = useState('YA');
    const [currentView, setCurrentView] = useState('services');
    const [pendingBookingID, setPendingBookingID] = useState(null);
    const [pendingNotificationID, setPendingNotificationID] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [resourceTileList, setResourceTileList] = useState([]);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        const fetchNotifications = () => {
            apiCall('/notification/getInbox', 'POST', { userID: user.username }, null)
                .then(data => setNotifications(data.notifications ?? []))
                .catch(() => {});
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isLoaded, user]);

    useEffect(() => {
        apiCall('/service/getAllServices', 'GET', null, null)
            .then(services => setResourceTileList(
                services.map(s => ({
                    name: toTitleCase(s.id),
                    imageImport: SERVICE_IMAGES[s.id?.toLowerCase()] ?? DefaultServiceImage,
                }))
            ))
            .catch(() => {});
    }, []);

    const filteredResourceTiles = useMemo(() =>
        resourceTileList.filter(tile =>
            tile.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [resourceTileList, searchQuery]
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (            
        <div className="bg-light-grey h-screen w-screen overflow-hidden ya-carousel-container">
            <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType} currentView={currentView} onViewChange={setCurrentView} />
            <div className="flex p-[30px] pt-[10px] gap-[30px]">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                    <SideBar
                        userType={userType}
                        notifications={notifications}
                        unreadCount={notifications.filter(n => !n.isRead).length}
                        onOpenInbox={() => setCurrentView('inbox')}
                        onOpenAppointments={() => setCurrentView('appointments')}
                        onOpenBooking={(booking) => { setCurrentView('appointments'); setPendingBookingID(booking.bookingID); }}
                        onOpenNotification={(n) => { setCurrentView('inbox'); setPendingNotificationID(n._id); }}
                        onDismiss={(id) => {
                            setNotifications(prev => prev.map(n => n._id === id ? { ...n, wasNotified: true } : n));
                            apiCall('/notification/markNotified', 'PATCH', { _id: id }, null).catch(() => {});
                        }}
                    />
                </div>

                <div className={`h-[calc(100vh-120px)] relative border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)] text-center mt-20'}`}>
                {currentView === 'inbox' ? (
                    <InboxView
                        messages={notifications}
                        setMessages={setNotifications}
                        userRole="ya"
                        pendingNotificationID={pendingNotificationID}
                        onClearPendingNotification={() => setPendingNotificationID(null)}
                    />
                ) : currentView === 'appointments' ? (
                    <AppointmentsView
                        pendingBookingID={pendingBookingID}
                        onClearPending={() => setPendingBookingID(null)}
                    />
                ) : (
                    <>
                    <h1 className="text-[104px] leading-[104px] mb-16">
                        Choose a <span className="text-bright-purple">Service</span> to get Started
                    </h1>

                    <div>
                        <div className="inline-flex gap-2">
                            <input
                                className="text-dark-navy opacity-80 border-2 border-bright-purple rounded-2xl pl-5 pr-5 pt-0 pb-0 bg-none w-70"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="search for services..."
                            />
                            <img
                                src={CarouselButton}
                                className="rotate-180 scale-75 hover:cursor-pointer"
                                onClick={scrollPrev}
                            />
                            <img
                                src={CarouselButton}
                                className="scale-75 hover:cursor-pointer"
                                onClick={scrollNext}
                            />
                        </div>
                        <div className="mb-4 mt-2">
                            <span className="text-dark-navy opacity-60">Hover to see details, then book</span>
                        </div>
                    </div>

                    {resourceTileList.length === 0 ? (
                        <div>No services available!</div>
                    ) : filteredResourceTiles.length === 0 ? (
                        <div>No services match this search!</div>
                    ) : (
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex gap-10">
                                {filteredResourceTiles.map((resource, index) => (
                                    <div key={index} className="flex-[0_0_auto]">
                                        <CarouselItem service={resource} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    </>
                )}
                </div>
            </div>
        </div>
    );
}