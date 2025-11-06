import { useState } from "react";
import { Tagline } from './Tagline';
import StaffSignin from './staffSignin.jsx';
import UserSignin from './userSignin.jsx';
// Create the StaffSignUpComponent functional component

export default function StaffSignUpComponent() {

  // Initialize state to store form data
  const [active, setActive] = useState("users");
  return (
    <>
    {/* Tagline Component */}
    <div className="flex flex-col items-align space-y-6 p-6 bg-[#262445] font-display min-h-screen">
      <div className="pt-[10px] pl-[20px">
      <Tagline />
      </div>
      <div className="absolute w-110 bottom-30 right-20 bg-[#262445] text-[#ABB9FF] rounded">
        <h2 className="text-lg font-light text-align mb-4">
          Welcome Back!
        </h2>

        {/* Sliding toggle */}
        <div className="relative inline-flex w-55 bg-transparent border border-[#ABB9FF]-500 rounded-2xl overflow-hidden">
        {/* Sliding background */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-[#B9FF00] rounded-xl transition-transform duration-300 ease-in-out ${
            active === "staff" ? "translate-x-full" : "translate-x-0"
          }`}
        ></div>

        {/* Buttons */}
        <button
          onClick={() => setActive("users")}
          className={`relative z-10 flex-1 py-2 font-bold transition-colors duration-300 ${
            active === "users" ? "text-[#262445]" : "text-[#ABB9FF] font-normal"
          }`}
        >
          USERS
        </button>
        <button
          onClick={() => setActive("staff")}
          className={`relative z-10 flex-1 py-2 font-bold transition-colors duration-300 ${
            active === "staff" ? "text-[#262445]" : "text[#ABB9FF] - font-normal"
          }`}
        >
          STAFF
        </button>
        </div>

        {/* Render component based on toggle */}
        <div className="mt-6 w-full text-align">
          {active === "users" ? <UserSignin /> : <StaffSignin />}
        </div>

        <div className="flex gap-10 pt-3 pb-4">
            <button
              type="submit"
              className="text-base font-light uppercase underline underline-offset-4 transition-colors"
              >
              SIGN UP
            </button>
            <button
              type="submit"
              className="text-base font-light uppercase underline underline-offset-4 transition-colors"
              >
              FORGOT PASSWORD
            </button>
        </div>
      </div>
    </div>
    </>
  );
}
