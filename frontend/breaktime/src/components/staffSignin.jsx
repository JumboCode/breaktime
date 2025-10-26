import { useState } from "react";

export default function staffSignin() {
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
          <div>
            <label
              htmlFor="staffUsername"
              className="block text-sm font-medium text-grey-700"
            >
              ID
            </label>
            <input
              type="text"
              id="staffUsername"
              name="staffUsername"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />  
          </div>
          <div>
            <label
              htmlFor="staffPasword"
              className="block text-sm font-medium text-gray-700"
            >
              Pin
            </label>
            <input
              type="text"
              id="staffPasword"
              name="staffPasword"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </div>
          <h2 className="staffMessage">
            Log in to manage bookings and assist members
          </h2>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            LOG IN
            </button>
          </div>
        </form>
    </div>
  );
}