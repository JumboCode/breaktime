import { useState, useEffect } from 'react';
import { useSignIn, useUser, useSession } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import { ERROR_MESSAGES } from "/src/utils/errorMessages";

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

function UserSignin() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signIn, setActive } = useSignIn();
    const { session } = useSession();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const mobile = isMobile();

    const [formData, setFormData] = useState({
        ID: "",
        Pin: "",
    });

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const permissionLevel = Number(user.publicMetadata?.permission ?? 0);
            if (permissionLevel === 1) {
                navigate('/home');
            } else {
                setErrorMessage(ERROR_MESSAGES[422]);
                setFormData({ ID: "", Pin: ""});
                session?.end();
            }
        }
    }, [isLoaded, isSignedIn, user, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoaded) return;
        try {
            const result = await signIn.create({
                identifier: formData.ID, 
                password: formData.Pin
            });
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
            } else {
                console.log(result);
            }
        } catch (error) {
            setErrorMessage(ERROR_MESSAGES[error.status] || ERROR_MESSAGES[500]);
            setFormData({ ID: "", Pin: "" });
            if (setActive) setActive({ session: null });
        }
    };

    return (
        <div className={mobile ? 'w-full' : 'max-w-[354px]'}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <div className={mobile ? 'w-full' : 'w-7/10'}>
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
                    <div className={mobile ? 'w-full' : 'w-7/10'}>
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

                <div className={`text-light-purple mt-5 mb-5 ${mobile ? 'text-[3.5vw]' : ''}`}>
                    Log in to book showers, laundry, and access available resources
                </div>

                <div className="text-dark-navy">
                    <button
                        type="submit"
                        className={`uppercase bg-lime-500 rounded-[18px] font-semibold
                            ${mobile ? 'text-[4vw] w-full h-[12vw]' : 'text-xl w-[260px] h-12'}`}
                    >
                        Log In
                    </button>
                </div>
                <div className={`text-red mt-2 ${mobile ? 'text-[3.5vw]' : ''}`}> 
                    {errorMessage}
                </div>
            </form>
        </div>
    );
}

export default UserSignin;