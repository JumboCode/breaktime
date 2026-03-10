import { motion, AnimatePresence } from "motion/react";

// ─── Activity config ────────────────────────────────────────────────────────

const UPDATE_ACTIVITY_CONFIG = {
  confirmed: {
    label: "Booking Confirmed",
    pillColor: "#ABA6E3",
    pillTextColor: "#fff",
    circleColor: "#ABA6E3",
    circleBorder: "#F0F7F2",
    icon: <CheckIcon />,
    timestampPrefix: "Requested on",
  },
  modified: {
    label: "Booking Modified",
    pillColor: "#ABA6E3",
    pillTextColor: "#fff",
    circleColor: "#ABA6E3",
    circleBorder: "#F0F7F2",
    icon: <CheckIcon />,
    timestampPrefix: "Modified on",
  },
  canceled: {
    label: "Booking Canceled",
    pillColor: "#ABA6E3",
    pillTextColor: "#fff",
    circleColor: "#ABA6E3",
    circleBorder: "#F0F7F2",
    icon: <CheckIcon />,
    timestampPrefix: "Modified on",
  },
};

const ACTION_ACTIVITY_CONFIG = {
  time: {
    label: "Requested Extra Time",
    pillColor: "#FF480B",
    pillTextColor: "#fff",
    circleColor: "#FF480B",
    circleBorder: "#FFF0EA",
    icon: <ExclamationIcon />,
    timestampPrefix: "Requested on",
  },
  note: {
    label: "Left A Specific Note",
    pillColor: "#FF480B",
    pillTextColor: "#fff",
    circleColor: "#FF480B",
    circleBorder: "#FFF0EA",
    icon: <ExclamationIcon />,
    timestampPrefix: "Left on",
  },
  message: {
    label: "Sent A General Inquiry",
    pillColor: "#FF480B",
    pillTextColor: "#fff",
    circleColor: "#FF480B",
    circleBorder: "#FFF0EA",
    icon: <ExclamationIcon />,
    timestampPrefix: "Sent on",
  },
};

