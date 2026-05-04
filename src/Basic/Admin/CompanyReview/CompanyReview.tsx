import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import styles from './CompanyReview.module.css';

// ── Types ─────────────────────────────────────────────────────────
type Status = "Pending" | "Approved" | "Rejected";

interface Company {
  companyId: number;
  companyName: string;
  registrationDate: string;
  status: string;
  userEmail: string;
}

// ── Modal ─────────────────────────────────────────────────────────
function ReviewModal({ company, onClose, onReject, onApprove, t }: {
  company: Company;
  onClose: () => void;
  onReject: () => void;
  onApprove: () => void;
  t: any;
}) {
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              {t("Commercial Registration Review")}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{company.companyName}</div>
          </div>
          <button onClick={onClose} className={styles.btn} style={{ width: '32px', height: '32px', padding: 0, background: 'var(--color-bg-tertiary)', color: 'var(--color-text-muted)' }}>✕</button>
        </div>

        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[0, 1].map((i) => (
            <div key={i}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                {t("Attached Document")}
              </div>
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                background: 'var(--color-bg-tertiary)',
                height: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}>
                <div style={{ fontSize: '32px', opacity: 0.5 }}>📄</div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t("Scanned document image")}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onReject} className={styles.btn} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {t("Request rejected")}
          </button>
          <button onClick={onApprove} className={`${styles.btn} ${styles.btnApprove}`}>
            {t("Approval & acceptance")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
const CompanyReview: React.FC = () => {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { apiFetch, user: authUser } = useJobitoAuth();
  const isDark = theme === 'dark';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [reviewId, setReviewId] = useState<number | null>(null);

  const fetchCompanies = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/companies/pending`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [apiFetch]);

  const reviewTarget = companies.find(c => c.companyId === reviewId) ?? null;
  const pendingCount = companies.filter(c => c.status.toUpperCase() === "PENDING").length;

  const handleAction = async (id: number, action: "Approved" | "Rejected") => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/companies/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: id, action: action === "Approved" ? "approve" : "reject" })
      });
      if (res.ok) {
        setReviewId(null);
        fetchCompanies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadgeColors = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'PENDING') return { bg: 'var(--color-accent-light)', color: 'var(--color-accent)' };
    if (s === 'APPROVED') return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
    if (s === 'REJECTED') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
    return { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' };
  };

  return (
    <div className={styles.root} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>{t("Hello,")} {authUser?.name || 'Admin'}</h1>
          <p className={styles.headerSub}>{t("Following Is Your Organization's Performance Summary")}</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.btn} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '0 12px' }} onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
               {authUser?.name?.[0]?.toUpperCase()}
             </div>
             <div>
               <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{authUser?.name}</div>
               <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{authUser?.email}</div>
             </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className={styles.body}>
        <div style={{ background: 'var(--color-card-bg)', borderRadius: '24px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-tertiary)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{t("Company Registration Requests")}</h2>
            {pendingCount > 0 && (
              <span style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>
                {t("Pending")} ({pendingCount})
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border-light)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t("Company Name")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t("Registration Date")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t("Status")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t("Review Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      {t("All requests have been reviewed ✓")}
                    </td>
                  </tr>
                ) : (
                  companies.map((c) => (
                    <tr key={c.companyId} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700 }}>{c.companyName}</td>
                      <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)' }}>{new Date(c.registrationDate).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          backgroundColor: getStatusBadgeColors(c.status).bg, 
                          color: getStatusBadgeColors(c.status).color,
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                          border: `1px solid ${getStatusBadgeColors(c.status).color}33`
                        }}>
                          {t(c.status)}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => setReviewId(c.companyId)} className={`${styles.btn} ${styles.btnApprove}`} style={{ padding: '8px 16px', fontSize: '12px' }}>
                            📄 {t("Commercial Register")}
                          </button>
                          <button onClick={() => handleAction(c.companyId, "Rejected")} className={styles.btn} style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>✕</button>
                          <button onClick={() => handleAction(c.companyId, "Approved")} className={styles.btn} style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>✓</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {pendingCount} {t("pending review")} • {companies.filter(c => c.status.toUpperCase() === "APPROVED").length} {t("approved")} • {companies.filter(c => c.status.toUpperCase() === "REJECTED").length} {t("rejected")}
        </div>
      </div>

      {reviewTarget && (
        <ReviewModal
          company={reviewTarget}
          onClose={() => setReviewId(null)}
          onReject={() => handleAction(reviewTarget.companyId, "Rejected")}
          onApprove={() => handleAction(reviewTarget.companyId, "Approved")}
          t={t}
        />
      )}
    </div>
  );
};

export default CompanyReview;
