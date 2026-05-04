import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import styles from './UserManagement.module.css';

const TABS = ["User Management", "Company Review", "Content Management", "Technical Support"];
const VIEWS = ["Table", "Add Manager", "Warning", "Suspension", "Block"];

type ModalType = "warn" | "suspend" | "block" | "addManager" | null;

// ── Sub-components ─────────────────────────────────────────────

function ActionBadge({ action }: { action: string }) {
  const cls = action === "Log Out" ? styles.badgeLogout : action === "Delete Account" ? styles.badgeDelete : styles.badgeLogin;
  const icon = action === "Log Out" ? "↗" : action === "Delete Account" ? "✕" : "↙";
  return <span className={`${styles.actionBadge} ${cls}`}>{icon} {action}</span>;
}

function AccountChip({ type }: { type: string }) {
  const cls = type.includes("Student") ? styles.chipStudent : styles.chipBusiness;
  return <span className={`${styles.accountChip} ${cls}`}>{type}</span>;
}

function RatingDisplay({ r }: { r: number }) {
  const cls = r >= 4 ? styles.ratingHigh : r >= 3 ? styles.ratingMid : styles.ratingLow;
  return <span className={`${styles.rating} ${cls}`}>{r.toFixed(1)}/5.0 <span className={styles.star}>★</span></span>;
}

// ── Modals ─────────────────────────────────────────────────────

const WarningModal = ({ user, onClose, onConfirm }: { user: any; onClose: () => void, onConfirm: (reason: string) => void }) => {
  const [reason, setReason] = useState("");
  const { t } = useTranslation();
  return (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={`${styles.accentBar} ${styles.accentOrange}`} />
      <div className={styles.modalHeader}>
        <h2>⚠️ {t("Confirm Action: Warning")}</h2>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.targetUser}>
          <span className={styles.fieldLabel}>{t("Target User")}:</span>
          <span style={{fontWeight: 700, color: 'var(--color-text)'}}>{user?.name}</span>
        </div>
        <div className={styles.fieldGroup}>
          <textarea className={styles.fieldInput} rows={4} placeholder={t("Enter the reason for this warning clearly...")} value={reason} onChange={e => setReason(e.target.value)} />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnCancel} onClick={onClose}>{t("Cancel")}</button>
        <button className={`${styles.btnConfirm} ${styles.orange}`} onClick={() => onConfirm(reason)}>⚡ {t("Confirm & Execute")}</button>
      </div>
    </div>
  </div>
)};

const SuspensionModal = ({ user, onClose, onConfirm }: { user: any; onClose: () => void, onConfirm: (reason: string) => void }) => {
  const [reason, setReason] = useState("");
  const { t } = useTranslation();
  return (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={`${styles.accentBar} ${styles.accentWarning}`} />
      <div className={styles.modalHeader}>
        <h2>⏸ {t("Confirm Action: Temporary Suspension")}</h2>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.targetUser}>
          <span className={styles.fieldLabel}>{t("Target User")}:</span>
          <span style={{fontWeight: 700, color: 'var(--color-text)'}}>{user?.name}</span>
        </div>
        <div className={styles.fieldGroup}>
          <textarea className={styles.fieldInput} rows={4} placeholder={t("Enter the reason for this Temporary Suspension clearly...")} value={reason} onChange={e => setReason(e.target.value)} />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnCancel} onClick={onClose}>{t("Cancel")}</button>
        <button className={`${styles.btnConfirm} ${styles.warning}`} onClick={() => onConfirm(reason)}>⚡ {t("Confirm & Execute")}</button>
      </div>
    </div>
  </div>
)};

const BlockModal = ({ user, onClose, onConfirm }: { user: any; onClose: () => void, onConfirm: (reason: string) => void }) => {
  const [reason, setReason] = useState("");
  const { t } = useTranslation();
  return (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={`${styles.accentBar} ${styles.accentDanger}`} />
      <div className={styles.modalHeader}>
        <h2>🚫 {t("Confirm Action: Block")}</h2>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.targetUser}>
          <span className={styles.fieldLabel}>{t("Target User")}:</span>
          <span style={{fontWeight: 700, color: 'var(--color-text)'}}>{user?.name}</span>
        </div>
        <div className={styles.fieldGroup}>
          <textarea className={styles.fieldInput} rows={4} placeholder={t("Enter the reason for this block clearly...")} value={reason} onChange={e => setReason(e.target.value)} />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={`${styles.btnConfirm} ${styles.danger}`} onClick={() => onConfirm(reason)}>⚡ Confirm & Execute</button>
      </div>
    </div>
  </div>
)};

const AddManagerModal = ({ onClose }: { onClose: () => void }) => (
  <div className={styles.overlay} onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      <div className={`${styles.accentBar} ${styles.accentCobalt}`} />
      <div className={styles.modalHeader}>
        <h2>👤 Request To Add An Operations Manager</h2>
        <p>As An Operations Manager, You Can Nominate A Colleague To Assist You. This Request Will Be Sent To The System Administrator For Review And Approval.</p>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Candidate name</label>
          <input className={styles.fieldInput} defaultValue="Khaled Omar" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Candidate email address</label>
          <input className={styles.fieldInput} type="email" defaultValue="khaled@email.com" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Reason for request (optional)</label>
          <textarea className={styles.fieldInput} placeholder="Example: Increased workload in the company review department." />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={`${styles.btnConfirm} ${styles.cobalt}`}>⚡ Confirm & Execute</button>
      </div>
    </div>
  </div>
);

