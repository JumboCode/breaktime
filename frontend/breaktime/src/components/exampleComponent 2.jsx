import { useState } from 'react';


function ExampleComponent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Breaktime</h1>
            <button onClick={() => setCount((count) => count + 1)}>
            You have clicked me {count}
            </button>
        </div>);
}

export default ExampleComponent;