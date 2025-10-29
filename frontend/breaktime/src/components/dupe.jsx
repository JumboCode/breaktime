import { useState } from 'react';


function UserSignup() {
    const [formData, setFormData] = useState ({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        ethnicity: "",
        zone: "",
    });
    const [error, setError] = useState("");
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        console.log("Form submitted:", formData);
    };

    return (
        <div className="max-w-[354px]">
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name: </label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}>
                </input>
                <br></br>

                <label htmlFor="lastName">Last Name: </label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}>
                </input>
                <br></br>

                <label htmlFor="age">Age: </label>
                <input 
                    type="number" 
                    id="age" 
                    value={formData.age} 
                    onChange={handleChange}>
                </input>
                <br></br>

                <label htmlFor="gender">Gender: </label>
                <input 
                    type="text" 
                    id="gender" 
                    value={formData.gender} 
                    onChange={handleChange}>
                </input>
                <br></br>

                <label htmlFor="ethnicity">Ethnicity: </label>
                <input 
                    type="text" 
                    id="ethnicity" 
                    value={formData.ethnicity} 
                    onChange={handleChange}>
                </input>
                <br></br>

                <label htmlFor="zone">Zone: </label>
                <input 
                    type="text" 
                    id="zone" 
                    value={formData.zone} 
                    onChange={handleChange}>
                </input>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default UserSignup;