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
  const [error, setError] = useState("");

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
    if (formData.email !== formData.emailConfirmation) {
      setError("Emails do not match.");
      return;
    }
    setError('')
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <form 
        onSubmit={handleSubmit} 
        
      >
        <div className="flex space-x-4">
          <div className="flex space-x-4"> 
            <input
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="firstname"
              autoCapitalize="firstname"
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
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="lastName"
              autoCapitalize="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
          >
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="emailConfirmation"
          >
          </label>
          <input
            type="email"
            id="emailConfirmation"
            name="emailConfirmation"
            autoComplete="emailConfirmation"
            placeholder="Email Confirmation"
            value={formData.emailConfirmation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="username"
          >
          </label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
          >
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="uppercase bg-lime-500 text-[32px] rounded-full SemiBold text-black w-[354px] h-354px]"
          >
          Create Account
          </button>
        </div>
      </form>
    </div>  
  ); 
}
