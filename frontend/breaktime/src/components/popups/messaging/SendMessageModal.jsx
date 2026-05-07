import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "/src/utils/general";

export default function SendMessageModal({ role, onClose, onSent }) {
    const { user } = useUser();
    const [yaUsers, setYaUsers] = useState([]);
    const [selectedYaUsername, setSelectedYaUsername] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (role === "staff") {
            apiCall("/user/getAll", "GET", null, null)
                .then(data => setYaUsers(data.users || []))
                .catch(() => setError("Failed to load YA users."));
        }
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;
        if (role === "staff" && !selectedYaUsername) return;

        setSending(true);
        setError("");

        const receiverID = role === "staff" ? selectedYaUsername : "staff-inbox";

        try {
            await apiCall("/notification/create", "POST", {
                senderID: user.username,
                senderName: user.firstName || user.username,
                receiverID,
                type: "MESSAGE",
                title: subject.trim(),
                message: body.trim(),
            }, null);

            onSent?.();
            onClose();
        } catch {
            setError("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const isInvalid = !subject.trim() || !body.trim() || (role === "staff" && !selectedYaUsername) || sending;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="w-[334px] bg-[#f7fbfd] shadow-xl rounded-3xl p-5 flex flex-col gap-3 font-all"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-bold text-[#262445]">
                        {role === "staff" ? "New Message" : "Message Staff"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Recipient */}
                    {role === "staff" ? (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">To</label>
                            <select
                                className="bg-[#ABB9FF] rounded-2xl px-3 py-2 text-[#273991] font-medium outline-none appearance-none cursor-pointer"
                                value={selectedYaUsername}
                                onChange={e => setSelectedYaUsername(e.target.value)}
                                required
                            >
                                <option value="">Select a YA user…</option>
                                {yaUsers.map(u => (
                                    <option key={u.id} value={u.username}>{u.username}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">To</label>
                            <div className="bg-[#ABB9FF] rounded-2xl px-3 py-2 text-[#273991] font-medium opacity-70">
                                Staff
                            </div>
                        </div>
                    )}

                    {/* Subject */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Subject</label>
                        <input
                            type="text"
                            className="bg-[#ABB9FF] rounded-2xl px-3 py-2 text-[#273991] font-medium outline-none placeholder:text-[#262445]/50"
                            placeholder="Subject…"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Message</label>
                        <textarea
                            className="bg-[#ABB9FF] rounded-2xl px-3 py-2 text-[#273991] font-medium outline-none resize-none h-[100px] placeholder:text-[#262445]/50"
                            placeholder="Type your message…"
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 mt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-[40px] bg-[#ABB9FF] text-[#F0F7F2] rounded-2xl font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isInvalid}
                            className="flex-1 h-[40px] bg-[#ABB9FF] text-[#F0F7F2] rounded-2xl font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
