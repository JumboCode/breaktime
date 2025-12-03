import { useState } from 'react';

function UserSignin() {
    const [formData, setFormData] = useState({
        ID: "",
        Pin: "",
    });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        console.log("Form submitted:", formData);
    };

    return (
        <div className="max-w-[354px]">
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div className="w-7/10">
                        <label htmlFor="userID">
                        </label>
                        <input
                            type="text"
                            id="userID"
                            name="ID"
                            autoComplete="off"
                            placeholder="ID"
                            value={formData.ID}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="w-7/10">
                        <label htmlFor="userPin">
                        </label>
                        <input
                            type="password"
                            id="userPin"
                            name="Pin"
                            autoComplete="off"
                            placeholder="PIN"
                            value={formData.Pin}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="text-light-purple mt-5 mb-5">
                    Log in to book showers, laundry, and access available resources
                </div>

                <div className="text-dark-navy">
                    <button
                        type="submit"
                        className="uppercase bg-lime-500 text-xl rounded-[18px] font-semibold w-[260px] h-[48px]"
                    >
                        Log In
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserSignin;
