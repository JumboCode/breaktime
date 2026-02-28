import React from 'react';
import { useUser } from '@clerk/clerk-react';
import HomePage from '../pages/HomePage.jsx';
import YouthLandingPage from '../pages/YouthLandingPage.jsx';

// Chooses which home page to render based on Clerk user public metadata.permission.
// permission: 0 = pending, 1 = user, 2 = staff
export default function HomeChooser() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const permission = Number(user?.publicMetadata?.permission ?? 0);

  if (permission === 2) {
    // staff
    return <HomePage />;
  }

  if (permission === 1) {
    // regular user
    return <YouthLandingPage />;
  }

  // fallback (should be blocked by ProtectedRoute) — show a simple message
  return <div>You don't have access to this page.</div>;
}
