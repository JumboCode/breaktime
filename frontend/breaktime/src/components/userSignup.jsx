import { useState } from 'react';


function UserSignup() {
    const [formData, setFormData] = useState ({
        firstName: '',
        lastName: '',
        age: '',
        gender: ''
    });

    
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    }

    return (
        <div>
            <label htmlFor="firstName">First Name: </label>
            <input 
                type="text" 
                id="firstName" 
                value={formData.firstName} 
                onChange={handleChange}>
            </input>
            <label htmlFor="lastName">Last Name: </label>
            <input 
                type="text" 
                id="lastName" 
                value={formData.lastName} 
                onChange={handleChange}>
            </input>
            <label htmlFor="age">Age: </label>
            <input 
                type="text" 
                id="age" 
                value={formData.age} 
                onChange={handleChange}>
            </input>
            <label htmlFor="gender">Gender: </label>
            <input 
                type="text" 
                id="gender" 
                value={formData.gender} 
                onChange={handleChange}>
            </input>
        </div>);
}

export default UserSignup;