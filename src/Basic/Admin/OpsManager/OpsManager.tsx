import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { 
  Users, 
  Building2, 
  AlertTriangle, 
  Headset, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Send,
  X,
  FileText,
  ShieldCheck,
  Ban
} from 'lucide-react';
import styles from './OpsManager.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = 'users' | 'companies' | 'content' | 'support';

// ─── Main Component ──────────────────────────────────────────────────────────
const OpsManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [requestDesc, setRequestDesc] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { apiFetch } = useJobitoAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateRequest = async () => {
    if (!requestType || !requestDesc) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/system-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: requestType, description: requestDesc })
      });
      if (res.ok) {
        setShowRequestModal(false);
        setRequestType('');
        setRequestDesc('');
        alert('Request sent to Super Admin');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserAction = async (targetUserId: string, actionType: string, reason?: string) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/users/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, actionType, reason })
      });
      if (res.ok) setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewAction = async (action: 'approve' | 'reject', reason?: string) => {
    if (!selectedId) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/companies/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: selectedId, action, rejectionReason: reason })
      });
      if (res.ok) setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {/* ── Navbar ── */}
      <nav className={styles.navTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'companies' ? styles.active : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Company Review
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'content' ? styles.active : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content Moderation
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'support' ? styles.active : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Technical Support
        </button>

        <button className={styles.navActionBtn} onClick={() => setShowRequestModal(true)}>
          <Plus size={16} /> Request Assistant Addition
        </button>
      </nav>

      {/* ── Content Area ── */}
      <main className={styles.content}>
        {activeTab === 'users' && (
          <UserManagementView 
            refreshKey={refreshTrigger}
            onBlock={(id) => { setSelectedUserId(id); setShowBlockModal(true); }} 
            handleUserAction={handleUserAction}
          />
        )}
        {activeTab === 'companies' && (
          <CompanyReviewView 
            refreshKey={refreshTrigger}
            onReview={(id) => { setSelectedId(id); setShowReviewModal(true); }} 
          />
        )}
        {activeTab === 'content' && <ContentModerationView />}
        {activeTab === 'support' && <TechnicalSupportView />}
      </main>

      {/* ── Modals ── */}
      {showBlockModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Confirm Action: Block</h3>
              <button onClick={() => setShowBlockModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <span className={styles.modalLabel}>User ID:</span>
                <div className={styles.modalValue}>{selectedUserId}</div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.modalLabel}>Reason For Blocking:</label>
                <textarea className={styles.textarea} placeholder="Write the reason here..."></textarea>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowBlockModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={() => {
                const reason = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
                if (selectedUserId) handleUserAction(selectedUserId, 'block', reason);
                setShowBlockModal(false);
              }}>Confirm Block</button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && selectedId && (
        <div className={styles.overlay}>
          <div className={`${styles.modal} ${styles.docModal}`}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Commercial Registration Review</h3>
              <button onClick={() => setShowReviewModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <p><strong>Company ID:</strong> {selectedId}</p>
                <p>Please review the uploaded documents in the backend or cloud storage.</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.rejectBtn} onClick={() => {
                const reason = window.prompt("Reason for rejection:");
                if (reason) handleReviewAction('reject', reason);
                setShowReviewModal(false);
              }}>Reject Request</button>
              <button className={styles.approveBtn} onClick={() => {
                handleReviewAction('approve');
                setShowReviewModal(false);
              }}>Approve Registration</button>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>New System Request</h3>
              <button onClick={() => setShowRequestModal(false)} style={{background:'none', border:'none', cursor:'pointer'}}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.modalLabel}>Request Type:</label>
                <input 
                  type="text" 
                  className={styles.inputField} 
                  placeholder="e.g., Assistant Addition, Server Upgrade" 
                  value={requestType}
                  onChange={e => setRequestType(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.modalLabel}>Description:</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Explain why this request is needed..."
                  value={requestDesc}
                  onChange={e => setRequestDesc(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowRequestModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleCreateRequest}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-Views ──────────────────────────────────────────────────────────────

const UserManagementView = ({ onBlock }: { onBlock: (userId: string) => void }) => {
  const { apiFetch } = useJobitoAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/admin/ops/users`).then(r => r.json()).then(d => setUsers(d.data || []));
  }, [apiFetch]);

  return (
  <div className={styles.card}>
    <div className={styles.tableHeader} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
      <span>Full Name</span>
      <span>Email / Phone</span>
      <span>User Role</span>
      <span>Status</span>
      <span>Actions</span>
    </div>
    {users.slice(0, 5).map((user, i) => (
      <div key={i} className={`${styles.tableRow} ${styles.userGrid}`}>
        <span className={styles.userCellName}>{user.name}</span>
        <span className={styles.userCellContact}>{user.contactInfo}</span>
        <span className={styles.userCellRole}>{user.accountType}</span>
        <span>
          <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : user.status === 'warned' ? styles.statusWarned : styles.statusBanned}`}>
            {user.status || 'Active'}
          </span>
        </span>
        <div className={styles.actionGroup}>
          <div className={styles.iconAction} title="Warn User" onClick={() => {
            const reason = window.prompt("Reason for warning:");
            if (reason) handleUserAction(user.userId, 'warn', reason);
          }}><AlertTriangle size={14} /></div>
          <div className={styles.iconAction} title="Block User" onClick={() => {
            setSelectedUserId(user.userId);
            onBlock(user.userId);
          }}><Ban size={14} /></div>
          <div className={styles.iconAction} title="Delete Account" onClick={() => {
            if (window.confirm("Are you sure?")) handleUserAction(user.userId, 'delete');
          }}><Trash2 size={14} /></div>
        </div>
      </div>
    ))}
  </div>
  );
};

