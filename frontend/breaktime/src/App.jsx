/*
 *  App.jsx
 *  Entry point for the frontend
 * 
 */

import { useState } from 'react';
import PWABadge from './PWABadge.jsx';


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Breaktime</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          You have clicked me {count}
        </button>
      </div>

      <PWABadge />
    </>
  );
}

export default App;
