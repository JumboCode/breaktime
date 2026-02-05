import { useState } from "react";

const CarouselItem = ({ name, image }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div 
            className={`${isHovering ? 'border-4' : 'border-2'} rounded-xl border-bright-purple w-80 h-fit p-2 justify-items-center cursor-pointer`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <img className="w-80 h-80 rounded-xl" src={`${image}`}/>
            <p className={`${isHovering ? 'underline' : ''} font-bold text-lg`}>
                { isHovering ? "Details & Guidelines" : name } 
            </p>
        </div>
    );
};

export default CarouselItem;