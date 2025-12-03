// /*
//  *  App.jsx
//  *  Entry point for the frontend
//  * 
//  */

// import { BrowserRouter as Router, Route, Routes} from 'react-router';

import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import HomePage from './pages/HomePage.jsx';

// function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/home' element={<HomePage />} />
        </Routes>
      </Router>
    </>
  );
}






// 

