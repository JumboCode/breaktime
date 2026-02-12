/*
 *  App.jsx
 *  Entry point for the frontend
 *
 */

import { BrowserRouter as Router, Route, Routes} from 'react-router';

import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ModalProvider from './components/popup/ModalProvider.jsx';
import TestPage from './pages/testPage.jsx';
import YouthLandingPage from './pages/YouthLandingPage.jsx';
import { ClerkProvider } from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.log("Add your Clerk Publishable Key to the .env file")
}

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ModalProvider>
        <Router>
          <Routes>
            <Route path='/' element={<SignInPage />} />
            <Route path='/signup' element={<SignUpPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/yahome' element={<YouthLandingPage />} />
            <Route path='/test' element={<TestPage />} />
          </Routes>
        </Router>
      </ModalProvider>
    </ClerkProvider>
  );
}

export default App;