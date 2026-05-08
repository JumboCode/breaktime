import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { toDisplayTimestamp, apiCall } from "/src/utils/general.js";
import SendMessageModal from "/src/components/popups/messaging/SendMessageModal.jsx";

const FONT = "'Poppins', sans-serif";

// Returns the original desktop px value unchanged on desktop (>= 1025px),
// and a vw-proportional value on mobile.
const getSize = (desktopPx, mobileVw) => {
  if (typeof window === "undefined" || window.innerWidth >= 440) return desktopPx;
  return Math.round(window.innerWidth * mobileVw);
};

const dashedLine = (color, extra = {}) => ({
  borderLeft: `2px dashed ${color}`,
  opacity: 0.65,
  ...extra,
});

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
  confirmed: { ...UPDATE_BASE, label: "Booking Created" },
  modified:  { ...UPDATE_BASE, label: "Booking Modified" },
  canceled:  { ...UPDATE_BASE, label: "Booking Canceled" },
  approved:  { ...UPDATE_BASE, label: "Extra Time Approved" },
  rejected:  { ...UPDATE_BASE, label: "Extra Time Rejected" },
};

const ACTION_ACTIVITY_CONFIG = {
  time: { ...ACTION_BASE, label: "Requested Extra Time" },
  note: { ...ACTION_BASE, label: "Left A Specific Note" },
};

function getActivityConfig(activityType, activityKind) {
  if (activityType === "update") return UPDATE_ACTIVITY_CONFIG[activityKind] ?? UPDATE_ACTIVITY_CONFIG.confirmed;
  if (activityType === "action") return ACTION_ACTIVITY_CONFIG[activityKind] ?? ACTION_ACTIVITY_CONFIG.note;
  return UPDATE_ACTIVITY_CONFIG.confirmed;
}

function CheckIcon() {
  const size = getSize(18, 0.045);
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9.5L7 13L14.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExclamationIcon() {
  const size = getSize(18, 0.045);
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <rect x="7.5" y="3.5" width="3" height="7.5" rx="1.5" fill="#B9FF00" />
      <circle cx="9" cy="14" r="1.5" fill="#B9FF00" />
    </svg>
  );
}

function ActivityCircle({ config }) {
  const size = getSize(40, 0.11);
  return (
    <div
      style={{
        width: size,
        height: size,
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
  const size = getSize(40, 0.11);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "2px solid #D1D5DB",
        flexShrink: 0,
      }}
    />
  );
}

function DottedConnector({ color = "#ABA6E3", height = 48 }) {
  const marginLeft = getSize(19, 0.05);
  const connectorHeight = getSize(height, height / 390);
  return (
    <div
      style={dashedLine(color, {
        width: 0,
        height: connectorHeight,
        marginLeft,
        marginTop: getSize(8, 0.02),
        marginBottom: getSize(8, 0.02),
      })}
    />
  );
}

function PillBadge({ label, bgColor, textColor, width }) {
  const pillHeight = getSize(32, 0.085);
  const fontSize = getSize(13, 0.038);
  const paddingH = getSize(14, 0.04);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: 999,
        padding: `0 ${paddingH}px`,
        height: pillHeight,
        width: width || undefined,
        fontSize,
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
  const fontSize = getSize(12, 0.032);
  return (
    <span style={{ fontSize, color: "#9CA3AF", fontFamily: FONT, ...style }}>
      {prefix} {value}
    </span>
  );
}

function actionBtnStyle(bg, color, borderColor) {
  const height = getSize(40, 0.10);
  const fontSize = getSize(13, 0.038);
  const padV = getSize(10, 0.025);
  const padH = getSize(18, 0.045);
  return {
    background: bg,
    color,
    border: `1.5px solid ${borderColor ?? bg}`,
    borderRadius: 999,
    padding: `${padV}px ${padH}px`,
    height,
    fontSize,
    fontFamily: FONT,
    fontWeight: 600,
    cursor: "pointer",
  };
}

function UpdateActivity({ config, timestamp, isLast }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ActivityCircle config={config} />
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} width={getSize(247, 0.63)} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {!isLast && <DottedConnector color={config.circleColor} height={48} />}
        <Timestamp prefix="" value={timestamp} style={{ paddingLeft: isLast ? 52 : 33, paddingTop: 6 }} />
      </div>
    </div>
  );
}

ActivityCircle.propTypes = { config: PropTypes.object.isRequired };
DottedConnector.propTypes = { color: PropTypes.string, height: PropTypes.number };
PillBadge.propTypes = { label: PropTypes.string, bgColor: PropTypes.string, textColor: PropTypes.string, width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) };
Timestamp.propTypes = { prefix: PropTypes.string, value: PropTypes.string, style: PropTypes.object };
UpdateActivity.propTypes = { config: PropTypes.object.isRequired, timestamp: PropTypes.string, isLast: PropTypes.bool };

