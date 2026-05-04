import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SupportDashboard.module.css';

const SupportDashboard: React.FC = () => {
  const { apiFetch, user: authUser } = useJobitoAuth();
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const fetchTickets = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/support/tickets`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [apiFetch]);

  const fetchTicketMessages = async (id: number) => {
    setSelectedId(id);
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/support/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedId) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/support/tickets/${selectedId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply })
      });
      if (res.ok) {
        setReply("");
        fetchTicketMessages(selectedId);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedId) return;
    if (!window.confirm("Are you sure you want to close this ticket?")) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/support/tickets/${selectedId}/close`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchTicketMessages(selectedId);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.root} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerShine} />
        <div className={styles.headerGlow} />
        <div className={styles.headerLeft}>
          <p className={styles.headerTitle}>{t("Hello,")} {authUser?.name || 'Admin'}</p>
          <p className={styles.headerSub}>{t("Following Is Your Organization's Performance Summary")}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.iconBtn} onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </div>
          <div className={styles.iconBtn}>🔔</div>
          <div className={styles.userPill}>
            <div className={styles.avatarCircle}>{authUser?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <div className={styles.avatarName}>{authUser?.name || 'Admin'}</div>
              <div className={styles.avatarEmail}>{authUser?.email || ''}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.tabsRow}>
          {/* Tabs removed to use global Admin navigation */}
        </div>
        <button className={styles.sysBtn}>{t("System request")}</button>
      </nav>

      {/* Body */}
      <div className={styles.body}>
        {/* Left */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>{t("Name")}</div>
          <div className={styles.ticketList}>
            {tickets.map((t) => (
              <div 
                key={t.ticketId} 
                className={`${styles.ticketItem} ${selectedId === t.ticketId ? styles.activeTicket : ''} ${t.status === 'open' ? styles.unreadTicket : ''}`}
                onClick={() => fetchTicketMessages(t.ticketId)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div className={styles.ticketTitle}>{t.userName}</div>
                  {t.status === 'open' && <div style={{ width: 8, height: 8, borderRadius: "50%", background: 'var(--color-accent)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>
                  {t.subject}
                </div>
                <div className={styles.ticketMeta}>
                  <span>{t.userEmail}</span>
                  <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className={styles.rightPanel}>
          {!selectedTicket ? (
            <div className={styles.emptyState}>
              <div style={{ fontSize: 48 }}>💬</div>
              <div className={styles.chatTitle}>{t("Select A Conversation To View Details")}</div>
            </div>
          ) : (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatAvatar}>{selectedTicket.ticket.userName?.split(" ")?.map((n: string) => n[0])?.join("") || 'U'}</div>
                <div>
                  <div className={styles.chatTitle}>{selectedTicket.ticket.userName}</div>
                  <div className={styles.chatSub}>{selectedTicket.ticket.userEmail}</div>
                </div>
                <div className={styles.chatBadge}>{t(selectedTicket.ticket.status)}</div>
                {selectedTicket.ticket.status !== 'closed' && (
                  <button 
                    onClick={handleCloseTicket}
                    className={`${styles.sysBtn} ${styles.closeTicketBtn}`}
                  >
                    {t("Close Ticket")}
                  </button>
                )}
              </div>

              <div className={styles.messages}>
                {selectedTicket.messages?.map((m: any, i: number) => {
                  const isUser = m.senderType === "user";
                  return (
                    <div key={i} className={`${styles.messageRow} ${isUser ? styles.messageLeft : styles.messageRight}`}>
                      <div className={`${styles.bubble} ${isUser ? styles.bubbleLeft : styles.bubbleRight}`}>
                        {m.content}
                      </div>
                      <div className={styles.msgTime} style={{ textAlign: isUser ? "left" : "right" }}>
                        {new Date(m.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)', cursor: "pointer" }}>🔗</span>
                  <input className={styles.inputEl} placeholder={t("Reply message")} value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} />
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)', cursor: "pointer" }}>😊</span>
                </div>
                <button className={styles.sendBtn} onClick={handleSendReply}>➤</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
