import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const location = useLocation();

  // While Clerk is initializing, show a small loader to avoid flicker
  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    // Redirect to the sign-in page at '/' and store where the user wanted to go
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Check numeric permission in Clerk publicMetadata: 0 = pending, 1 = user, 2 = staff
  const permission = Number(user?.publicMetadata?.permission ?? 0);
  if (Number.isNaN(permission) || permission < 1) {
    // pending accounts (0) or invalid metadata are not allowed to access protected pages
    return <Navigate to="/" replace />;
  }

  return children;
}
