import { useState } from "react";
import Calender from "./Calender";
import Notifications from "./Notifications";


function SideBar() {
    const [notificationData, setNotificationData] = useState({
        numNotifications: 0 // Get notification data from notifications tab??
    });

    // const [error, setError] = useState("");

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setNotificationData((prevData) => ({
    //         ...prevData,
    //         // if (value === 'notification') {
    //         //     [name]: value + 1,
    //         // }
                
    //     }));
    // };
    return (
        <div className="flex-col">
            <h1 className="">Welcome Back Labubu!</h1>
            <div>
                <Calender></Calender>
                <Notifications></Notifications>
            </div>
        
        </div>
    );

}

export default SideBar;