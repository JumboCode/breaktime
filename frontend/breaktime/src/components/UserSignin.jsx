import { useState } from 'react';
import { useSignIn, useUser, useSession } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from "../utils/ErrorMessages";


function UserSignin() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signIn, setActive } = useSignIn();
    const { session } = useSession();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        ID: "",
        Pin: "",
    });

    // auto sign in if already logged in
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const permissionLevel = Number(user.publicMetadata?.permission ?? 0);
            console.log("Permission Level:", permissionLevel);

            if (permissionLevel === 1) {
                navigate('/home');
            } else {
                setErrorMessage(ERROR_MESSAGES[422]);
                setFormData({ ID: "", Pin: ""});
                session?.end(); // revokes session server-side without navigating
            }
        }
    }, [isLoaded, isSignedIn, user, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (event) => {
        console.log("isLoaded in user: ", isLoaded)
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
            console.log(error.status);
            setErrorMessage(ERROR_MESSAGES[error.status] 
                || ERROR_MESSAGES[500]);
            setFormData({ ID: "", Pin: "" });
            if (setActive) {
                setActive({ session: null});
            }
        }
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
                        className="uppercase bg-lime-500 text-xl rounded-[18px] font-semibold w-[260px] h-12"
                    >
                        Log In
                    </button>
                    
                </div>
                <div className="text-red mt-2"> 
                    {errorMessage}
                </div>
            </form>
        </div>
    );
}

export default UserSignin;