function getActivityConfig(activityType, activityKind) {
  if (activityType === "update") return UPDATE_ACTIVITY_CONFIG[activityKind] ?? UPDATE_ACTIVITY_CONFIG.confirmed;
  if (activityType === "action") return ACTION_ACTIVITY_CONFIG[activityKind] ?? ACTION_ACTIVITY_CONFIG.note;
  return UPDATE_ACTIVITY_CONFIG.confirmed;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9.5L7 13L14.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExclamationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="7.5" y="3.5" width="3" height="7.5" rx="1.5" fill="#B9FF00" />
      <circle cx="9" cy="14" r="1.5" fill="#B9FF00" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 4L14 14M14 4L4 14" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function ActivityCircle({ config }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: config.circleColor,
        border: `3px solid ${config.circleBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {config.icon}
    </div>
  );
}

/** White outlined circle – same 40×40 footprint, sits below action cards */
function EmptyCircle() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "2px solid #D1D5DB",
        flexShrink: 0,
      }}
    />
  );
}

function DottedConnector({ color = "#ABA6E3", height = 48 }) {
  return (
    <div
      style={{
        width: 0,
        height,
        borderLeft: `2px dashed ${color}`,
        marginLeft: 19, // (40px circle / 2) - 1px border = centers perfectly
        marginTop: 8,
        marginBottom: 8,
        opacity: 0.65,
      }}
    />
  );
}

function PillBadge({ label, bgColor, textColor, width }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 999,
        padding: "0 14px",
        height: 32,
        width: width ? width : undefined,
        fontSize: 13,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

// ─── UpdateActivity ───────────────────────────────────────────────────────────
// Fix #1: alignItems "center" on the row so circle vertically aligns with pill
// Fix #2 & #3: DottedConnector always renders (even on last item, shorter)

function UpdateActivity({ config, timestamp, isLast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Circle + pill on the same y-axis */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ActivityCircle config={config} />
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} width={247} />
      </div>

      {/* Dotted line + timestamp in same row; paddingLeft = gap(12) + pill-offset so text sits under pill */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <DottedConnector color={config.circleColor} height={isLast ? 28 : 48} />
        {timestamp && (
          <span
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              fontFamily: "'Poppins', sans-serif",
              paddingLeft: 33,
              paddingTop: 6,
            }}
          >
            {config.timestampPrefix} {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── ActionActivity ───────────────────────────────────────────────────────────
// Fix #4a: FF480B color  
// Fix #4b: ExclamationIcon with B9FF00 fill  
// Fix #4c: circle aligns with pill via alignItems "center"  
// Fix #4d: buttons full width  
// Fix #4e & #4f: white EmptyCircle below card for all action types  
// Fix #4g: dotted line from exclamation circle → card → white circle  

function ActionActivity({ config, activity, timestamp, isLast }) {
  const [activityKind, activityValue] = activity;
  const isTime = activityKind === "time";

  return (
    /*
      Single two-column layout for the entire component:
      LEFT  col (width 40): circle → unbroken dashed line → empty circle → optional tail
      RIGHT col (flex 1):   pill → timestamp → card → buttons
      This guarantees one continuous line with zero segments.
    */
    <div style={{ display: "flex", gap: 12 }}>

      {/* ── LEFT: circles + one unbroken dashed line ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
        <ActivityCircle config={config} />
        {/* Single stretchy dashed border — no separate DottedConnector segments */}
        <div style={{
          flex: 1,
          borderLeft: `2px dashed ${config.circleColor}`,
          opacity: 0.65,
          marginTop: 8,
          marginBottom: 8,
          minHeight: 24,
        }} />
        <EmptyCircle />
        {!isLast && (
          <div style={{
            height: 24,
            borderLeft: `2px dashed ${config.circleColor}`,
            opacity: 0.65,
          }} />
        )}
      </div>

      {/* ── RIGHT: all text content ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 8 }}>
        {/* Pill on same y as circle (paddingTop: 8 offsets to center with 40px circle) */}
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} />

        {/* Timestamp — same style as UpdateActivity */}
        {timestamp && (
          <span style={{
            fontSize: 12,
            color: "#9CA3AF",
            fontFamily: "'Poppins', sans-serif",
            marginTop: 4,
            marginBottom: 12,
          }}>
            {config.timestampPrefix ?? "Sent on"} {timestamp}
          </span>
        )}

        {/* Note / value card */}
        <div style={{
          border: "1px solid #E5E7EB",
          borderRadius: 8,
          border: "1.5px solid #FF480B",
          padding: "10px 12px",
          background: "#FAFAFA",
          fontSize: 13,
          fontFamily: "'Poppins', sans-serif",
          color: "#374151",
          marginBottom: 8,
        }}>
          {isTime ? (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                <span style={{ color: "#6B7280", minWidth: 80 }}>Requested:</span>
                <span style={{ color: "#FF480B", fontWeight: 600 }}>{activityValue}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "#6B7280", minWidth: 80 }}>Note:</span>
                <span style={{ fontStyle: "italic", color: "#4B5563" }}>—</span>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#6B7280", minWidth: 44 }}>Note:</span>
              <span style={{ fontStyle: "italic", color: "#4B5563" }}>"{activityValue}"</span>
            </div>
          )}
        </div>

        {/* Full-width action buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {isTime ? (
            <>
              <button style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Approve</button>
              <button style={{ ...actionBtnStyle("transparent", "#FF480B", "#FF480B"), flex: 1 }}>Reject</button>
            </>
          ) : (
            <button style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Send A Message</button>
          )}
        </div>
      </div>

    </div>
  );
}

function actionBtnStyle(bg, color, borderColor) {
  return {
    background: bg,
    color,
    border: `1.5px solid ${borderColor ?? bg}`,
    borderRadius: 999,
    padding: "8px 18px",
    fontSize: 13,
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    cursor: "pointer",
  };
}

// ─── BookingActivityFeed ──────────────────────────────────────────────────────

function BookingActivityFeed({ activities, booking }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {activities.map((act, i) => {
        const [activityType, activityKind, activityValue, timestamp] = act;
        const config = getActivityConfig(activityType, activityKind);
        const isLast = i === activities.length - 1;
        const ts = formatTimestamp(timestamp ?? booking.timestamp);

        if (activityType === "update") {
          return <UpdateActivity key={i} config={config} timestamp={ts} isLast={isLast} />;
        }
        return (
          <ActionActivity
            key={i}
            config={config}
            activity={[activityKind, activityValue]}
            timestamp={ts}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
}

function formatTimestamp(ts) {
  if (!ts) return null;
  try {
    const d = new Date(ts);
    return (
      d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) +
      ", " +
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  } catch {
    return String(ts);
  }
}

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
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <BookingActivityFeed activities={activities} booking={booking} />
        </div>
      </motion.aside>
    </>
  );
}