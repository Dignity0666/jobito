import { useState, useRef, useEffect } from "react";
import styles from "./Messagingapp.module.css";
import { useJobitoAuth } from "../../context/AuthContext";

const EMOJIS = [
  "😊", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯", "😍", "🙏",
  "👋", "😎", "🤔", "💪", "🥳", "😅", "🫡", "🤝", "💼", "✅",
  "⭐", "📌", "🎯", "📎", "😇", "🥹", "😄",
];

const avatarColors = [
  "#3b5bdb", "#12b886", "#f03e3e", "#fab005", "#7950f2", "#e64980", "#1c7ed6", "#37b24d",
];

function Avatar({ name, size = "md", color = "" }: { name: string; size?: string; color?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bg = color || avatarColors[name.charCodeAt(0) % avatarColors.length];
  const sz =
    size === "lg"
      ? styles.initialsLg
      : size === "sm"
        ? styles.initialsSm
        : styles.initials;
  return (
    <div className={sz} style={{ background: bg }}>
      {initials}
    </div>
  );
}

const initialContacts = [
  {
    id: 1,
    name: "جان ماير",
    role: "مسؤول توظيف في نوماد",
    online: true,
    time: "منذ 12 دقيقة",
    messages: [
      {
        id: 1,
        from: "them",
        text: "مرحباً جيك، أردت التواصل معك لأننا رأينا مساهماتك في العمل وكنا معجبين جداً بما قدمته.",
        time: "منذ 12 دقيقة",
      },
      {
        id: 2,
        from: "them",
        text: "نريد دعوتك لإجراء مقابلة سريعة.",
        time: "منذ 12 دقيقة",
      },
      {
        id: 3,
        from: "me",
        text: "أهلاً جان، بالتأكيد يسعدني ذلك. شكراً لك على وقتك لرؤية أعمالي!",
        time: "منذ 12 دقيقة",
      },
    ],
  },
  {
    id: 2,
    name: "جو بارتمان",
    role: "الموارد البشرية في ديفي",
    online: false,
    time: "3:40 م",
    messages: [
      {
        id: 1,
        from: "them",
        text: "مرحباً، شكراً لك على المقابلة...",
        time: "3:40 م",
      },
    ],
  },
  {
    id: 3,
    name: "آلي ويلز",
    role: "مصممة في فيجما",
    online: false,
    time: "3:40 م",
    messages: [
      {
        id: 1,
        from: "them",
        text: "مرحباً، شكراً لك على المقابلة...",
        time: "3:40 م",
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
  const { user } = useJobitoAuth();
  useEffect(() => {
    setShowHeader(false);
    return () => setShowHeader(true);
  }, [setShowHeader]);

  const [contacts, setContacts] = useState(initialContacts);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [starred, setStarred] = useState<{ [key: number]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setContacts((prev: any) =>
      prev.map((c: any) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], time: timeStr }
          : c,
      ),
    );
    setInput("");
    inputRef.current?.focus();
    setShowEmoji(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const lastPreview = (c: { messages: { text: string }[] }) => {
    const last = c.messages[c.messages.length - 1];
    return (
      last?.text?.slice(0, 30) + (last?.text?.length > 30 ? "..." : "") || ""
    );
  };

  return (
    <div
      className={styles.app}
      style={{ direction: "rtl" }}
      onClick={() => showEmoji && setShowEmoji(false)}
    >
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
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
              placeholder="البحث في الرسائل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.contacts}>
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`${styles.contact} ${c.id === activeId ? styles.contactActive : ""}`}
              onClick={() => setActiveId(c.id)}
            >
              <div className={styles.contactAvatar}>
                <Avatar name={c.name} />
                {c.online && <div className={styles.onlineDot} />}
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactTop}>
                  <span className={styles.contactName}>{c.name}</span>
                  <span className={styles.contactTime}>{c.time}</span>
                </div>
                <div className={styles.contactPreview}>{lastPreview(c)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT PANEL */}
      {active ? (
        <div className={styles.chat}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <Avatar name={active.name} />
            <div className={styles.chatHeaderInfo}>
              <div className={styles.chatHeaderName}>{active.name}</div>
              <div className={styles.chatHeaderRole}>{active.role}</div>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.iconBtn} title="تثبيت">
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
                className={`${styles.iconBtn} ${starred[active.id] ? styles.starred : ""}`}
                onClick={() =>
                  setStarred((s) => ({ ...s, [active.id]: !s[active.id] }))
                }
                title="تميز"
              >
                ★
              </button>
              <button className={styles.iconBtn} title="المزيد">
                ⋯
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea}>
            <div className={styles.chatIntro}>
              <div className={styles.introAvatar}>
                <Avatar name={active.name} size="lg" />
              </div>
              <div className={styles.introName}>{active.name}</div>
              <div className={styles.introRole}>
                {active.role}
              </div>
              <div className={styles.introDesc}>
                هذه بداية محادثتك مع <b>{active.name}</b>
              </div>
            </div>

            <div className={styles.dayDivider}>
              <div className={styles.dayPill}>
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
                اليوم
              </div>
            </div>

            {active.messages.reduce((acc: React.ReactNode[], msg, i) => {
              const isLast =
                !active.messages[i + 1] ||
                active.messages[i + 1].from !== msg.from;
              const isOut = msg.from === "me";

              acc.push(
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${isOut ? styles.outgoing : ""}`}
                >
                  {!isOut &&
                    (isLast ? (
                      <div className={styles.msgAvatar}>
                        <Avatar name={active.name} size="sm" />
                      </div>
                    ) : (
                      <div className={styles.msgAvatarPlaceholder} />
                    ))}
                  <div
                    className={`${styles.bubble} ${isOut ? styles.outgoingBubble : styles.incomingBubble}`}
                  >
                    {msg.text}
                  </div>
                  {isOut &&
                    (isLast ? (
                      <div className={styles.msgAvatar}>
                        <Avatar name={user?.name || "أنت"} size="sm" color="#495057" />
                      </div>
                    ) : (
                      <div className={styles.msgAvatarPlaceholder} />
                    ))}
                </div>,
              );

              if (isLast) {
                acc.push(
                  <div
                    key={`meta-${msg.id}`}
                    className={styles.msgMeta}
                    style={{
                      textAlign: isOut ? "left" : "right",
                      paddingRight: isOut ? 0 : "44px",
                    }}
                  >
                    {isOut
                      ? `أنت · ${msg.time}`
                      : `${active.name.split(" ")[0]} · ${msg.time}`}
                  </div>,
                );
              }
              return acc;
            }, [])}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputBar} style={{ position: "relative" }}>
            <button className={styles.attachBtn} title="إرفاق ملف">
              📎
            </button>
            <input
              ref={inputRef}
              className={styles.msgInput}
              placeholder="اكتب رداً..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className={styles.emojiBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowEmoji((s) => !s);
              }}
              title="إيموجي"
            >
              😊
            </button>
            <button
              className={styles.sendBtn}
              onClick={sendMessage}
              disabled={!input.trim()}
              title="إرسال"
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
                className={styles.emojiPicker}
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
        <div className={styles.chat}>
          <div className={styles.chatPlaceholder}>
            <div className={styles.icon}>💬</div>
            <p>اختر محادثة للبدء</p>
          </div>
        </div>
      )}
    </div>
  );
};
