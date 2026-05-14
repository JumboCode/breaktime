import { useState } from "react";
import PropTypes from "prop-types";
import { apiCall } from '/src/utils/general.js';

const isMobile = () => window.innerWidth < 1025;

const ACTIVITY_CONFIG = {
    created:  { label: 'Booking Created',       color: '#ABA6E3', isAction: false },
    modified: { label: 'Booking Modified',      color: '#ABA6E3', isAction: false },
    canceled: { label: 'Booking Canceled',      color: '#ABA6E3', isAction: false },
    approved: { label: 'Extra Time Approved',   color: '#ABA6E3', isAction: false },
    rejected: { label: 'Extra Time Rejected',   color: '#ABA6E3', isAction: false },
    messaged: { label: 'Staff Replied',         color: '#ABA6E3', isAction: false },
    note:     { label: 'Left A Note',           color: '#FF480B', isAction: true  },
    time:     { label: 'Requested Extra Time',  color: '#FF480B', isAction: true  },
};

function ActivityEntry({ entry, booking, isLast, mobile }) {
    const [timeStatus, setTimeStatus] = useState('idle');
    const [type, value, timestamp] = entry;
    const cfg = ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.modified;

    const s = mobile ? {
        gap: 'gap-[3vw]',
        circleSize: '9vw',
        iconSize: '4.5vw',
        pill: 'px-[3vw] py-[1.2vw] text-[3.5vw]',
        connectorWidth: '4.5vw',
        connectorMargin: '4.5vw',
        connectorMinH: '8vw',
        detailGap: 'gap-[1.5vw]',
        detailPb: 'pb-[4vw]',
        detailMlConn: 'ml-[3vw]',
        detailMlNoConn: 'ml-[12.5vw]',
        timestamp: 'text-[3vw]',
        card: 'px-[3vw] py-[2vw] text-[3.5vw]',
        timeBtn: 'py-[3vw] text-[3.5vw]',
        timeFeedback: 'text-[3.5vw]',
        mt: 'mt-[2vw] mb-[2vw]',
    } : {
        gap: 'gap-3',
        circleSize: '36px',
        iconSize: '18px',
        pill: 'px-3 py-1 text-sm',
        connectorWidth: '18px',
        connectorMargin: '18px',
        connectorMinH: '32px',
        detailGap: 'gap-1.5',
        detailPb: 'pb-4',
        detailMlConn: 'ml-3',
        detailMlNoConn: 'ml-12',
        timestamp: 'text-xs',
        card: 'px-3 py-2 text-sm',
        timeBtn: 'py-2 text-sm',
        timeFeedback: 'text-sm',
        mt: 'mt-2 mb-2',
    };

    const handleTimeRequest = async () => {
        setTimeStatus('loading');
        try {
            const data = await apiCall('/booking/edit', 'PUT', { bookingID: booking.bookingID, timeRequest: true }, null);
            setTimeStatus(data.conflict ? 'conflict' : 'sent');
            if (data.conflict) setTimeout(() => setTimeStatus('idle'), 4000);
        } catch {
            setTimeStatus('idle');
        }
    };

    return (
        <div className="flex flex-col">
            {/* Circle + pill row */}
            <div className={`flex items-center ${s.gap}`}>
                <div
                    className="shrink-0 rounded-full flex items-center justify-center"
                    style={{ width: s.circleSize, height: s.circleSize, backgroundColor: cfg.color, border: '2.5px solid #F0F7F2' }}
                >
                    {cfg.isAction ? (
                        <svg style={{ width: s.iconSize, height: s.iconSize }} viewBox="0 0 18 18" fill="none">
                            <rect x="7.5" y="3.5" width="3" height="7.5" rx="1.5" fill="#B9FF00" />
                            <circle cx="9" cy="14" r="1.5" fill="#B9FF00" />
                        </svg>
                    ) : (
                        <svg style={{ width: s.iconSize, height: s.iconSize }} viewBox="0 0 18 18" fill="none">
                            <path d="M3.5 9.5L7 13L14.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <span
                    className={`${s.pill} text-white font-semibold rounded-full`}
                    style={{ backgroundColor: cfg.color }}
                >
                    {cfg.label}
                </span>
            </div>

            {/* Connector + timestamp/detail */}
            <div className="flex">
                {!isLast && (
                    <div
                        className="shrink-0"
                        style={{ width: s.connectorWidth, borderLeft: `2px dashed ${cfg.color}`, opacity: 0.5, marginLeft: s.connectorMargin, minHeight: s.connectorMinH }}
                    />
                )}
                <div className={`flex flex-col ${s.detailGap} ${s.detailPb} ${!isLast ? s.detailMlConn : s.detailMlNoConn}`}>
                    <span className={`text-gray-400 ${s.timestamp}`}>{timestamp || value}</span>

                    {/* Note card */}
                    {type === 'note' && booking.notes && (
                        <div className={`${s.card} rounded-2xl text-[#374151]`}
                             style={{ border: '1.5px solid rgba(255,72,11,0.3)', background: '#FFFAF8' }}>
                            <span className="text-gray-400">Note: </span>
                            <span className="text-[#FF480B]">&ldquo;{booking.notes}&rdquo;</span>
                        </div>
                    )}

                    {/* Time request card */}
                    {type === 'time' && (
                        <div className={`${s.card} rounded-2xl`}
                             style={{ border: '1.5px solid rgba(255,72,11,0.3)', background: '#FFFAF8' }}>
                            <span className="text-gray-400">Requested: </span>
                            <span className="text-[#FF480B] font-semibold">{value}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Request +30 min button — only on the last entry for active confirmed bookings with no prior time request */}
            {isLast && type !== 'time' && booking.status === 'confirmed' && !booking.activity?.some(a => a[0] === 'time') && (
                <div className={s.mt}>
                    {timeStatus === 'sent' && (
                        <p className={`text-center ${s.timeFeedback} text-light-purple-subtle`}>Request Sent ✓</p>
                    )}
                    {timeStatus === 'conflict' && (
                        <p className={`text-center ${s.timeFeedback} text-[#FF480B]`}>Can&apos;t request — another booking starts within 30 min</p>
                    )}
                    {(timeStatus === 'idle' || timeStatus === 'loading') && (
                        <button
                            onClick={handleTimeRequest}
                            disabled={timeStatus === 'loading'}
                            className={`w-full ${s.timeBtn} rounded-full font-semibold text-white disabled:opacity-60`}
                            style={{ backgroundColor: '#ABA6E3' }}
                        >
                            {timeStatus === 'loading' ? 'Requesting…' : 'Request +30 Min'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

ActivityEntry.propTypes = {
    entry: PropTypes.array.isRequired,
    booking: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    mobile: PropTypes.bool,
};

export default function BookingActivityContent({ booking, forceDesktop = false }) {
    const activities = booking.activity || [];
    const mobile = !forceDesktop && isMobile();

    if (!activities.length) {
        return (
            <div className={`flex flex-col ${mobile ? 'gap-[3vw]' : 'gap-3'}`}>
                <p className={`text-gray-400 ${mobile ? 'text-[3.5vw]' : 'text-sm'}`}>No recent activity.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col font-poppins">
            {activities.map((entry, i) => (
                <ActivityEntry
                    key={i}
                    entry={entry}
                    booking={booking}
                    isLast={i === activities.length - 1}
                    mobile={mobile}
                />
            ))}
        </div>
    );
}

BookingActivityContent.propTypes = {
    booking: PropTypes.object.isRequired,
    forceDesktop: PropTypes.bool,
};
