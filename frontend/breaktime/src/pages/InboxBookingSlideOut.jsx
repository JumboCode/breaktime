import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Shared styles ───────────────────────────────────────────────────────────

const FONT = "'Poppins', sans-serif";

const dashedLine = (color, extra = {}) => ({
  borderLeft: `2px dashed ${color}`,
  opacity: 0.65,
  ...extra,
});

// ─── Activity config ────────────────────────────────────────────────────────

const UPDATE_BASE = {
  pillColor: "#ABA6E3",
  pillTextColor: "#fff",
  circleColor: "#ABA6E3",
  circleBorder: "#F0F7F2",
  icon: <CheckIcon />,
};

const ACTION_BASE = {
  pillColor: "#FF480B",
  pillTextColor: "#fff",
  circleColor: "#FF480B",
  circleBorder: "#FFF0EA",
  icon: <ExclamationIcon />,
};

const UPDATE_ACTIVITY_CONFIG = {
  confirmed: { ...UPDATE_BASE, label: "Booking Confirmed", timestampPrefix: "Requested on" },
  modified:  { ...UPDATE_BASE, label: "Booking Modified",  timestampPrefix: "Modified on" },
  canceled:  { ...UPDATE_BASE, label: "Booking Canceled",  timestampPrefix: "Modified on" },
};

const ACTION_ACTIVITY_CONFIG = {
  time:    { ...ACTION_BASE, label: "Requested Extra Time",    timestampPrefix: "Requested on" },
  note:    { ...ACTION_BASE, label: "Left A Specific Note",    timestampPrefix: "Left on" },
  message: { ...ACTION_BASE, label: "Sent A General Inquiry",  timestampPrefix: "Sent on" },
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
      style={dashedLine(color, {
        width: 0,
        height,
        marginLeft: 19,
        marginTop: 8,
        marginBottom: 8,
      })}
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
        width: width || undefined,
        fontSize: 13,
        fontFamily: FONT,
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Timestamp({ prefix, value, style }) {
  if (!value) return null;
  return (
    <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: FONT, ...style }}>
      {prefix} {value}
    </span>
  );
}

function actionBtnStyle(bg, color, borderColor) {
  return {
    background: bg,
    color,
    border: `1.5px solid ${borderColor ?? bg}`,
    borderRadius: 999,
    padding: "10px 18px",
    height: 40,
    fontSize: 13,
    fontFamily: FONT,
    fontWeight: 600,
    cursor: "pointer",
  };
}

// ─── UpdateActivity ───────────────────────────────────────────────────────────

function UpdateActivity({ config, timestamp, isLast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ActivityCircle config={config} />
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} width={247} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <DottedConnector color={config.circleColor} height={isLast ? 28 : 48} />
        <Timestamp prefix={config.timestampPrefix} value={timestamp} style={{ paddingLeft: 33, paddingTop: 6 }} />
      </div>
    </div>
  );
}

// ─── Resolution config (shown after approve / reject) ────────────────────────

const RESOLUTION_CONFIG = {
  approved: {
    ...UPDATE_BASE,
    label: "Approved :)",
    timestampPrefix: "Approved on",
  },
  rejected: {
    ...UPDATE_BASE,
    label: "Rejected:(",
    timestampPrefix: "Rejected on",
  },
  messaged: {
    ...UPDATE_BASE,
    label: "Message Sent",
    timestampPrefix: "Sent on",
  },
};

// ─── ActionActivity ───────────────────────────────────────────────────────────

function ActionActivity({ config, activity, timestamp, isLast, note }) {
  const [activityKind, activityValue] = activity;
  const isTime = activityKind === "time";
  const [resolution, setResolution] = useState(null); // "approved" | "rejected" | "messaged" | null
  const resConfig = resolution ? RESOLUTION_CONFIG[resolution] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Row 1: top circle + pill ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ActivityCircle config={config} />
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} />
      </div>

      {/* ── Dashed connector + timestamp ── */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <DottedConnector color="#ABA6E3" height={32} />
        <Timestamp prefix={config.timestampPrefix ?? "Sent on"} value={timestamp} style={{ paddingLeft: 33, paddingTop: 6 }} />
      </div>

      {/* ── Dashed connector + card ── */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
          <div style={dashedLine("#ABA6E3", { flex: 1, minHeight: 24 })} />
        </div>
        <div style={{
          flex: 1,
          borderRadius: 14,
          border: "1.5px solid rgba(255, 72, 11, 0.30)",
          padding: "14px 16px",
          background: "#FFFAF8",
          fontSize: 14,
          fontWeight: 400,
          fontFamily: FONT,
          color: "#374151",
        }}>
          {isTime ? (
            <>
              <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <span style={{ color: "#6B7280", minWidth: 95, flexShrink: 0 }}>Requested:</span>
                <span style={{ color: "#FF480B", fontWeight: 600 }}>{activityValue}</span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "#6B7280", minWidth: 95, flexShrink: 0 }}>Note:</span>
                <span style={{ color: "#FF480B" }}>
                  {note ? `\u201C${note}\u201D` : "\u2014"}
                </span>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#6B7280", minWidth: 95, flexShrink: 0 }}>Note:</span>
              <span style={{ color: "#FF480B" }}>{`\u201C${activityValue}\u201D`}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Row 2: bottom circle + buttons/resolution — SAME line ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        {resolution ? (
          <ActivityCircle config={resConfig} />
        ) : (
          <EmptyCircle />
        )}
        <div style={{ flex: 1 }}>
          {resolution ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <PillBadge label={resConfig.label} bgColor={resConfig.pillColor} textColor={resConfig.pillTextColor} />
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              {isTime ? (
                <>
                  <button onClick={() => setResolution("approved")} style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Approve</button>
                  <button onClick={() => setResolution("rejected")} style={{ ...actionBtnStyle("transparent", "#FF480B", "#FF480B"), flex: 1 }}>Reject</button>
                </>
              ) : (
                <button onClick={() => setResolution("messaged")} style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Send A Message</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─��� Resolution timestamp (below the circle+pill row) ── */}
      {resolution && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <DottedConnector color="#ABA6E3" height={28} />
          <Timestamp prefix={resConfig.timestampPrefix} value={timestamp} style={{ paddingLeft: 33, paddingTop: 6 }} />
        </div>
      )}

      {/* ── Tail connector to next activity ── */}
      {!isLast && !resolution && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <DottedConnector color="#ABA6E3" height={28} />
        </div>
      )}
    </div>
  );
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
            note={act[4] ?? null}
          />
        );
      })}
    </div>
  );
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatTimestamp(ts) {
  if (!ts) return null;
  try {
    const d = new Date(ts);
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = ordinal(d.getDate());
    const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${weekday}, ${month} ${day}, ${time}`;
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
