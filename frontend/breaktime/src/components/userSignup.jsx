import { useState } from 'react';


function userSignup() {
    const [count, setCount] = useState(0);

    return (
        <div>
            {/* <h1>Breaktime</h1>
            <button onClick={() => setCount((count) => (count * 100) + 67)}>
            Click here: {count}
            </button> */}
            
            <label htmlFor="textInput">First Name:</label>
            <input type="text" id="textInput" value={inputValue} onchange={handleChange}> Hello
            </input>
        </div>);
}

export default userSignup;