// ── Main Component ────────────────────────────────────────────────

const UserManagement: React.FC = () => {
  const { apiFetch, user: authUser } = useJobitoAuth();
  const [activeTab, setActiveTab] = useState("User Management");
  const [modal, setModal] = useState<{ type: ModalType; user: any } | null>(null);
  const [demoView, setDemoView] = useState("Table");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [apiFetch]);

  const executeAction = async (targetUserId: string, actionType: string, reason: string) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/users/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, actionType, reason })
      });
      if (res.ok) {
        alert(`Action ${actionType} executed successfully`);
        setModal(null);
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.contactInfo?.toLowerCase().includes(search.toLowerCase())
  );

  const demoUser = users[0] || { name: 'Demo User' };
  const forcedModal: ModalType = demoView === "Add Manager" ? "addManager"
    : demoView === "Warning"    ? "warn"
    : demoView === "Suspension" ? "suspend"
    : demoView === "Block"      ? "block"
    : null;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>{t("Hello,")} {user?.name || 'Admin'}</h1>
          <p>Following Is Your Organization's Performance Summary</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} title="Dark mode">🌙</button>
          <button className={styles.iconBtn} title="Notifications">🔔</button>
          <div className={styles.avatarChip}>
            <div className={styles.avatar}>{authUser?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div className={styles.avatarInfo}>
              <div className={styles.avatarName}>{authUser?.name || 'Admin'} ▾</div>
              <div className={styles.avatarEmail}>{authUser?.email || ''}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className={styles.navBar}>
        <div className={styles.navTabs}>
          {/* Tabs removed to use global Admin navigation */}
        </div>
        <button className={styles.sysReqBtn} onClick={() => { setDemoView("Add Manager"); }}>
          + System request
        </button>
      </nav>

      {/* Demo bar */}
      <div className={styles.demoBar}>
        <span>Preview:</span>
        {VIEWS.map(v => (
          <button key={v} className={`${styles.demoBtn} ${demoView === v ? styles.active : ""}`}
            onClick={() => setDemoView(v)}>{v}</button>
        ))}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span style={{color: '#8896B0'}}>🔍</span>
          <input placeholder="search user name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          <div className={styles.filterSelect}>All States ▾</div>
          <div className={styles.filterSelect}>All Categories ▾</div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Name</th>
              <th className={styles.th}>Info</th>
              <th className={styles.th}>Action Type</th>
              <th className={styles.th}>Account Type</th>
              <th className={styles.th}>Status & Rating</th>
              <th className={styles.th}>Quick Actions</th>
              <th className={styles.th}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.userId}>
                <td className={styles.td}><span className={styles.userName}>{u.name}</span></td>
                <td className={styles.td}><span className={styles.userInfo}>{u.contactInfo}</span></td>
                <td className={styles.td}><ActionBadge action={u.lastActionType || 'Active'} /></td>
                <td className={styles.td}><AccountChip type={u.accountType} /></td>
                <td className={styles.td}><RatingDisplay r={u.rating?.average || 0} /></td>
                <td className={styles.td}>
                  <div className={styles.quickActions}>
                    <button className={`${styles.qaBtn} ${styles.qaWarn}`} title="Warn" onClick={() => setModal({type: "warn", user: u})}>⚠</button>
                    <button className={`${styles.qaBtn} ${styles.qaSusp}`} title="Suspend" onClick={() => setModal({type: "suspend", user: u})}>⏸</button>
                    <button className={`${styles.qaBtn} ${styles.qaBlock}`} title="Block" onClick={() => setModal({type: "block", user: u})}>🚫</button>
                  </div>
                </td>
                <td className={styles.td}>
                  <button className={styles.msgBtn}>💬 Messages</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal?.type === "warn"    && <WarningModal    user={modal.user} onClose={() => setModal(null)} onConfirm={(r) => executeAction(modal.user.userId, 'warning', r)} />}
      {modal?.type === "suspend" && <SuspensionModal user={modal.user} onClose={() => setModal(null)} onConfirm={(r) => executeAction(modal.user.userId, 'suspend', r)} />}
      {modal?.type === "block"   && <BlockModal      user={modal.user} onClose={() => setModal(null)} onConfirm={(r) => executeAction(modal.user.userId, 'ban', r)} />}

      {!modal && forcedModal === "addManager" && <AddManagerModal onClose={() => setDemoView("Table")} />}
      {!modal && forcedModal === "warn"       && <WarningModal    user={demoUser} onClose={() => setDemoView("Table")} onConfirm={(r) => executeAction(demoUser.userId, 'warning', r)} />}
      {!modal && forcedModal === "suspend"    && <SuspensionModal user={demoUser} onClose={() => setDemoView("Table")} onConfirm={(r) => executeAction(demoUser.userId, 'suspend', r)} />}
      {!modal && forcedModal === "block"      && <BlockModal      user={demoUser} onClose={() => setDemoView("Table")} onConfirm={(r) => executeAction(demoUser.userId, 'ban', r)} />}
    </div>
  );
};

export default UserManagement;
