import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "/src/utils/general";

const FONT = "'Poppins', sans-serif";

function MessageBubble({ msg, currentUserID }) {
    const isMine = msg.senderID === currentUserID;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
            {/* Sender + timestamp header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: isMine ? "flex-end" : "flex-start",
            }}>
                <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isMine ? "#ABA6E3" : "#FF480B",
                    fontFamily: FONT,
                }}>
                    {isMine ? "You" : (msg.senderName || msg.senderID)}
                </span>
                <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: FONT }}>
                    {msg.timestamp}
                </span>
            </div>

            {/* Subject line — only shown on first message (no conversationID originally set) */}
            {msg.title && msg.title !== msg.message && (
                <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: FONT,
                    textAlign: isMine ? "right" : "left",
                    paddingLeft: isMine ? 0 : 2,
                    paddingRight: isMine ? 2 : 0,
                }}>
                    {msg.title}
                </div>
            )}

            {/* Message body card */}
            <div style={{
                borderRadius: 14,
                border: `1.5px solid ${isMine ? "rgba(171,166,227,0.4)" : "rgba(255,72,11,0.25)"}`,
                padding: "12px 16px",
                background: isMine ? "#F5F4FF" : "#FFFAF8",
                fontSize: 14,
                fontFamily: FONT,
                color: "#374151",
                lineHeight: 1.6,
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "90%",
            }}>
                {msg.message}
            </div>
        </div>
    );
}

export default function MessageThread({ notification, onReplySuccess }) {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);

    const conversationID = notification?.conversationID;

    useEffect(() => {
        if (!conversationID) return;
        setLoading(true);

        apiCall("/notification/getConversation", "POST", { conversationID }, null)
            .then(data => setMessages(data.messages || []))
            .catch(err => console.error("Failed to load conversation:", err))
            .finally(() => setLoading(false));

        // Mark the clicked notification as read
        if (notification?._id && !notification.isRead) {
            apiCall("/notification/markRead", "PATCH", { _id: notification._id, isRead: true }, null)
                .catch(() => {});
        }
    }, [conversationID]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !user || sending) return;

        setSending(true);

        // Determine receiver: if I'm staff, reply goes to the YA user; if I'm YA, reply goes to staff-inbox
        const permission = user.publicMetadata?.permission;
        const isStaff = permission === "2";

        // Find who we're replying to by looking at who sent messages we didn't
        const otherSenderID = messages.find(m => m.senderID !== user.username)?.senderID;
        const receiverID = isStaff ? (otherSenderID || "staff-inbox") : "staff-inbox";

        const optimisticMsg = {
            _id: `temp-${Date.now()}`,
            senderID: user.username,
            senderName: user.firstName || user.username,
            receiverID,
            conversationID,
            type: "MESSAGE",
            title: "Re: " + (messages[0]?.title || ""),
            message: replyText.trim(),
            timestamp: new Date().toLocaleString("en-US", {
                weekday: "long", month: "short", day: "2-digit",
                year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
            }),
            isRead: false,
            wasNotified: false,
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setReplyText("");

        try {
            await apiCall("/notification/create", "POST", {
                senderID: user.username,
                senderName: user.firstName || user.username,
                receiverID,
                conversationID,
                type: "MESSAGE",
                title: optimisticMsg.title,
                message: optimisticMsg.message,
            }, null);

            onReplySuccess?.();
        } catch (err) {
            console.error("Failed to send reply:", err);
            setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, color: "#9CA3AF", fontFamily: FONT }}>
                Loading…
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: FONT }}>
            {/* Subject header */}
            <div style={{ paddingBottom: 16, borderBottom: "1px solid #F3F4F6", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#262445", margin: 0 }}>
                    {messages[0]?.title || "Message Thread"}
                </h3>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>
                    {messages.length} message{messages.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Message list */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
                {messages.map(msg => (
                    <MessageBubble key={msg._id} msg={msg} currentUserID={user?.id} />
                ))}
                <div ref={bottomRef} />
            </div>

            {/* Reply box */}
            <form
                onSubmit={handleReply}
                style={{
                    marginTop: 16,
                    borderTop: "1px solid #F3F4F6",
                    paddingTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                    style={{
                        resize: "none",
                        height: 88,
                        borderRadius: 14,
                        border: "1.5px solid rgba(171,166,227,0.5)",
                        padding: "10px 14px",
                        fontSize: 14,
                        fontFamily: FONT,
                        color: "#374151",
                        outline: "none",
                        background: "#F5F4FF",
                    }}
                />
                <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    style={{
                        background: "#ABA6E3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 24px",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: FONT,
                        cursor: !replyText.trim() || sending ? "not-allowed" : "pointer",
                        opacity: !replyText.trim() || sending ? 0.5 : 1,
                        alignSelf: "flex-end",
                    }}
                >
                    {sending ? "Sending…" : "Reply"}
                </button>
            </form>
        </div>
    );
}
