import { useState } from "react";

export default function StaffSignin() {
  // Initialize state to store form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Handle input changes and update state
  const handleChange = (event) => {
    // Extract the name and value from the event target
    const { name, value } = event.target;
    setFormData((prevData) => ({
      // update state with previous data and new value
      ...prevData,
      [name]: value, // dynamically set the property based on input name
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
};

return(
    <div className="staffSignIn">
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-6 gap-0 w-2/3">
           <div>
            <label
              htmlFor="staffUsername"
              className="flex items-align text-base font-light"
            >
              Username
            </label>
           </div>
           <div className="col-start-3 col-end-6">
            <input
              type="text"
              id="staffUsername"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[#ABB9FF] focus:border-[#B9FF00] focus:outline-none w-5/6 px-0 py-0 transition-colors"
            />  
           </div>
          </div>
          <div className="grid grid-cols-6 gap-0 w-2/3">
           <div>
            <label
              htmlFor="staffPasword"
              className="mt-1 inline text-base font-light"
            >
              Password
            </label>
           </div>
           <div className="col-start-3 col-end-6">
            <input
              type="text"
              id="staffPasword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[#ABB9FF] focus:border-[#B9FF00] focus:outline-none w-5/6 px-0 py-0 transition-colors"
            />
           </div>
          </div>
          <div className="flex gap-4 w-full">
            <div>
              <h2 name="staffMessage" className="flex items-align text-base font-light">
                  Log in to manage bookings and <br />
                  assist members
              </h2>
             </div>
            <div>
              <button
                type="submit"
                className="flex justify-center py-1.5 px-3.5 border-w border-transparent rounded-2xl shadow-sm text-base font-bold text-[#262445] bg-[#B9FF00] focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
              LOG IN
              </button>
            </div>
          </div>
        </form>
    </div>
  );
}