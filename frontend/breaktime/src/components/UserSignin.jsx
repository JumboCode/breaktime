import { useState } from 'react';
import { useSignIn, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from "../utils/errorMessages";
import { useClerk } from '@clerk/clerk-react';


function UserSignin() {
    const { user, isLoaded, isSignedIn } = useUser();
    const { signIn, setActive } = useSignIn();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const { signOut } = useClerk();
    const [ loggedIn, setLoggedIn ] = useState('');

    const [formData, setFormData] = useState({
        ID: "",
        Pin: "",
    });
    
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // auto sign in if already logged in
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const permissionLevel = user.publicMetadata?.permission;
            console.log("Permission Level:", permissionLevel);

            if (permissionLevel === "0") {
                navigate('/yahome');
            } else {
                setErrorMessage(ERROR_MESSAGES[422]);
                // signout();
                setFormData({ ID: "", Pin: ""});
                
                setActive({ session: null });

            }
        }
    }, [isLoaded, isSignedIn, user, navigate, signOut]);

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
                // const permissionLevel = user.publicMetadata?.permission;

                // dont create an active session unless a user
                // if (permissionLevel !== "0") {
                //     setErrorMessage(ERROR_MESSAGES[400]);
                //     return;
                // }  

                await setActive({ session: result.createdSessionId });
                
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error.status);
            setErrorMessage(ERROR_MESSAGES[error.status] 
                || ERROR_MESSAGES[500]);
            setFormData({ ID: "", Pin: "" });
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
