import { useState } from "react";

// Create the StaffSignup functional component
export default function StaffSignup() {
  // Initialize state to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailConfirmation: "",
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

  return (
    <div className ="font-all">
      <div >

        <h2>
          Staff Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstName"
            >
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="emailConfirmation"
            >
              Confirm Email
            </label>
            <input
              type="email"
              id="emailConfirmation"
              name="emailConfirmation"
              value={formData.emailConfirmation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="uppercase bg-lime-500 text-3.5xl px-5 py-3 rounded-full semi-bold"
            >
            Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