const CompanyReviewView = ({ onReview }: { onReview: (companyId: number) => void }) => {
  const { apiFetch } = useJobitoAuth();
  const [companies, setCompanies] = useState<any[]>([]);

  const fetchCompanies = () => {
    apiFetch(`${API_BASE_URL}/admin/ops/companies/pending`).then(r => r.json()).then(d => setCompanies(d.data || []));
  };

  useEffect(() => {
    fetchCompanies();
  }, [apiFetch]);

  return (
  <div className={styles.card}>
    <div className={styles.tableHeader} style={{ gridTemplateColumns: '1fr 1fr 1fr auto' }}>
      <span>Company Name</span>
      <span>Registration Date</span>
      <span>Status</span>
      <span>Documents</span>
    </div>
    {companies.map((comp, i) => (
      <div key={i} className={`${styles.tableRow} ${styles.companyGrid}`}>
        <span className={styles.userCellName}>{comp.name}</span>
        <span className={styles.companyDate}>{new Date(comp.createdAt).toLocaleDateString()}</span>
        <span><span className={styles.pendingLabel}>{comp.status}</span></span>
        <button className={styles.linkBtn} onClick={() => {
          setSelectedId(comp.companyId);
          onReview(comp.companyId);
        }}>
          <ExternalLink size={14} /> Review
        </button>
      </div>
    ))}
  </div>
  );
};

const ContentModerationView = () => {
  const { apiFetch } = useJobitoAuth();
  const [content, setContent] = useState<any[]>([]);

  const fetchContent = () => {
    apiFetch(`${API_BASE_URL}/admin/ops/content/reported`).then(r => r.json()).then(d => setContent(d.data || []));
  };

  const handleAction = async (id: number, action: 'delete' | 'dismiss') => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/content/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: id, action })
      });
      if (res.ok) fetchContent();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [apiFetch]);

  return (
  <div className={styles.card}>
    <div className={styles.tableHeader} style={{ gridTemplateColumns: '1fr 2fr 1fr auto' }}>
      <span>Reported Post</span>
      <span>Report Reason</span>
      <span>Reporter</span>
      <span>Actions</span>
    </div>
    {content.map((item, i) => (
      <div key={i} className={`${styles.tableRow} ${styles.contentGrid}`}>
        <span className={styles.userCellName}>{item.contentSnippet || item.type}</span>
        <span><span className={styles.reasonTag}>{item.reason}</span></span>
        <span className={styles.userCellRole}>{item.reporterName}</span>
        <div className={styles.actionGroup}>
          <button className={styles.deleteBtn} onClick={() => handleAction(item.reportId, 'delete')}><Trash2 size={14} /> Delete</button>
          <div className={styles.iconAction} title="Dismiss Report" onClick={() => handleAction(item.reportId, 'dismiss')}><X size={14} /></div>
        </div>
      </div>
    ))}
  </div>
  );
};

const TechnicalSupportView = () => {
  const { apiFetch } = useJobitoAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicketData, setSelectedTicketData] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const fetchTickets = () => {
    apiFetch(`${API_BASE_URL}/admin/ops/support/tickets`).then(r => r.json()).then(d => setTickets(d.data || []));
  };

  const fetchMessages = (id: number) => {
    setSelectedTicketId(id);
    apiFetch(`${API_BASE_URL}/admin/ops/support/tickets/${id}`).then(r => r.json()).then(d => setSelectedTicketData(d));
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicketId) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/support/tickets/${selectedTicketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText })
      });
      if (res.ok) {
        setReplyText('');
        fetchMessages(selectedTicketId);
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [apiFetch]);

  return (
  <div className={styles.card}>
    <div className={styles.supportLayout}>
      <aside className={styles.ticketList}>
        {tickets.map((ticket, i) => (
          <div key={i} className={`${styles.ticketItem} ${selectedTicketId === ticket.ticketId ? styles.active : ''}`} onClick={() => fetchMessages(ticket.ticketId)}>
            <h4 className={styles.ticketSubject}>{ticket.subject}</h4>
            <p className={styles.ticketUser}>{ticket.userName}</p>
            <p className={styles.ticketEmail}>{ticket.userEmail}</p>
          </div>
        ))}
      </aside>
      <section className={styles.chatArea}>
        {selectedTicketData ? (
          <div className={styles.messagesList}>
            {selectedTicketData.messages?.map((m: any, i: number) => {
              const isUser = m.senderType === 'user';
              return (
                <div key={i} className={`${styles.messageRow} ${isUser ? styles.msgLeft : styles.msgRight}`}>
                  <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAdmin}`}>
                    {m.content}
                  </div>
                  <div className={styles.msgTime}>{new Date(m.createdAt).toLocaleTimeString()}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.chatEmpty}>
            <Headset size={64} opacity={0.1} />
            <p className={styles.emptyText}>{t("Select a ticket to start responding")}</p>
          </div>
        )}
        <div className={styles.chatInputArea}>
          <input 
            type="text" 
            className={styles.chatInput} 
            placeholder="Type your response here..." 
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReply()}
          />
          <button className={styles.sendBtn} onClick={handleReply}><Send size={18} /></button>
        </div>
      </section>
    </div>
  </div>
  );
};

export default OpsManagerDashboard;
