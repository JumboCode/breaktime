import NavBar from "/src/components/mobile/NavBar";
import BookingTab from "/src/components/mobile/BookingTab";
import BookingPage from "/src/pages/mobile/BookingPageMobile";
import AppointmentTab from "../../components/mobile/AppointmentTab";
import MobileInboxView from "../../components/mobile/InboxTab";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { apiCall } from "../../utils/general";

export default function YouthLandingPageMobile() {
    const [activeTab, setActiveTab] = useState('book');
    const [selectedService, setSelectedService] = useState(null);
    const [messages, setMessages] = useState([]);
    const { signOut } = useClerk();
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;
        const fetchMessages = () => {
            apiCall('/notification/getInbox', 'POST', { userID: user.username }, null)
                .then(data => setMessages(data.notifications ?? []))
                .catch(() => {});
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [user]);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleBook = (service, tab) => {
        setSelectedService({ service, tab });
    };

    if (selectedService) {
        return (
            <BookingPage
                service={selectedService.service}
                defaultTab={selectedService.tab}
                onClose={() => setSelectedService(null)}
            />
        );
    }

    return (
        <div className="bg-light-grey min-h-screen w-screen overflow-x-hidden">
            <div className="mx-[20px] mt-1">
                <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {activeTab === 'book' && <BookingTab onBook={handleBook} />}
            {activeTab === 'appointment' && <AppointmentTab/>}
            {activeTab === 'inbox' && (
                <MobileInboxView messages={messages} setMessages={setMessages} userRole="ya" />
            )}
            
            <div className="flex justify-between items-center
                            w-full px-[30px] mt-14 mb-5 sticky bottom-0
                            text-gray-400 text-[3vw]">
                <span className="flex items-start">
                    Need Help? <br/>
                    info@breaktime.org
                </span>

                <div className="flex items-center gap-2">
                    <button onClick={() => handleSignOut()}>
                        Sign Out
                    </button>
                    <span className="bg-[#b9ff00] px-3 py-1 rounded-full">
                        {user.username.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}