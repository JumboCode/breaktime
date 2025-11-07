import { useState } from "react";

export default function UserSignin() {
  // Initialize state to store form data
  const [formData, setFormData] = useState({
    ID: "",
    Pin: "",
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
    <div className="userSignIn">
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-5 gap-0 w-2/3">
           <div>
            <label
              htmlFor="userID"
              className="block text-base text-left font-light"
            >
              ID
            </label>
           </div>
           <div className="col-start-2 col-end-5">
            <input
              type="text"
              id="userID"
              name="ID"
              value={formData.userID}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[#ABB9FF] focus:border-[#B9FF00] focus:outline-none w-3/4 px-0 py-0 text-white transition-colors"
            />
           </div>  
          </div>
          <div class="grid grid-cols-5 gap-x-1 gap-y-0 w-2/3">
           <div>
            <label
              htmlFor="userPin"
              className="mt-1 block text-base text-left font-light"
            >
              Pin
            </label>
           </div>
           <div className="col-start-2 col-end-5">
            <input
              type="text"
              id="userPin"
              name="Pin"
              value={formData.Pin}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[#ABB9FF] focus:border-[#B9FF00] focus:outline-none w-3/4 px-0 py-0 transition-colors"
            />
           </div>
          </div>
            <div className="flex gap-4 w-full">
            <div>
              <h2 name="userMessage" className="flex items-align text-base font-light">
                Log in to book showers, laundry, <br />
                resources, and etc.
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