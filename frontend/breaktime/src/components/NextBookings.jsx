import { useState } from "react";

const Bookings = ({ userType }) => {
    class NextBooking {
        constructor(id, title, message) {
            this.id = id;
            this.title = title;
            this.message = message;
        }
    }

    const [visibleBookings, setVisibleBookings] = useState([
        new NextBooking(1, "Shower Service", "Starts in 24hr"),
        new NextBooking(2, "Laundry Cycle", "1 day ago"),
        new NextBooking(3, "Resource Store", "Starts in 24hr"),
        new NextBooking(4, "Job Application Meeting", "Starts in 24hr"),
        new NextBooking(5, "Laundry Cycle", "Starts in 24hr")
    ]);

    const handleDeleteNextBooking = (id) => {
        setVisibleBookings(prevBookings => 
            prevBookings.filter(booking => booking.id !== id)
        );
    };
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl text-dark-navy">Bookings</h3>
                <span className="text-dark-navy opacity-[60%] underline text-sm cursor-pointer">Past bookings ({visibleBookings.length})</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar">
                {visibleBookings.length === 0 ? (
                    <div className="text-center py-8 text-light-purple">
                        No new bookings
                    </div>
                ) : (
                    visibleBookings.map((booking) => (
                        <div 
                            key={booking.id}
                            className="bg-bright-purple rounded-2xl p-[4px]"
                        >
                            <div className="rounded-2xl p-3 flex items-center gap-3 relative h-14">

                            <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-dark-purple font-semibold">?</span>
                            </div>
                            

                            <div className="flex-1 text-white">
                                <h4 className=" text-md font-semibold">{booking.title}</h4>

                                <p className="text-sm mt-1">{booking.message}</p>
                            </div>
                            <button className="px-3 py-[2px] absolute bottom-[2px] right-2 border-1 border-lime-500 text-white rounded-full text-sm cursor-pointer hover:bg-lime-500 hover:text-dark-navy transition-colors">
                                More
                            </button>
                            
                            <button
                                onClick={() => handleDeleteNextBooking(booking.id)}
                                className="absolute top-0 right-2 text-lime-500 hover:text-lime-500/80 cursor-pointer text-3xl font-normal leading-none w-6 h-6 flex items-center justify-center text-md"
                            >
                                ×
                            </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookings;