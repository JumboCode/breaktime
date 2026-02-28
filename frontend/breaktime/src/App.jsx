/*
 *  App.jsx
 *  Entry point for the frontend
 *
 */

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import ModalProvider from './components/popup/ModalProvider.jsx';
import TestPage from './pages/testPage.jsx';
import { ClerkProvider } from '@clerk/clerk-react'
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import HomeChooser from './components/HomeChooser.jsx';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.log("Add your Clerk Publishable Key to the .env file")
}

function App() {
  return (
    <ModalProvider>
      <Router>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
          <Routes>
            {/* Sign in stays at `/` per your request */}
            <Route path='/' element={<SignInPage />} />
            <Route path='/signup' element={<SignUpPage />} />

            {/* Protected /home: chooser decides Youth vs General home based on Clerk user metadata */}
            <Route
              path='/home'
              element={
                <ProtectedRoute>
                  <HomeChooser />
                </ProtectedRoute>
              }
            />

            {/* Keep a test route for development */}
            <Route path='/test' element={<TestPage />} />
          </Routes>
        </ClerkProvider>
      </Router>
    </ModalProvider>
  );
}

export default App;