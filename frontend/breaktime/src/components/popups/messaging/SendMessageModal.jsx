import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "/src/utils/general";

export default function SendMessageModal({ role, onClose, onSent, receiverID }) {
    const { user } = useUser();
    const [yaUsers, setYaUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (role === "staff" && !receiverID) {
            apiCall("/user/getAll", "GET", null, null)
                .then(data => setYaUsers(data.users || []))
                .catch(() => setError("Failed to load YA users."));
        }
    }, [role, receiverID]);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const namedUsers = yaUsers.filter(u => u.firstName);
    const filteredUsers = namedUsers
        .filter(u => !selectedUsers.find(s => s.username === u.username))
        .filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));

    const addUser = (u) => {
        setSelectedUsers(prev => [...prev, u]);
        setSearchQuery("");
        setShowDropdown(false);
    };

    const removeUser = (username) => {
        setSelectedUsers(prev => prev.filter(u => u.username !== username));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;

        const receivers = receiverID
            ? [receiverID]
            : role === "staff"
                ? selectedUsers.map(u => u.username)
                : ["staff-inbox"];

        if (role === "staff" && !receiverID && receivers.length === 0) return;

        setSending(true);
        setError("");

        try {
            await Promise.all(receivers.map(rid =>
                apiCall("/notification/create", "POST", {
                    senderID: user.username,
                    senderName: user.firstName || user.username,
                    receiverID: rid,
                    type: "MESSAGE",
                    title: subject.trim(),
                    message: body.trim(),
                }, null)
            ));
            onSent?.();
            onClose();
        } catch {
            setError("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const isInvalid = !subject.trim() || !body.trim() ||
        (role === "staff" && !receiverID && selectedUsers.length === 0) ||
        sending;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-60 p-4"
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="w-[90vw] max-w-[334px] bg-[#f7fbfd] shadow-xl rounded-3xl p-[4vw] lg:p-5 flex flex-col gap-[2.5vw] lg:gap-3 font-all"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-[4.5vw] lg:text-lg font-bold text-[#262445]">
                        {role === "staff" ? "New Message" : "Message Staff"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-[5vw] lg:text-xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-[2.5vw] lg:gap-3">
                    {/* Recipient */}
                    {role === "staff" ? (
                        <div className="flex flex-col gap-1">
                            <label className="text-[3vw] lg:text-xs font-semibold text-[#6B7280] uppercase tracking-wide">To</label>
                            {receiverID ? (
                                <div className="bg-light-purple rounded-2xl px-[3vw] lg:px-3 py-[2vw] lg:py-2 text-[3.5vw] lg:text-sm text-[#273991] font-medium opacity-70">
                                    {receiverID}
                                </div>
                            ) : (
                                <div className="relative" ref={searchRef}>
                                    {/* Selected user chips */}
                                    {selectedUsers.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                            {selectedUsers.map(u => (
                                                <span key={u.username} className="flex items-center gap-1 bg-dark-purple text-white text-[3vw] lg:text-xs px-2 py-0.5 rounded-full">
                                                    {`${u.firstName} ${u.lastName}`.trim()}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeUser(u.username)}
                                                        className="leading-none hover:text-red-300 cursor-pointer"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {/* Search input */}
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                                        onFocus={() => { setShowDropdown(true); setSearchFocused(true); }}
                                        onBlur={() => setSearchFocused(false)}
                                        placeholder={selectedUsers.length === 0 ? "Search by name…" : "Add another…"}
                                        className="w-full border-2 border-bright-purple rounded-2xl px-[3vw] lg:px-3 py-[2vw] lg:py-1.5 text-[3.5vw] lg:text-sm text-dark-navy font-medium outline-none placeholder:text-dark-navy/40 bg-transparent"
                                        style={{ backgroundImage: `linear-gradient(to right, ${searchFocused ? '#B9FF00' : 'white'} 100%, transparent 0)` }}
                                    />
                                    {/* Dropdown results */}
                                    {showDropdown && filteredUsers.length > 0 && (
                                        <ul className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-2xl shadow-lg max-h-40 overflow-y-auto">
                                            {filteredUsers.map(u => (
                                                <li
                                                    key={u.id}
                                                    onMouseDown={() => addUser(u)}
                                                    className="px-3 py-2 text-[3.5vw] lg:text-sm text-dark-navy cursor-pointer hover:bg-light-purple/30 first:rounded-t-2xl last:rounded-b-2xl"
                                                >
                                                    {`${u.firstName} ${u.lastName}`.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-[3vw] lg:text-xs font-semibold text-[#6B7280] uppercase tracking-wide">To</label>
                            <div className="bg-light-purple rounded-2xl px-[3vw] lg:px-3 py-[2vw] lg:py-2 text-[3.5vw] lg:text-sm text-[#273991] font-medium opacity-70">
                                Staff
                            </div>
                        </div>
                    )}

                    {/* Subject */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[3vw] lg:text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Subject</label>
                        <input
                            type="text"
                            className="bg-light-purple rounded-2xl px-[3vw] lg:px-3 py-[2vw] lg:py-2 text-[3.5vw] lg:text-sm text-[#273991] font-medium outline-none placeholder:text-[#262445]/50"
                            placeholder="Subject…"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[3vw] lg:text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Message</label>
                        <textarea
                            className="bg-light-purple rounded-2xl px-[3vw] lg:px-3 py-[2vw] lg:py-2 text-[3.5vw] lg:text-sm text-[#273991] font-medium outline-none resize-none h-[25vw] lg:h-[100px] placeholder:text-[#262445]/50"
                            placeholder="Type your message…"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {/* Buttons */}
                    <div className="flex gap-[2vw] lg:gap-3 mt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-[10vw] lg:h-10 bg-light-purple text-[#F0F7F2] text-[3.5vw] lg:text-sm rounded-2xl font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isInvalid}
                            className="flex-1 h-[10vw] lg:h-10 bg-light-purple text-[#F0F7F2] text-[3.5vw] lg:text-sm rounded-2xl font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {sending ? "Sending…" : "Send"}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .font-all { font-family: 'Poppins', sans-serif; }
            `}</style>
        </div>
    );
}

SendMessageModal.propTypes = {
    role: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSent: PropTypes.func,
    receiverID: PropTypes.string,
};
