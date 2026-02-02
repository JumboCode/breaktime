import { useState } from "react";
import { useSignIn, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

export default function StaffSignin() {
  const { signIn, setActive } = useSignIn();
  let navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  // Initialize state to store form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // auto sign in if already logged in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
        navigate("/home");
    }
  }, [isSignedIn]);

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
            navigate('/home');
            
        } else {
            console.log(result);
        }
    } catch (error) {
        console.log(error);
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
              autoComplete="username"
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
              autoComplete="current-password"
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
            className="uppercase bg-lime-500 text-xl rounded-[18px] font-semibold w-[260px] h-[48px]"
          >
            
              Log In
          </button>
        </div>
      </form>
    </div>
  );
}
