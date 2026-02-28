import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from "../utils/general";


function UserSignup() {
    const [formData, setFormData] = useState ({
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
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        // Build the body expected by the backend schema
        const body = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            age: Number(formData.age),
            gender: formData.gender,
            race: formData.ethnicity, // backend expects 'race'
            zone: formData.zone,
        };

        // Basic client-side validation
        if (!body.firstName || !body.lastName || !body.password || !body.age || !body.gender || !body.race || !body.zone) {
            setError('Please fill out all fields.');
            return;
        }

        (async () => {
            try {
                const res = await apiCall('/user/create', 'POST', body, null);
                setSuccess(res.message || 'Account created successfully');
                setFormData({ firstName: "", lastName: "", age: "", gender: "", ethnicity: "", password: "", zone: "" });
                // Redirect to login page
                navigate('/');
            } catch (err) {
                console.error('Signup error', err);
                setError(err?.statusText || err?.message || 'Failed to create account');
            }
        })();
    };

    return (
        <div className="max-w-[354px]">
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div className="flex space-x-4">
                        <div> 
                            <label
                                htmlFor="firstName"
                            >
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                autoComplete="firstname"
                                autoCapitalize="firstname"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                            >
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                autoComplete="lastName"
                                autoCapitalize="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div>
                            <label
                            htmlFor="age"
                            >
                            </label>
                            <input
                            type="number"
                            id="age"
                            name="age"
                            autoComplete="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className="w-7/10">
                            <label
                            htmlFor="gender"
                            >
                            </label>
                            <input
                            type="text"
                            id="gender"
                            name="gender"
                            autoComplete="gender"
                            placeholder="Gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                            />
                        </div>
                        <div className="w-7/10">
                            <label
                            htmlFor="ethnicity"
                            >
                            </label>
                            <input
                            type="text"
                            id="ethnicity"
                            name="ethnicity"
                            autoComplete="ethnicity"
                            placeholder="Ethnicity"
                            value={formData.ethnicity}
                            onChange={handleChange}
                            required
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-3">
                        <div>
                            <label htmlFor="password"></label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                <div className="w-7/10">
                    <label
                    htmlFor="zone"
                    >
                    </label>
                    <input
                    type="text"
                    id="zone"
                    name="zone"
                    autoComplete="zone"
                    placeholder="City/Neighborhood"
                    value={formData.zone}
                    onChange={handleChange}
                    required
                    />
                </div>
                </div>
                <div className="text-light-purple mt-5 mb-5">
                    Join our community and access all available resources in one place                
                </div>
                <div className="text-dark-navy">
                <button
                    type="submit"
                    className="uppercase bg-lime-500 text-xl rounded-[18px] font-semibold w-[260px] h-[48px]"
                >
                Create Account
                </button>
                </div>
            </form>
        </div>
    );
}

export default UserSignup;