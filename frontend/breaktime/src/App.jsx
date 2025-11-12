/*
 *  App.jsx
 *  Entry point for the frontend
 * 
 */

import { BrowserRouter as Router, Route, Routes} from 'react-router';

import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<LandingPage />} />
          <Route path='/home' element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