const RESOLUTION_CONFIG = {
  approved: { ...UPDATE_BASE, label: "Approved",    timestampPrefix: "Approved on" },
  rejected: { ...UPDATE_BASE, label: "Rejected",    timestampPrefix: "Rejected on" },
  messaged: { ...UPDATE_BASE, label: "Message Sent",   timestampPrefix: "Sent on"     },
};

function ActionActivity({ config, activity, timestamp, isLast, note, userRole = 'staff', booking, dbResolution }) {
  const [activityKind, activityValue] = activity;
  const isTime = activityKind === "time";

  const [localResolution, setLocalResolution] = useState(null);
  const [localSentAt, setLocalSentAt]         = useState(null);
  const [showModal, setShowModal]             = useState(false);

  const effectiveResolution = dbResolution?.resolution || localResolution;
  const effectiveSentAt     = dbResolution?.sentAt     || localSentAt;
  const resConfig           = effectiveResolution ? RESOLUTION_CONFIG[effectiveResolution] : null;

  const handleApprove = () => {
    setLocalResolution('approved');
    setLocalSentAt(new Date().toLocaleString('en-US', {
      weekday: 'long', month: 'short', day: '2-digit',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }));
    apiCall('/booking/edit', 'PUT', { bookingID: booking?.bookingID, timeResponse: 'approved' }, null)
      .catch(err => console.error('Failed to persist approval:', err));
  };

  const handleReject = () => {
    setLocalResolution('rejected');
    setLocalSentAt(new Date().toLocaleString('en-US', {
      weekday: 'long', month: 'short', day: '2-digit',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }));
    apiCall('/booking/edit', 'PUT', { bookingID: booking?.bookingID, timeResponse: 'rejected' }, null)
      .catch(err => console.error('Failed to persist rejection:', err));
  };

  const handleSent = () => {
    const sentAt = new Date().toLocaleString('en-US', {
      weekday: 'long', month: 'short', day: '2-digit',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
    setLocalResolution('messaged');
    setLocalSentAt(sentAt);
    setShowModal(false);
    apiCall('/booking/edit', 'PUT', { bookingID: booking?.bookingID, messageResponse: true }, null)
      .catch(err => console.error('Failed to persist message response:', err));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Row 1: top circle + pill */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ActivityCircle config={config} />
        <PillBadge label={config.label} bgColor={config.pillColor} textColor={config.pillTextColor} />
      </div>

      {/* Dashed connector + timestamp */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <DottedConnector color="#ABA6E3" height={32} />
        <Timestamp prefix="" value={timestamp} style={{ paddingLeft: 33, paddingTop: 6 }} />
      </div>

      {/* Dashed connector + note card */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
          <div style={dashedLine("#ABA6E3", { flex: 1, minHeight: 24 })} />
        </div>
        <div style={{
          flex: 1,
          borderRadius: getSize(14, 0.04),
          border: "1.5px solid rgba(255, 72, 11, 0.30)",
          padding: `${getSize(14, 0.04)}px ${getSize(16, 0.045)}px`,
          background: "#FFFAF8",
          fontSize: getSize(14, 0.04),
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
                  {note ? `“${note}”` : "—"}
                </span>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ color: "#6B7280", minWidth: 95, flexShrink: 0 }}>Note:</span>
              <span style={{ color: "#FF480B" }}>{`“${activityValue}”`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: resolution circle + pill (all users); action buttons (staff only when unresolved) */}
      {(userRole === 'staff' || effectiveResolution) && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          {effectiveResolution ? <ActivityCircle config={resConfig} /> : <EmptyCircle />}
          <div style={{ flex: 1 }}>
            {effectiveResolution ? (
              <PillBadge label={resConfig.label} bgColor={resConfig.pillColor} textColor={resConfig.pillTextColor} width="100%" />
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                {isTime ? (
                  <>
                    <button onClick={handleApprove} style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Approve</button>
                    <button onClick={handleReject} style={{ ...actionBtnStyle("transparent", "#FF480B", "#FF480B"), flex: 1 }}>Reject</button>
                  </>
                ) : (
                  <button onClick={() => setShowModal(true)} style={{ ...actionBtnStyle("#FF480B", "#fff"), flex: 1 }}>Send A Message</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resolution timestamp */}
      {effectiveResolution && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {!isLast && <DottedConnector color="#ABA6E3" height={28} />}
          <Timestamp prefix={resConfig.timestampPrefix} value={effectiveSentAt} style={{ paddingLeft: isLast ? 52 : 33, paddingTop: 6 }} />
        </div>
      )}

      {/* Tail connector to next activity */}
      {!isLast && !effectiveResolution && (
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <DottedConnector color="#ABA6E3" height={28} />
        </div>
      )}

      {/* Send message modal — rendered via portal to escape Framer Motion's stacking context */}
      {showModal && createPortal(
        <SendMessageModal
          role="staff"
          receiverID={booking?.userID}
          onClose={() => setShowModal(false)}
          onSent={handleSent}
        />,
        document.body
      )}
    </div>
  );
}

ActionActivity.propTypes = {
  config: PropTypes.object.isRequired,
  activity: PropTypes.array.isRequired,
  timestamp: PropTypes.string,
  isLast: PropTypes.bool,
  note: PropTypes.string,
  userRole: PropTypes.string,
  booking: PropTypes.object,
  dbResolution: PropTypes.shape({
    resolution: PropTypes.string,
    sentAt: PropTypes.string,
  }),
};

function ExtraTimeButton({ booking }) {
  const [status, setStatus] = useState('idle');

  const handleClick = async () => {
    setStatus('loading');
    try {
      const data = await apiCall('/booking/edit', 'PUT', { bookingID: booking.bookingID, timeRequest: true }, null);
      setStatus(data.conflict ? 'conflict' : 'sent');
      if (data.conflict) setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'sent')
    return <p style={{ textAlign: 'center', color: '#ABA6E3', fontFamily: FONT, fontSize: 13, marginTop: 12 }}>Request Sent ✓</p>;
  if (status === 'conflict')
    return <p style={{ textAlign: 'center', color: '#FF480B', fontFamily: FONT, fontSize: 13, marginTop: 12 }}>Can&apos;t request — another booking starts within 30 min</p>;
  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      style={{ ...actionBtnStyle('#ABA6E3', '#fff'), width: '100%', marginTop: 12, opacity: status === 'loading' ? 0.6 : 1 }}
    >
      {status === 'loading' ? 'Requesting…' : 'Request +30 Min'}
    </button>
  );
}

ExtraTimeButton.propTypes = { booking: PropTypes.object };

export default function BookingActivityFeed({ activities, booking, userRole = 'staff' }) {
  const processed = useMemo(() => {
    const result = [];
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      const [type, kind] = act;

      // Resolution entries are consumed by the preceding action — skip standalone rendering
      if (type === 'update' && (kind === 'messaged' || kind === 'approved' || kind === 'rejected')) continue;

      let dbResolution = null;
      if (type === 'action') {
        for (let j = i + 1; j < activities.length; j++) {
          const c = activities[j];
          if (c[0] !== 'update') continue;
          if (kind === 'note' && c[1] === 'messaged') {
            dbResolution = { resolution: 'messaged', sentAt: c[3] };
            break;
          }
          if (kind === 'time' && (c[1] === 'approved' || c[1] === 'rejected')) {
            dbResolution = { resolution: c[1], sentAt: c[3] };
            break;
          }
        }
      }
      result.push({ act, dbResolution });
    }
    return result.map((item, j, arr) => ({ ...item, isLast: j === arr.length - 1 }));
  }, [activities]);

  if (!processed.length) return (
    <p style={{ textAlign: "center", color: "#9CA3AF", fontFamily: FONT, marginTop: 48, fontSize: 14 }}>No Activity Found</p>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {processed.map(({ act, dbResolution, isLast }, i) => {
        const [activityType, activityKind, activityValue, timestamp] = act;
        const config = getActivityConfig(activityType, activityKind);
        const ts = timestamp ?? toDisplayTimestamp(booking.timestamp);

        if (activityType === "update") {
          return <UpdateActivity key={i} config={config} timestamp={ts} isLast={isLast} />;
        }

        const resolvedValue = activityKind === 'note' ? (booking.notes || activityValue) : activityValue;
        return (
          <ActionActivity
            key={i}
            config={config}
            activity={[activityKind, resolvedValue]}
            timestamp={ts}
            isLast={isLast}
            note={act[4] ?? null}
            userRole={userRole}
            booking={booking}
            dbResolution={dbResolution}
          />
        );
      })}
      {userRole !== 'staff' && booking?.status !== 'canceled' && !processed.some(({ act }) => act[0] === 'action' && act[1] === 'time') && (
        <ExtraTimeButton booking={booking} />
      )}
    </div>
  );
}

BookingActivityFeed.propTypes = {
  activities: PropTypes.array,
  booking: PropTypes.object,
  userRole: PropTypes.string,
};
