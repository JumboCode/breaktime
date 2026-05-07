import { motion, AnimatePresence } from "motion/react";
import BookingActivityFeed from "./BookingActivity";

const FONT = "'Poppins', sans-serif";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InboxBookingSlideOut({ isOpen, onClose, booking }) {
  if (!booking) return null;

  const activities = booking.activity ?? [
    [
      booking.activityType === "action" ? "action" : "update",
      booking.activityType === "action" ? "note" : (booking.status ?? "confirmed"),
      booking.activityMessage ?? "",
      booking.timestamp,
    ],
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.18)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 440,
          background: "#fff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.10)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          fontFamily: FONT,
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <BookingActivityFeed activities={activities} booking={booking} />
        </div>
      </motion.aside>
    </>
  );
}
