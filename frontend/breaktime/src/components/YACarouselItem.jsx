import { useState } from "react";

const CarouselItem = ({ name, image }) => {
    // class NextBooking {
    //     constructor(id, title, message) {
    //         this.id = id;
    //         this.title = title;
    //         this.message = message;
    //     }
    // }

    // const [visibleBookings, setVisibleBookings] = useState([
    //     new NextBooking(1, "Shower Service", "Starts in 24hr"),
    //     new NextBooking(2, "Laundry Cycle", "1 day ago"),
    //     new NextBooking(3, "Resource Store", "Starts in 24hr"),
    //     new NextBooking(4, "Job Application Meeting", "Starts in 24hr"),
    //     new NextBooking(5, "Laundry Cycle", "Starts in 24hr")
    // ]);

    // const handleDeleteNextBooking = (id) => {
    //     setVisibleBookings(prevBookings => 
    //         prevBookings.filter(booking => booking.id !== id)
    //     );
    // };
    
    return (
        <div className="rounded-xl border-2 border-bright-purple w-80 h-fit p-2 justify-items-center">
            <img className="w-80 h-80 rounded-xl" src={`${image}`}/>
            <p className="font-bold text-lg">
                { name } 
            </p>
        </div>
    );
};

export default CarouselItem;