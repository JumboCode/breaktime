const UserStaffToggle = ({ selectedType, onToggle }) => {
    const handleChange = (value) => {
        if (onToggle) onToggle(value);
    };

    return (
        <div className="inline-block">
            {/* Keep your original size, padding, and layout */}
            <div className="relative p-1.5 rounded-[24px] border w-[226px] h-[48px] flex justify-between border-light-purple overflow-hidden">

                {/* Sliding background */}
                <div
                    className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-lime-500 rounded-[16px] transition-transform duration-300 ease-in-out
                    ${selectedType === "staff" ? "translate-x-full" : "translate-x-0"}`}
                />

                {/* USERS */}
                <input
                    className="hidden"
                    type="radio"
                    id="toggle-users"
                    name="user-staff"
                    value="users"
                    checked={selectedType === "users"}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label
                    htmlFor="toggle-users"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 rounded-[16px] cursor-pointer select-none text-base relative z-10
                        ${selectedType === "users" ? "text-dark-navy" : "text-light-purple"}`}
                >
                    Users
                </label>

                {/* STAFF */}
                <input
                    className="hidden"
                    type="radio"
                    id="toggle-staff"
                    name="user-staff"
                    value="staff"
                    checked={selectedType === "staff"}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label
                    htmlFor="toggle-staff"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 rounded-[16px] cursor-pointer select-none text-base relative z-10
                        ${selectedType === "staff" ? "text-dark-navy" : "text-light-purple"}`}
                >
                    Staff
                </label>
            </div>
        </div>
    );
};

export default UserStaffToggle;
