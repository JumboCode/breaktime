/*
 *  App.jsx
 *  Entry point for the frontend
 * 
 */

import PWABadge from './PWABadge.jsx';
import UserSignup from './components/UserSignup.jsx';
import StaffSignup from './components/StaffSignup.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { BrowserRouter as Router, Route, Routes} from 'react-router';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/signup' element={<LandingPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
