import { useState } from "react";
import PropTypes from "prop-types";
import { apiCall } from '/src/utils/general.js';

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

function ActivityEntry({ entry, booking, isLast }) {
    const [timeStatus, setTimeStatus] = useState('idle');
    const [type, value, timestamp] = entry;
    const cfg = ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.modified;

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
            <div className="flex items-center gap-[3vw]">
                <div
                    className="shrink-0 rounded-full flex items-center justify-center"
                    style={{ width: '9vw', height: '9vw', backgroundColor: cfg.color, border: '2.5px solid #F0F7F2' }}
                >
                    {cfg.isAction ? (
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <rect x="7.5" y="3.5" width="3" height="7.5" rx="1.5" fill="#B9FF00" />
                            <circle cx="9" cy="14" r="1.5" fill="#B9FF00" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path d="M3.5 9.5L7 13L14.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
                <span
                    className="px-[3vw] py-[1.2vw] text-white text-[3.5vw] font-semibold rounded-full"
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
                        style={{ width: '4.5vw', borderLeft: `2px dashed ${cfg.color}`, opacity: 0.5, marginLeft: '4.5vw', minHeight: '8vw' }}
                    />
                )}
                <div className={`flex flex-col gap-[1.5vw] pb-[4vw] ${!isLast ? 'ml-[3vw]' : 'ml-[12.5vw]'}`}>
                    <span className="text-gray-400 text-[3vw]">{timestamp || value}</span>

                    {/* Note card */}
                    {type === 'note' && booking.notes && (
                        <div className="px-[3vw] py-[2vw] rounded-2xl text-[3.5vw] text-[#374151]"
                             style={{ border: '1.5px solid rgba(255,72,11,0.3)', background: '#FFFAF8' }}>
                            <span className="text-gray-400">Note: </span>
                            <span className="text-[#FF480B]">&ldquo;{booking.notes}&rdquo;</span>
                        </div>
                    )}

                    {/* Time request card */}
                    {type === 'time' && (
                        <div className="px-[3vw] py-[2vw] rounded-2xl text-[3.5vw]"
                             style={{ border: '1.5px solid rgba(255,72,11,0.3)', background: '#FFFAF8' }}>
                            <span className="text-gray-400">Requested: </span>
                            <span className="text-[#FF480B] font-semibold">{value}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Request +30 min button — only on the last entry for active confirmed bookings */}
            {isLast && type !== 'time' && booking.status === 'confirmed' && (
                <div className="mt-[2vw] mb-[2vw]">
                    {timeStatus === 'sent' && (
                        <p className="text-center text-[3.5vw] text-light-purple-subtle">Request Sent ✓</p>
                    )}
                    {timeStatus === 'conflict' && (
                        <p className="text-center text-[3.5vw] text-[#FF480B]">Can&apos;t request — another booking starts within 30 min</p>
                    )}
                    {(timeStatus === 'idle' || timeStatus === 'loading') && (
                        <button
                            onClick={handleTimeRequest}
                            disabled={timeStatus === 'loading'}
                            className="w-full py-[3vw] rounded-full text-[3.5vw] font-semibold text-white disabled:opacity-60"
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
};

export default function BookingActivityContent({ booking }) {
    const activities = booking.activity || [];

    if (!activities.length) {
        return (
            <div className="flex flex-col gap-[3vw]">
                <p className="text-gray-400 text-[3.5vw]">No recent activity.</p>
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
                />
            ))}
        </div>
    );
}

BookingActivityContent.propTypes = {
    booking: PropTypes.object.isRequired,
};
