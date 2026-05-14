import { useState } from "react";
import PropTypes from "prop-types";
import { apiCall } from '/src/utils/general.js';
import { ConfirmationPopup, FailurePopup } from '/src/components/popups/staff_booking/LandingStatusPopups';

const isMobile = () => window.innerWidth < 1025;

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const suffix =
        day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
        day === 3 || day === 23 ? 'rd' : 'th';
    return `${monthName} ${day}${suffix}, ${weekday}`;
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};

export default function BookingDetailsContent({ booking, isActive, onEdit, onCancel, forceDesktop = false }) {
    const [showPopup, setShowPopup] = useState(null);
    const [showNoteInput, setShowNoteInput] = useState(false);
    const [noteText, setNoteText] = useState(booking.notes || '');
    const [noteSent, setNoteSent] = useState(false);

    const mobile = !forceDesktop && isMobile();

    const s = mobile ? {
        container: "flex flex-col gap-[4vw] font-poppins",
        label: "text-[4vw] text-[#2F2F2F]",
        pill: "px-[3vw] py-[1vw] rounded-2xl bg-[#D6DFFF] text-[4vw] text-[#262445]",
        textarea: "px-[3vw] py-[2vw] rounded-3xl w-full h-[20vw] bg-[#D6DFFF] text-[#262445] text-[4vw] resize-none outline-none",
        noteCard: "px-[3vw] py-[2vw] bg-[#FFF8F0] border border-[#FFD6A5] text-dark-navy text-[3.5vw] rounded-2xl",
        primaryBtn: "flex-1 py-[3vw] bg-[#B27DED] text-[#F0F7F2] text-[4vw] rounded-2xl",
        outlineBtn: "flex-1 py-[3vw] border border-[#B27DED] text-[#B27DED] text-[4vw] rounded-2xl",
        editLink: "text-[3.5vw] text-gray-400",
        backLink: "text-dark-navy underline text-[3.5vw]",
    } : {
        container: "flex flex-col gap-4 font-poppins",
        label: "text-[22px] text-[#2F2F2F]",
        pill: "px-4 py-2 rounded-2xl bg-[#D6DFFF] text-[18px] text-[#262445]",
        textarea: "px-4 py-2 rounded-3xl w-full h-[80px] bg-[#D6DFFF] text-[#262445] text-[18px] resize-none outline-none",
        noteCard: "px-4 py-3 bg-[#FFF8F0] border border-[#FFD6A5] text-dark-navy text-[16px] rounded-2xl",
        primaryBtn: "flex-1 py-3 bg-[#B27DED] text-[#F0F7F2] text-[18px] rounded-2xl",
        outlineBtn: "flex-1 py-3 border border-[#B27DED] text-[#B27DED] text-[18px] rounded-2xl",
        editLink: "text-[16px] text-gray-400",
        backLink: "text-dark-navy underline text-[16px]",
    };

    const date = formatDate(booking.timestamp || booking.service_date);
    const startTime = formatTime(booking.duration?.startTime || booking.start_time);
    const endTime = formatTime(booking.duration?.endTime);

    const handleConfirmCancel = async () => {
        const bookingID = booking.bookingID || booking.id;
        try {
            await apiCall('/booking/edit', 'PUT', { bookingID, status: 'canceled' }, null);
            setShowPopup(null);
            onCancel();
        } catch (error) {
            console.error('Error canceling booking:', error);
            setShowPopup('failure');
        }
    };

    const handleSendNote = async () => {
        if (!noteText.trim()) return;
        const bookingID = booking.bookingID || booking.id;
        try {
            await apiCall('/booking/edit', 'PUT', { bookingID, notes: noteText.trim() }, null);
            setNoteSent(true);
            setShowNoteInput(false);
        } catch (error) {
            console.error('Error sending note:', error);
            setShowPopup('failure');
        }
    };

    return (
        <div className={s.container}>
            {/* Date */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Date</span>
                <span className={`w-fit ${s.pill}`}>{date}</span>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-[2vw]">
                <span className={s.label}>Time</span>
                <div className="flex items-center gap-[2vw]">
                    <span className={s.pill}>{startTime}</span>
                    {endTime && (
                        <>
                            <span className={`text-gray-400 ${mobile ? 'text-[3.5vw]' : 'font-medium'}`}>to</span>
                            <span className={s.pill}>{endTime}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Existing note */}
            {booking.notes && !showNoteInput && (
                <div className="flex flex-col gap-[2vw]">
                    <span className={s.label}>Your Note</span>
                    <p className={s.noteCard}>{booking.notes}</p>
                </div>
            )}

            {isActive && (
                <>
                    <p className={s.editLink}>
                        Need a different time?{' '}
                        <button onClick={onEdit} className={s.backLink}>
                            Edit booking
                        </button>
                    </p>

                    {showNoteInput ? (
                        <div className="flex flex-col gap-[2vw]">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Leave a note for staff..."
                                className={`opacity-40 focus:opacity-100 ${s.textarea}`}
                            />
                            <div className="flex gap-[3vw]">
                                <button onClick={() => setShowNoteInput(false)} className={s.outlineBtn}>
                                    Back
                                </button>
                                <button
                                    onClick={handleSendNote}
                                    disabled={!noteText.trim()}
                                    className={`${s.primaryBtn} disabled:opacity-40`}
                                >
                                    Send Note
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-[3vw]">
                            <button onClick={() => setShowPopup('confirm')} className={s.outlineBtn}>
                                Cancel Booking
                            </button>
                            <button
                                onClick={() => setShowNoteInput(true)}
                                className={`opacity-40 hover:opacity-100 ${s.primaryBtn}`}
                            >
                                {noteSent ? 'Note Sent ✓' : 'Send a Note'}
                            </button>
                        </div>
                    )}
                </>
            )}

            {showPopup === 'confirm' && (
                <ConfirmationPopup
                    onClose={() => setShowPopup(null)}
                    onConfirm={handleConfirmCancel}
                />
            )}
            {showPopup === 'failure' && (
                <FailurePopup onClose={() => setShowPopup(null)} />
            )}
        </div>
    );
}

BookingDetailsContent.propTypes = {
    booking: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    forceDesktop: PropTypes.bool,
};
