
import { useUser } from '@clerk/clerk-react';
import HomePage from '../pages/HomePage.jsx';
import YouthLandingPage from '/src/pages/YouthLandingPage.jsx';
import YouthLandingPageMobile from '/src/pages/mobile/YouthLandingPageMobile.jsx';


/* 
 * Checking if user is on a mobile device by seeing if the window size is less than 1025 pixels
 * or if the userAgent contains the text "Android, iPhone, iPad, or iPod"
 */
const isMobile = () => {
  console.log(navigator.userAgent)
  console.log("Regex Test Result: ", /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  console.log("Inner Window REsult ", window.innerWidth)

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

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
    return isMobile() ? <YouthLandingPageMobile/> : <YouthLandingPage />;
  }

  // fallback (should be blocked by ProtectedRoute) — show a simple message
  return <div>You don't have access to this page.</div>;
}
