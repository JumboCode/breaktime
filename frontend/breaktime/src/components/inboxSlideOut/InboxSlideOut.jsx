import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import BookingActivityFeed from "./BookingActivity";
import MessageThread from "./MessageThread";

const FONT = "'Poppins', sans-serif";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InboxBookingSlideOut({ isOpen, onClose, booking, onReplySuccess, userRole = 'staff' }) {
  const checkMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
  const [isMobile, setIsMobile] = useState(() => checkMobile());

  useEffect(() => {
    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen, isMobile]);

  if (!booking) return null;

  const isMessage = booking.isMessage === true;

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
        key={isMobile ? "mobile" : "desktop"}
        initial={isMobile ? { y: "100%" } : { x: "100%" }}
        animate={isMobile ? { y: isOpen ? 0 : "100%" } : { x: isOpen ? 0 : "100%" }}
        drag={isMobile ? "y" : false}
        dragConstraints={{ top: 0 }}
        dragElastic={0.15}
        onDragEnd={(_, { offset, velocity }) => {
          if (isMobile && (offset.y > 80 || velocity.y > 500)) onClose();
        }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        style={{
          position: "fixed",
          top: isMobile ? 0 : 0,
          right: 0,
          bottom: 0,
          left: isMobile ? 0 : "auto",
          width: "100%",
          maxWidth: isMobile ? "100%" : 440,
          background: "#fff",
          boxShadow: isMobile ? "0 -4px 40px rgba(0,0,0,0.12)" : "-8px 0 40px rgba(0,0,0,0.10)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          fontFamily: FONT,
        }}
      >
        {/* Drag handle — mobile only */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4, flexShrink: 0, cursor: "grab" }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#D1D5DB" }} />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9CA3AF",
            fontSize: 20,
            lineHeight: 1,
            zIndex: 1,
          }}
        >
          ×
        </button>

        {/* touchAction + stopPropagation keep scroll from triggering the dismiss drag */}
        <div
          style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", touchAction: "pan-y" }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isMessage ? (
            <MessageThread notification={booking} onReplySuccess={onReplySuccess} />
          ) : (
            <BookingActivityFeed activities={activities} booking={booking} userRole={userRole} />
          )}
        </div>
      </motion.aside>
    </>
  );
}

InboxBookingSlideOut.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.shape({
    isMessage: PropTypes.bool,
    activity: PropTypes.array,
    activityType: PropTypes.string,
    activityMessage: PropTypes.string,
    status: PropTypes.string,
    timestamp: PropTypes.string,
  }),
  onReplySuccess: PropTypes.func,
  userRole: PropTypes.string,
};
