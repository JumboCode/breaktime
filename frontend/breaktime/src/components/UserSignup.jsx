import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { apiCall } from "/src/utils/general";
import { validateInput, handleNameKeyDown, handleAgeKeyDown,
    handleZoneKeyDown } from '../utils/errorMessages';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

function CredentialsModal({ username, password, onClose, mobile }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className={`bg-indigo-purple rounded-2xl p-8 ${mobile ? 'w-full' : 'w-[420px]'} flex flex-col gap-5`}>
                <h2 className={`text-lime-500 font-semibold ${mobile ? 'text-[5.5vw]' : 'text-2xl'}`}>
                    Your Credentials
                </h2>
                <p className={`text-light-purple ${mobile ? 'text-[3.5vw]' : 'text-sm'}`}>
                    Save these — you'll need them to sign in.
                </p>
                <div className="space-y-4">
                    <div>
                        <p className="text-light-purple-subtle text-xs uppercase tracking-widest mb-1">Username</p>
                        <p className={`text-lime-500 font-semibold ${mobile ? 'text-[4.5vw]' : 'text-xl'}`}>{username}</p>
                    </div>
                    <div>
                        <p className="text-light-purple-subtle text-xs uppercase tracking-widest mb-1">Password</p>
                        <p className={`text-lime-500 font-semibold ${mobile ? 'text-[4.5vw]' : 'text-xl'}`}>{password}</p>
                    </div>
                </div>
                <div className={`bg-dark-purple/40 rounded-xl p-4 text-light-purple ${mobile ? 'text-[3.5vw]' : 'text-sm'}`}>
                    Your account is pending approval. A Breaktime staff member will review and activate it soon.
                </div>
                <button
                    onClick={onClose}
                    className={`uppercase bg-lime-500 rounded-[18px] font-semibold text-dark-navy
                        ${mobile ? 'text-[4vw] h-[12vw]' : 'text-base h-[44px]'}`}
                >
                    Go to Sign In
                </button>
            </div>
        </div>
    );
}

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
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState(null);
    const navigate = useNavigate();
    const mobile = isMobile();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
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
                setCredentials({ username: res.username, password: formData.password });
                setFormData({ firstName: "", lastName: "", age: "", gender: "", ethnicity: "", password: "", zone: "" });
            } catch (err) {
                console.error('Signup error', err);
                setError(err?.statusText || err?.message || 'Failed to create account');
            }
        })();
    };

    return (
        <>
            {credentials && (
                <CredentialsModal
                    username={credentials.username}
                    password={credentials.password}
                    onClose={() => navigate('/')}
                    mobile={mobile}
                />
            )}
            <div className={mobile ? 'w-full' : 'max-w-[354px]'}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <div className="flex space-x-4">
                            <div>
                                <input type="text" id="firstName" name="firstName"
                                    autoComplete="firstname" placeholder="First Name"
                                    value={formData.firstName} onChange={handleChange} onKeyDown={handleNameKeyDown} required />
                            </div>
                            <div>
                                <input type="text" id="lastName" name="lastName"
                                    autoComplete="lastName" placeholder="Last Name"
                                    value={formData.lastName} onChange={handleChange} onKeyDown={handleNameKeyDown} required />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <div>
                                <input type="number" id="age" name="age"
                                    autoComplete="age" placeholder="Age"
                                    value={formData.age} onChange={handleChange} onKeyDown={handleAgeKeyDown} required />
                            </div>
                            <div className={mobile ? 'w-full' : 'w-7/10'}>
                                <select id="gender" name="gender"
                                    value={formData.gender} onChange={handleChange} required>
                                    <option value="" disabled>Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Rather Not Say">Rather Not Say</option>
                                </select>
                            </div>
                            <div className={mobile ? 'w-full' : 'w-7/10'}>
                                <input type="text" id="ethnicity" name="ethnicity"
                                    autoComplete="ethnicity" placeholder="Ethnicity"
                                    value={formData.ethnicity} onChange={handleChange} onKeyDown={handleNameKeyDown} required />
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-3">
                            <div className="relative w-full flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password" name="password"
                                    autoComplete="new-password" placeholder="Password"
                                    value={formData.password} onChange={handleChange} required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-0 bottom-2 text-light-purple hover:text-lime-500 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                </form>
            </div>
        </>
    );
}

export default UserSignup;
