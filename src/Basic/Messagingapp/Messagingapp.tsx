import { useState, useRef, useEffect } from "react";
import "./Messagingapp.css"
const styles = `

`;

const EMOJIS = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🎉",
  "🔥",
  "✨",
  "💯",
  "😍",
  "🙏",
  "👋",
  "😎",
  "🤔",
  "💪",
  "🥳",
  "😅",
  "🫡",
  "🤝",
  "💼",
  "✅",
  "⭐",
  "📌",
  "🎯",
  "📎",
  "😇",
  "🥹",
  "😄",
];

const avatarColors = [
  "#3b5bdb",
  "#12b886",
  "#f03e3e",
  "#fab005",
  "#7950f2",
  "#e64980",
  "#1c7ed6",
  "#37b24d",
];

function Avatar({ name, size = "md", color }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bg = color || avatarColors[name.charCodeAt(0) % avatarColors.length];
  const sz =
    size === "lg" ? "initials-lg" : size === "sm" ? "initials-sm" : "initials";
  return (
    <div className={sz} style={{ background: bg, borderRadius: "50%" }}>
      {initials}
    </div>
  );
}

const initialContacts = [
  {
    id: 1,
    name: "Jan Mayer",
    role: "Recruiter at Nomad",
    online: true,
    time: "12 mins ago",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey Jake, I wanted to reach out because we saw your work contributions and were impressed by your work.",
        time: "12 mins ago",
      },
      {
        id: 2,
        from: "them",
        text: "We want to invite you for a quick interview",
        time: "12 mins ago",
      },
      {
        id: 3,
        from: "me",
        text: "Hi Jan, sure I would love to. Thanks for taking the time to see my work!",
        time: "12 mins ago",
      },
    ],
  },
  {
    id: 2,
    name: "Joe Bartmann",
    role: "HR at Divvy",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 3,
    name: "Ally Wales",
    role: "Designer at Figma",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 4,
    name: "James Gardner",
    role: "Engineer at Google",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 5,
    name: "Allison Geidt",
    role: "PM at Apple",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 6,
    name: "Ruben Culhane",
    role: "CTO at Stripe",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 7,
    name: "Lydia Diaz",
    role: "Recruiter at Notion",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 8,
    name: "James Dokidis",
    role: "Engineer at Meta",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
  {
    id: 9,
    name: "Angelina Swann",
    role: "Designer at Adobe",
    online: false,
    time: "3:40 PM",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Hey thanks for your interview...",
        time: "3:40 PM",
      },
    ],
  },
];
interface MessagingAppProps {
  setShowHeader: (value: boolean) => void;
}

export const MessagingApp: React.FC<MessagingAppProps> = ({
  setShowHeader,
}) => {
  useEffect(() => {
    setShowHeader(false);
    return () => setShowHeader(true);
  }, [setShowHeader]);
  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [starred, setStarred] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const active = contacts.find((c) => c.id === activeId);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, active?.messages?.length]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg = { id: Date.now(), from: "me", text, time: timeStr };
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], time: timeStr }
          : c,
      ),
    );
    setInput("");
    inputRef.current?.focus();
    setShowEmoji(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const lastPreview = (c) => {
    const last = c.messages[c.messages.length - 1];
    return (
      last?.text?.slice(0, 30) + (last?.text?.length > 30 ? "..." : "") || ""
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app" onClick={() => showEmoji && setShowEmoji(false)}>
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="search-wrap">
            <div className="search-box">
              <svg
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#8892a4"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                placeholder="Search messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="contacts">
            {filtered.map((c) => (
              <div
                key={c.id}
                className={`contact ${c.id === activeId ? "active" : ""}`}
                onClick={() => setActiveId(c.id)}
              >
                <div className="contact-avatar">
                  <Avatar name={c.name} />
                  {c.online && <div className="online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-top">
                    <span className="contact-name">{c.name}</span>
                    <span className="contact-time">{c.time}</span>
                  </div>
                  <div className="contact-preview">{lastPreview(c)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT PANEL */}
        {active ? (
          <div className="chat">
            {/* Header */}
            <div className="chat-header">
              <Avatar name={active.name} />
              <div className="chat-header-info">
                <div className="chat-header-name">{active.name}</div>
                <div className="chat-header-role">{active.role}</div>
              </div>
              <div className="header-actions">
                <button className="icon-btn" title="Pin">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
                <button
                  className={`icon-btn ${starred[active.id] ? "starred" : ""}`}
                  onClick={() =>
                    setStarred((s) => ({ ...s, [active.id]: !s[active.id] }))
                  }
                  title="Star"
                >
                  ★
                </button>
                <button className="icon-btn" title="More">
                  ⋯
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
              <div className="chat-intro">
                <div className="intro-avatar">
                  <Avatar name={active.name} size="lg" />
                </div>
                <div className="intro-name">{active.name}</div>
                <div className="intro-role">
                  {active.role.split(" at ")[0]} at{" "}
                  <span>{active.role.split(" at ")[1]}</span>
                </div>
                <div className="intro-desc">
                  This is the very beginning of your direct message with{" "}
                  <b>{active.name}</b>
                </div>
              </div>

              <div className="day-divider">
                <div className="day-pill">
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  Today
                </div>
              </div>

              {/* Group messages by sender */}
              {active.messages.reduce((acc, msg, i) => {
                const prev = active.messages[i - 1];
                const isFirst = !prev || prev.from !== msg.from;
                const isLast =
                  !active.messages[i + 1] ||
                  active.messages[i + 1].from !== msg.from;
                const isOut = msg.from === "me";

                acc.push(
                  <div
                    key={msg.id}
                    className={`msg-row ${isOut ? "outgoing" : ""}`}
                  >
                    {!isOut &&
                      (isLast ? (
                        <div className="msg-avatar">
                          <Avatar name={active.name} size="sm" />
                        </div>
                      ) : (
                        <div className="msg-avatar-placeholder" />
                      ))}
                    <div
                      className={`bubble ${isOut ? "outgoing" : "incoming"}`}
                    >
                      {msg.text}
                    </div>
                    {isOut &&
                      (isLast ? (
                        <div className="msg-avatar">
                          <Avatar name="Jake You" size="sm" color="#495057" />
                        </div>
                      ) : (
                        <div className="msg-avatar-placeholder" />
                      ))}
                  </div>,
                );

                if (isLast) {
                  acc.push(
                    <div
                      key={`meta-${msg.id}`}
                      className={`msg-meta`}
                      style={{
                        textAlign: isOut ? "right" : "left",
                        paddingLeft: isOut ? 0 : "44px",
                      }}
                    >
                      {isOut
                        ? `You · ${msg.time}`
                        : `${active.name.split(" ")[0]} · ${msg.time}`}
                    </div>,
                  );
                }
                return acc;
              }, [])}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-bar" style={{ position: "relative" }}>
              <button className="attach-btn" title="Attach file">
                📎
              </button>
              <input
                ref={inputRef}
                className="msg-input"
                placeholder="Reply message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="emoji-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmoji((s) => !s);
                }}
                title="Emoji"
              >
                😊
              </button>
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim()}
                title="Send"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>

              {showEmoji && (
                <div
                  className="emoji-picker"
                  onClick={(e) => e.stopPropagation()}
                >
                  {EMOJIS.map((e) => (
                    <button key={e} onClick={() => addEmoji(e)}>
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="chat">
            <div className="chat-placeholder">
              <div className="icon">💬</div>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
