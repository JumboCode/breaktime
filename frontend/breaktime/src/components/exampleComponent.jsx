import { useState } from 'react';


function ExampleComponent() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Breaktime</h1>
            <button onClick={() => setCount((count) => (count * 100) + 67)}>
            Henry was here {count}
            </button>
        </div>);
}

export default ExampleComponent;