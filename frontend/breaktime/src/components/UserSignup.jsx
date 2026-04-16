import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from "/src/utils/general";
import { validateInput, handleNameKeyDown, handleAgeKeyDown, 
    handleZoneKeyDown } from '../utils/errorMessages';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

function UserSignup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        ethnicity: "",
        password: "",
        zone: "",
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
        setError("");
        setSuccess("");
        const body = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            age: Number(formData.age),
            gender: formData.gender,
            race: formData.ethnicity,
            zone: formData.zone,
        };
        const validationError = validateInput(body, true);
        if (validationError) {
            setError(validationError);
            return;
        }
        (async () => {
            try {
                const res = await apiCall('/user/create', 'POST', body, null);
                setSuccess(res.message || 'Account created successfully');
                setFormData({ firstName: "", lastName: "", age: "", gender: "", ethnicity: "", password: "", zone: "" });
                navigate('/');
            } catch (err) {
                console.error('Signup error', err);
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
                                value={formData.firstName} onChange={handleChange} onKeyDown={handleNameKeyDown}required />
                        </div>
                        <div>
                            <input type="text" id="lastName" name="lastName"
                                autoComplete="lastName" placeholder="Last Name"
                                value={formData.lastName} onChange={handleChange} onKeyDown={handleNameKeyDown}required />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div>
                            <input type="number" id="age" name="age"
                                autoComplete="age" placeholder="Age"
                                value={formData.age} onChange={handleChange} onKeyDown={handleAgeKeyDown} required />
                        </div>
                        <div className={mobile ? 'w-full' : 'w-7/10'}>
                            <input type="text" id="gender" name="gender"
                                autoComplete="gender" placeholder="Gender"
                                value={formData.gender} onChange={handleChange} onKeyDown={handleNameKeyDown} required />
                        </div>
                        <div className={mobile ? 'w-full' : 'w-7/10'}>
                            <input type="text" id="ethnicity" name="ethnicity"
                                autoComplete="ethnicity" placeholder="Ethnicity"
                                value={formData.ethnicity} onChange={handleChange} onKeyDown={handleNameKeyDown} required />
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-3">
                        <div>
                            <input type="password" id="password" name="password"
                                autoComplete="new-password" placeholder="Password"
                                value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className={mobile ? 'w-full' : 'w-7/10'}>
                        <input type="text" id="zone" name="zone"
                            autoComplete="zone" placeholder="City/Neighborhood"
                            value={formData.zone} onChange={handleChange} onKeyDown={handleZoneKeyDown} required />
                    </div>
                </div>

                <div className={`text-light-purple mt-5 mb-5 ${mobile ? 'text-[3.5vw]' : ''}`}>
                    Join our community and access all available resources in one place
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

export default UserSignup;