const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

const UserStaffToggle = ({ selectedType, onToggle }) => {
    const handleChange = (value) => {
        if (onToggle) onToggle(value);
    };

    const mobile = isMobile();

    return (
        <div className="inline-block">
            <div className={`relative p-1.5 rounded-[24px] border flex justify-between border-light-purple overflow-hidden
                ${mobile ? 'w-[60vw] h-[12vw] rounded-[4vw]' : 'w-[226px] h-[48px] rounded-[24px]'}`}>

                {/* Sliding background */}
                <div
                    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-lime-500 transition-transform duration-300 ease-in-out
                        ${mobile ? 'rounded-[3vw]' : 'rounded-[16px]'}
                        ${selectedType === "staff" ? "translate-x-full" : "translate-x-0"}`}
                />

                {/* USERS */}
                <input className="hidden" type="radio" id="toggle-users"
                    name="user-staff" value="users"
                    checked={selectedType === "users"}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label htmlFor="toggle-users"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 cursor-pointer select-none relative z-10
                        ${mobile ? 'text-[3.5vw] rounded-[3vw]' : 'text-base rounded-[16px]'}
                        ${selectedType === "users" ? "text-dark-navy" : "text-light-purple"}`}
                >
                    Users
                </label>

                {/* STAFF */}
                <input className="hidden" type="radio" id="toggle-staff"
                    name="user-staff" value="staff"
                    checked={selectedType === "staff"}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label htmlFor="toggle-staff"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 cursor-pointer select-none relative z-10
                        ${mobile ? 'text-[3.5vw] rounded-[3vw]' : 'text-base rounded-[16px]'}
                        ${selectedType === "staff" ? "text-dark-navy" : "text-light-purple"}`}
                >
                    Staff
                </label>
            </div>
        </div>
    );
};

export default UserStaffToggle;