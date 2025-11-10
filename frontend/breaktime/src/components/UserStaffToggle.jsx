import { useState } from 'react';

const UserStaffToggle = ({ onToggle }) => {
    const [selected, setSelected] = useState('staff');

    const handleChange = (value) => {
        setSelected(value);
        if (onToggle) onToggle(value);
    };

    return (
        <div className="inline-block">
            <div className="p-1.5 rounded-[24px] border w-[260px] h-[58px] flex justify-between border-light-purple">
                <input
                    className="hidden"
                    type="radio"
                    id="toggle-users"
                    name="user-staff"
                    value="users"
                    checked={selected === 'users'}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label
                    htmlFor="toggle-users"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 rounded-[16px] cursor-pointer select-none text-xl ${
                        selected === 'users'
                            ? 'bg-lime-500 text-dark-navy'
                            : 'text-light-purple'
                    }`}
                >
                    Users
                </label>

                <input
                    className="hidden"
                    type="radio"
                    id="toggle-staff"
                    name="user-staff"
                    value="staff"
                    checked={selected === 'staff'}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label
                    htmlFor="toggle-staff"
                    className={`uppercase font-semibold flex items-center justify-center h-full w-1/2 rounded-[16px] cursor-pointer select-none text-xl ${
                        selected === 'staff'
                            ? 'bg-lime-500 text-dark-navy'
                            : 'text-light-purple'
                    }`}
                >
                    Staff
                </label>
            </div>
        </div>
    );
};

export default UserStaffToggle;