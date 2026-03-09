// import LandingPagePopup from "../components/popup/LandingPagePopup";
// import React from "react";

// export default function TestPage() {
  //   return (
    //     // Testing!!
    //     <div>
    //       <motion.div
    //         initial={{ x: "100%" }}  // Starts completely off-screen to the right
    //         animate={{ x: 0 }}       // Slides into its original position
    //         transition={{ duration: 0.5, ease: "easeOut" }} // Controls speed and feel
    //       >
    //         I'm sliding in!
    //       </motion.div>
    //     </div>
    //   );
    // }
    
    // app/test/page.tsx
// 'use client';

import { useState } from 'react';
import InboxBookingSlideOut from './InboxBookingSlideOut';

const dummyBooking = {
  id: '1',
  guestName: 'Jane Doe',
  time: 'March 10, 2026 · 3:00 PM',
  location: 'Breaktime Café – Table 4',
  activityType: 'action', // try 'update' too
  activityMessage: 'Please confirm the room change to 2B.',
};

export default function TestSlideOutPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center relative">
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow"
      >
        Open booking slide-out
      </button>

      <InboxBookingSlideOut
        isOpen={open}
        onClose={() => setOpen(false)}
        booking={dummyBooking}
      />
    </main>
  );
}
