import { useState } from "react";
import { useSignIn, useUser, useSession } from '@clerk/clerk-react'
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { ERROR_MESSAGES } from "../utils/errorMessages";


export default function StaffSignin() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signIn, setActive } = useSignIn();
  const { session } = useSession();
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize state to store form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  // auto sign in if already logged in
  useEffect(() => {
      if (isLoaded && isSignedIn && user) {
          const permissionLevel = user.publicMetadata?.permission;
          console.log("Permission Level:", permissionLevel);

          if (permissionLevel === "2") {
              navigate('/home');
          } else {
              setErrorMessage(ERROR_MESSAGES[422]);
              setFormData({username: "", password: ""});
              session?.end(); // revokes session server-side without navigating
          }
      }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Handle input changes and update state
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
            identifier: formData.username, 
            password: formData.password
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
            
        } else {
            console.log(result);
        }
    } catch (error) {
        setErrorMessage(ERROR_MESSAGES[error.status] 
                || ERROR_MESSAGES[500]);
        setFormData({ username: "", password: "" });
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
            <label htmlFor="staffUsername"></label>
            <input
              type="text"
              id="staffUsername"
              name="username"
              autoComplete="off"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-7/10">
            <label htmlFor="staffPassword"></label>
            <input
              type="password"
              id="staffPassword"
              name="password"
              autoComplete="off"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="text-light-purple mt-5 mb-5">
          Log in to manage bookings and assist members
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
