import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { apiCall } from "/src/utils/general";

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

function StaffSignup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const mobile = isMobile();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        const { firstName, lastName, email, username, password } = formData;
        if (!firstName || !lastName || !email || !username || !password) {
            setError('Please fill out all fields.');
            return;
        }
        (async () => {
            try {
                const body = { firstName, lastName, email, username, password };
                const res = await apiCall('/staff/create', 'POST', body, null);
                setSuccess(res.message || 'Account created successfully');
                setFormData({ firstName: "", lastName: "", email: "", username: "", password: "" });
                navigate('/');
            } catch (err) {
                console.error('Staff signup error', err);
                setError(err?.statusText || err?.message || 'Failed to create account');
            }
        })();
    };

    return (
        <div className={mobile ? 'w-full' : 'max-w-[354px]'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div className="flex space-x-4">
                        <div>
                            <input type="text" id="firstName" name="firstName"
                                autoComplete="firstname" placeholder="First Name"
                                value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div>
                            <input type="text" id="lastName" name="lastName"
                                autoComplete="lastName" placeholder="Last Name"
                                value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <input type="email" id="email" name="email"
                            autoComplete="email" placeholder="Email"
                            value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={mobile ? 'w-full' : 'w-7/10'}>
                        <input type="text" id="username" name="username"
                            autoComplete="username" placeholder="Username"
                            value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className={mobile ? 'w-full' : 'w-7/10'}>
                        <input type="password" id="password" name="password"
                            autoComplete="password" placeholder="Password"
                            value={formData.password} onChange={handleChange} required />
                    </div>
                </div>

                <div className={`text-light-purple mt-5 mb-5 ${mobile ? 'text-[3.5vw]' : ''}`}>
                    Join our staff portal to manage bookings and assist members efficiently
                </div>

                <div className="text-dark-navy">
                    <button type="submit"
                        className={`uppercase bg-lime-500 rounded-[18px] font-semibold
                            ${mobile ? 'text-[4vw] w-full h-[12vw]' : 'text-xl w-[260px] h-[48px]'}`}>
                        Create Account
                    </button>
                </div>
                {error && <div className={`text-red mt-2 ${mobile ? 'text-[3.5vw]' : ''}`}>{error}</div>}
                {success && <div className={`text-lime-500 mt-2 ${mobile ? 'text-[3.5vw]' : ''}`}>{success}</div>}
            </form>
        </div>
    );
}

export default StaffSignup;