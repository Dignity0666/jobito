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
  const [sidebarTab, setSidebarTab] = useState<'tickets' | 'admins'>('admins');
  const [reply, setReply] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

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

  const fetchAdmins = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/staff`);
      if (res.ok) {
        const data = await res.json();
        setAdmins(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (sidebarTab === 'tickets') fetchTickets();
    else fetchAdmins();
  }, [apiFetch, sidebarTab, language]);

  const fetchChatHistory = async (otherId: string) => {
    setSelectedId(otherId as any);
    try {
      const res = await apiFetch(`${API_BASE_URL}/chat/p2p/history?userId=${authUser?.id}&otherId=${otherId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket({
          ticket: { userName: selectedAdmin?.fullName, userEmail: selectedAdmin?.email },
          messages: data || []
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedAdmin) {
      fetchChatHistory(selectedAdmin.adminId);
    }
  }, [selectedAdmin]);

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedAdmin) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/chat/p2p`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderId: authUser?.id,
          recipientId: selectedAdmin.adminId,
          content: reply 
        })
      });
      if (res.ok) {
        setReply("");
        fetchChatHistory(selectedAdmin.adminId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedId) return;
    if (!window.confirm(t("Are you sure you want to close this ticket?"))) return;
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

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.tabsRow}>
          {/* Tabs removed to use global Admin navigation */}
        </div>
        {authUser?.adminRole === 'super_admin' && (
          <button className={styles.sysBtn}>{t("System request")}</button>
        )}
      </nav>

      {/* Body */}
      <div className={styles.body}>
        {/* Sidebar */}
        <div className={styles.leftPanel}>

          <div className={styles.ticketList}>
            {admins.filter(a => a.adminId !== authUser?.id).map((adm) => (
              <div 
                key={adm.adminId} 
                className={`${styles.ticketItem} ${selectedAdmin?.adminId === adm.adminId ? styles.activeTicket : ''}`}
                onClick={() => {
                  setSelectedAdmin(adm);
                  // fetchChatHistory will be triggered by useEffect
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={styles.adminAvatarSmall}>{adm.fullName[0]}</div>
                  <div>
                    <div className={styles.ticketTitle}>{adm.fullName}</div>
                    <div className={styles.adminRoleLabel}>{t(adm.role)}</div>
                  </div>
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

              </div>
              <div className={styles.messages}>
                {selectedTicket.messages?.map((m: any, i: number) => {
                  const isMe = m.senderId === authUser?.id;
                  return (
                    <div key={i} className={`${styles.messageRow} ${!isMe ? styles.messageLeft : styles.messageRight}`}>
                      <div className={`${styles.bubble} ${!isMe ? styles.bubbleLeft : styles.bubbleRight}`}>
                        {m.message}
                      </div>
                      <div className={styles.msgTime} style={{ textAlign: !isMe ? "left" : "right" }}>
                        {new Date(m.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-GB')}
                      </div>
                    </div>
                  );
                })}
              </div>


              <div className={styles.inputArea}>
                <div className={styles.inputWrap}>
                  <input className={styles.inputEl} placeholder={t("Reply message")} value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendReply()} />
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
