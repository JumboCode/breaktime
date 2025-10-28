import { useState } from 'react';

const UserStaffToggle = ({ onToggle }) => {
    const [selected, setSelected] = useState('staff'); // Default to 'staff' selection

    const handleChange = (value) => {
        setSelected(value);
        if (onToggle) {
            onToggle(value);
        }
    };

    return (
        <div className="toggle-container">
            <div className="user-staff-toggle">
                <input
                    type="radio"
                    id="toggle-users"
                    name="user-staff"
                    value="users"
                    checked={selected === 'users'}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label className="radio-button uppercase font-semibold" htmlFor="toggle-users">
                    Users
                </label>

                <input
                    type="radio"
                    id="toggle-staff"
                    name="user-staff"
                    value="staff"
                    checked={selected === 'staff'}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <label className="radio-button uppercase font-semibold" htmlFor="toggle-staff">
                    Staff
                </label>
            </div>
        </div>
    );
};

export default UserStaffToggle;