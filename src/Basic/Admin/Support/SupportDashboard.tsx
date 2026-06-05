import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import styles from './SupportDashboard.module.css';

interface SupportDashboardProps {
  preselectedUser?: any;
}

const SupportDashboard: React.FC<SupportDashboardProps> = ({ preselectedUser }) => {
  const { apiFetch, user: authUser } = useJobitoAuth();
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [sidebarTab, setSidebarTab] = useState<'users' | 'admins'>('users');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(preselectedUser || null);
  const [reply, setReply] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const socketRef = useRef<Socket | null>(null);
  const selectedIdRef = useRef<any>(null);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

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

  const fetchRecentChats = async () => {
    if (!authUser?.id) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/chat/my-chats/${authUser?.id}`);
      if (res.ok) {
        const data = await res.json();
        setRecentChats(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchRecentChats();
  }, [apiFetch, language, authUser?.id]);

  useEffect(() => {
    if (!authUser?.id) return;
    
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_user", { userId: authUser.id });
    });

    socket.on("new_p2p_message", (msg: any) => {
      fetchRecentChats();
      
      const currentSelectedId = selectedIdRef.current;
      if (currentSelectedId && (msg.senderId === currentSelectedId || msg.recipientId === currentSelectedId)) {
        setSelectedTicket((prev: any) => {
          if (!prev) return prev;
          // Avoid duplicate messages
          if (prev.messages.find((m: any) => m.id === msg.id)) return prev;
          return { ...prev, messages: [...prev.messages, msg] };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [authUser?.id]);

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

  const fetchUserChatHistory = async (otherId: string, userObj: any) => {
    setSelectedId(otherId as any);
    try {
      const res = await apiFetch(`${API_BASE_URL}/chat/p2p/history?userId=${authUser?.id}&otherId=${otherId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket({
          ticket: { userName: userObj?.name, userEmail: userObj?.contactInfo },
          messages: data || [],
          isUserChat: true
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (preselectedUser) {
      setSelectedUser(preselectedUser);
      fetchUserChatHistory(preselectedUser.userId, preselectedUser);
    }
  }, [preselectedUser]);

  useEffect(() => {
    if (selectedAdmin && !selectedUser) {
      fetchChatHistory(selectedAdmin.adminId);
    }
  }, [selectedAdmin, selectedUser]);

  const handleSendReply = async () => {
    const isUserChat = selectedTicket?.isUserChat;
    const recipient = isUserChat ? selectedUser : selectedAdmin;
    if (!reply.trim() || !recipient) return;
    
    try {
      const recipientId = isUserChat ? recipient.userId : recipient.adminId;
      const res = await apiFetch(`${API_BASE_URL}/chat/p2p`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          senderId: authUser?.id,
          recipientId: recipientId,
          content: reply 
        })
      });
      if (res.ok) {
        setReply("");
        if (isUserChat) {
          fetchUserChatHistory(recipientId, recipient);
        } else {
          fetchChatHistory(recipientId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackToList = () => {
    setSelectedAdmin(null);
    setSelectedUser(null);
    setSelectedTicket(null);
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

      </nav>

      {/* Body */}
      <div className={`${styles.body} ${selectedTicket ? styles.hasActiveChat : ''}`}>
        {/* Sidebar */}
        <div className={styles.leftPanel}>
          <div style={{ display: 'flex', padding: '10px', gap: '10px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
            <button 
              onClick={() => setSidebarTab('users')}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', background: sidebarTab === 'users' ? 'var(--color-primary)' : 'transparent', color: sidebarTab === 'users' ? '#fff' : 'var(--color-text-muted)' }}
            >
              {t("Users")}
            </button>
            <button 
              onClick={() => setSidebarTab('admins')}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', background: sidebarTab === 'admins' ? 'var(--color-primary)' : 'transparent', color: sidebarTab === 'admins' ? '#fff' : 'var(--color-text-muted)' }}
            >
              {t("Staff")}
            </button>
          </div>

          <div className={styles.ticketList} style={{ flex: 1, overflowY: 'auto' }}>
            {sidebarTab === 'admins' && admins.filter(a => a.adminId !== authUser?.id).map((adm) => (
              <div 
                key={adm.adminId} 
                className={`${styles.ticketItem} ${selectedAdmin?.adminId === adm.adminId ? styles.activeTicket : ''}`}
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedAdmin(adm);
                  // fetchChatHistory will be triggered by useEffect
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={styles.adminAvatarSmall}>{adm.fullName?.[0]}</div>
                  <div>
                    <div className={styles.ticketTitle}>{adm.fullName}</div>
                    <div className={styles.adminRoleLabel}>{t(adm.role)}</div>
                  </div>
                </div>
              </div>
            ))}

            {sidebarTab === 'users' && recentChats.map((chat) => (
              <div 
                key={chat.oderId} 
                className={`${styles.ticketItem} ${selectedUser?.userId === chat.oderId ? styles.activeTicket : ''}`}
                onClick={() => {
                  setSelectedAdmin(null);
                  setSelectedUser({ userId: chat.oderId, name: chat.name, contactInfo: chat.email });
                  fetchUserChatHistory(chat.oderId, { name: chat.name, contactInfo: chat.email });
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className={styles.adminAvatarSmall}>{chat.name?.[0] || 'U'}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className={styles.ticketTitle} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{chat.name}</div>
                    <div className={styles.adminRoleLabel} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{chat.lastMessage || chat.email}</div>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div style={{ background: 'var(--color-primary)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px' }}>
                      {chat.unreadCount}
                    </div>
                  )}
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
                <button className={styles.backBtn} onClick={handleBackToList} title={t("Back")}>
                  {language === 'ar' ? '→' : '←'}
                </button>
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
