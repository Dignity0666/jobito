import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import styles from './CompanyReview.module.css';

// ── Types ─────────────────────────────────────────────────────────
type FilterTab = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
type ViewMode = "COMPANIES" | "CRIMINAL_RECORDS";

interface Company {
  companyId: number;
  companyName: string;
  registrationDate: string;
  status: string;
  contactEmail: string;
  phone?: string;
  taxId?: string;
  licenseNumber?: string;
  officialNationalId?: string;
  crDocumentUrl?: string;
  taxDocumentUrl?: string;
  address?: string;
  logoUrl?: string;
}

interface CriminalRecordUser {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  criminalRecordUrl: string;
  avatarUrl?: string;
  status: string; // PENDING, VERIFIED, REJECTED
  classification?: string;
  registrationDate: string;
}

// ── Review Modals ──────────────────────────────────────────────────
function CompanyModal({ company, onClose, onReject, onApprove, loading, t }: {
  company: Company;
  onClose: () => void;
  onReject: () => void;
  onApprove: () => void;
  loading: boolean;
  t: any;
}) {
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              {t("Commercial Registration Review")}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{company.companyName}</div>
          </div>
          <button onClick={onClose} className={styles.btnClose}>✕</button>
        </div>

        {/* Company Details */}
        <div style={{ padding: '24px' }}>
          <div className={styles.modalDetailsGrid}>
            <DetailItem icon="📧" label={t("Email")} value={company.contactEmail} />
            <DetailItem icon="📞" label={t("Phone")} value={company.phone || '—'} />
            <DetailItem icon="🏢" label={t("Tax ID")} value={company.taxId || '—'} />
            <DetailItem icon="📋" label={t("License Number")} value={company.licenseNumber || '—'} />
            <DetailItem icon="🪪" label={t("National ID")} value={company.officialNationalId || '—'} />
            <DetailItem icon="📍" label={t("Address")} value={company.address || '—'} />
          </div>

          {/* Document Previews */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t("Commercial Register")}
              </div>
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                background: 'var(--color-bg-tertiary)',
                height: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}>
                {company.crDocumentUrl ? (
                  <a href={company.crDocumentUrl.startsWith('http') ? company.crDocumentUrl : `${API_BASE_URL}${company.crDocumentUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                    📄 {t("View Document")}
                  </a>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', opacity: 0.4 }}>📄</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t("No document uploaded")}</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {t("Tax Register")}
              </div>
              <div style={{
                border: '2px dashed var(--color-border)',
                borderRadius: '16px',
                background: 'var(--color-bg-tertiary)',
                height: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}>
                {company.taxDocumentUrl ? (
                  <a href={company.taxDocumentUrl.startsWith('http') ? company.taxDocumentUrl : `${API_BASE_URL}${company.taxDocumentUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                    📄 {t("View Document")}
                  </a>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', opacity: 0.4 }}>📄</div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t("No document uploaded")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <button
            onClick={onReject}
            disabled={loading}
            className={`${styles.btnAction} ${styles.btnActionReject}`}
          >
            <span style={{ fontSize: '16px' }}>✕</span>
            {loading ? '...' : t("Reject")}
          </button>
          <button
            onClick={onApprove}
            disabled={loading}
            className={`${styles.btnAction} ${styles.btnActionApprove}`}
          >
            <span style={{ fontSize: '16px' }}>✓</span>
            {loading ? '...' : t("Approve")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CriminalRecordModal({ user, onClose, onReject, onApprove, loading, t }: {
  user: CriminalRecordUser;
  onClose: () => void;
  onReject: () => void;
  onApprove: () => void;
  loading: boolean;
  t: any;
}) {
  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
              {t("Criminal Record Review")}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>{user.fullName}</div>
          </div>
          <button onClick={onClose} className={styles.btnClose}>✕</button>
        </div>

        {/* User Details */}
        <div style={{ padding: '24px' }}>
          <div className={styles.modalDetailsGrid}>
            <DetailItem icon="📧" label={t("Email")} value={user.email} />
            <DetailItem icon="📞" label={t("Phone")} value={user.phone || '—'} />
            <DetailItem icon="👷" label={t("Classification")} value={user.classification || '—'} />
          </div>

          {/* Document Previews */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t("Criminal Record Document")}
            </div>
            <div style={{
              border: '2px dashed var(--color-border)',
              borderRadius: '16px',
              background: 'var(--color-bg-tertiary)',
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
              {user.criminalRecordUrl ? (
                <a href={user.criminalRecordUrl.startsWith('http') ? user.criminalRecordUrl : `${API_BASE_URL}${user.criminalRecordUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                  📄 {t("View Document")}
                </a>
              ) : (
                <>
                  <div style={{ fontSize: '32px', opacity: 0.4 }}>📄</div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t("No document uploaded")}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <button
            onClick={onReject}
            disabled={loading}
            className={`${styles.btnAction} ${styles.btnActionReject}`}
          >
            <span style={{ fontSize: '16px' }}>✕</span>
            {loading ? '...' : t("Reject")}
          </button>
          <button
            onClick={onApprove}
            disabled={loading}
            className={`${styles.btnAction} ${styles.btnActionApprove}`}
          >
            <span style={{ fontSize: '16px' }}>✓</span>
            {loading ? '...' : t("Approve")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className={styles.modalDetailItem}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '13px', color: 'var(--color-text)', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
const CompanyReview: React.FC = () => {
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const { apiFetch } = useJobitoAuth();

  const [viewMode, setViewMode] = useState<ViewMode>("COMPANIES");
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [criminalRecords, setCriminalRecords] = useState<CriminalRecordUser[]>([]);
  
  const [reviewCompanyId, setReviewCompanyId] = useState<number | null>(null);
  const [reviewUserId, setReviewUserId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<FilterTab>("PENDING");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Companies
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const pendingRes = await apiFetch(`${API_BASE_URL}/admin/ops/companies/pending`);
      let pendingCompanies: Company[] = [];
      if (pendingRes.ok) {
        const data = await pendingRes.json();
        pendingCompanies = (data.data || []).map((c: any) => ({ 
          ...c, 
          status: c.status || 'PENDING' 
        }));
      } else {
        console.error("Failed to fetch pending companies:", pendingRes.status);
      }

      const allRes = await apiFetch(`${API_BASE_URL}/admin/ops/companies`);
      let allCompanies: Company[] = [];
      if (allRes.ok) {
        const data = await allRes.json();
        allCompanies = (data.data || []).map((c: any) => ({ 
          ...c, 
          status: c.status || 'PENDING' 
        }));
      }

      const companyMap = new Map<number, Company>();
      allCompanies.forEach(c => companyMap.set(c.companyId, c));
      pendingCompanies.forEach(c => companyMap.set(c.companyId, c));
      
      const finalResult = Array.from(companyMap.values());
      console.log("Fetched companies:", finalResult);
      setCompanies(finalResult);
    } catch (err) {
      console.error("Error in fetchCompanies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Criminal Records
  const fetchCriminalRecords = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/criminal-records`);
      if (res.ok) {
        const data = await res.json();
        setCriminalRecords(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "COMPANIES") {
      fetchCompanies();
    } else {
      fetchCriminalRecords();
    }
  }, [apiFetch, viewMode, language]);

  // Actions
  const handleCompanyAction = async (id: number, action: "Approved" | "Rejected") => {
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/companies/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: id, action: action === "Approved" ? "approve" : "reject" })
      });
      if (res.ok) {
        setReviewCompanyId(null);
        await fetchCompanies();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCrAction = async (id: string, action: "Approved" | "Rejected") => {
    setActionLoading(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/criminal-records/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, action: action === "Approved" ? "approve" : "reject" })
      });
      if (res.ok) {
        setReviewUserId(null);
        await fetchCriminalRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Rendering Helpers
  const getStatusBadge = (status: string) => {
    if (!status) return { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', text: t('Unknown'), icon: '?' };
    const s = status.toUpperCase();
    if (s === 'PENDING') return { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#fff', text: t('Pending'), icon: '⏳' };
    if (s === 'APPROVED' || s === 'VERIFIED') return { bg: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', text: t('Approved'), icon: '✓' };
    if (s === 'REJECTED') return { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', text: t('Rejected'), icon: '✕' };
    return { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)', text: status, icon: '?' };
  };

  const reviewCompanyTarget = companies.find(c => c.companyId === reviewCompanyId) ?? null;
  const reviewCrTarget = criminalRecords.find(u => u.userId === reviewUserId) ?? null;

  const currentList = viewMode === "COMPANIES" ? companies : criminalRecords;
  const filteredList = activeTab === "ALL"
    ? currentList
    : currentList.filter(item => {
        // companies use 'status', users use 'status' too but mapping 'APPROVED'/'VERIFIED'
        const s = (item as any).status.toUpperCase();
        if (activeTab === "APPROVED") return s === "APPROVED" || s === "VERIFIED";
        return s === activeTab;
      });

  const pendingCount = currentList.filter(i => (i as any).status.toUpperCase() === "PENDING").length;
  const approvedCount = currentList.filter(i => {
    const s = (i as any).status.toUpperCase();
    return s === "APPROVED" || s === "VERIFIED";
  }).length;
  const rejectedCount = currentList.filter(i => (i as any).status.toUpperCase() === "REJECTED").length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "ALL", label: t("All"), count: currentList.length },
    { key: "PENDING", label: t("Pending"), count: pendingCount },
    { key: "APPROVED", label: t("Approved"), count: approvedCount },
    { key: "REJECTED", label: t("Rejected"), count: rejectedCount },
  ];

  return (
    <div className={styles.root} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className={styles.body}>
        
        {/* Top Header & Switcher */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            {viewMode === "COMPANIES" ? t("Company Registration Requests") : t("Criminal Record Reviews")}
          </h1>

          <div style={{ display: 'flex', background: 'var(--color-bg-tertiary)', borderRadius: '12px', padding: '4px' }}>
            <button
              onClick={() => { setViewMode("COMPANIES"); setActiveTab("PENDING"); }}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                background: viewMode === "COMPANIES" ? 'var(--color-primary)' : 'transparent',
                color: viewMode === "COMPANIES" ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              🏢 {t("Companies")}
            </button>
            <button
              onClick={() => { setViewMode("CRIMINAL_RECORDS"); setActiveTab("PENDING"); }}
              style={{
                padding: '8px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                background: viewMode === "CRIMINAL_RECORDS" ? 'var(--color-primary)' : 'transparent',
                color: viewMode === "CRIMINAL_RECORDS" ? '#fff' : 'var(--color-text-secondary)'
              }}
            >
              👷 {t("Tradesmen")}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.tabsContainer} style={{ marginBottom: '24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className={`${styles.tabBadge} ${activeTab === tab.key ? styles.tabBadgeActive : ''}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div style={{
          background: 'var(--color-card-bg)',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-light)', background: 'var(--color-bg-tertiary)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px' }}>
                    {viewMode === "COMPANIES" ? t("Company") : t("Applicant")}
                  </th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Email")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Submission Date")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Status")}</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 700, letterSpacing: '0.5px' }}>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <div className={styles.spinner} />
                      <div style={{ marginTop: '12px' }}>{t("Loading")}...</div>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>
                        {viewMode === "COMPANIES" ? '🏢' : '📋'}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {activeTab === "PENDING" ? t("No pending requests") : t("No records found")}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item: any) => {
                    const isCompany = viewMode === "COMPANIES";
                    const itemId = isCompany ? item.companyId : item.userId;
                    const itemName = isCompany ? item.companyName : item.fullName;
                    const itemEmail = isCompany ? item.contactEmail : item.email;
                    
                    const badge = getStatusBadge(item.status);
                    const isPending = item.status.toUpperCase() === 'PENDING';
                    
                    return (
                      <tr key={itemId} className={styles.tableRow}>
                        {/* Name + Avatar */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className={styles.companyAvatar}>
                              {itemName?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>{itemName}</span>
                          </div>
                        </td>
                        {/* Email */}
                        <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                          {itemEmail || '—'}
                        </td>
                        {/* Date */}
                        <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                          {item.registrationDate ? new Date(item.registrationDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB') : '—'}
                        </td>
                        {/* Status Badge */}
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            background: badge.bg,
                            color: badge.color,
                            padding: '5px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {badge.icon} {badge.text}
                          </span>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '16px 24px' }}>
                          {isPending ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {/* View Details */}
                              <button
                                onClick={() => isCompany ? setReviewCompanyId(itemId) : setReviewUserId(itemId)}
                                className={styles.btnTableAction}
                                title={t("View Details")}
                              >
                                📄 {t("Review")}
                              </button>
                              {/* Reject */}
                              <button
                                onClick={() => isCompany ? handleCompanyAction(itemId, "Rejected") : handleCrAction(itemId, "Rejected")}
                                className={`${styles.btnIcon} ${styles.btnIconReject}`}
                                title={t("Reject")}
                              >
                                ✕
                              </button>
                              {/* Approve */}
                              <button
                                onClick={() => isCompany ? handleCompanyAction(itemId, "Approved") : handleCrAction(itemId, "Approved")}
                                className={`${styles.btnIcon} ${styles.btnIconApprove}`}
                                title={t("Approve")}
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                              {t("Reviewed")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>⏳ {pendingCount} {t("Pending review")}</span>
          <span>✓ {approvedCount} {t("Approved")}</span>
          <span>✕ {rejectedCount} {t("Rejected")}</span>
        </div>
      </div>

      {/* Modals */}
      {reviewCompanyTarget && viewMode === "COMPANIES" && (
        <CompanyModal
          company={reviewCompanyTarget as Company}
          onClose={() => setReviewCompanyId(null)}
          onReject={() => handleCompanyAction(reviewCompanyTarget.companyId, "Rejected")}
          onApprove={() => handleCompanyAction(reviewCompanyTarget.companyId, "Approved")}
          loading={actionLoading}
          t={t}
        />
      )}
      
      {reviewCrTarget && viewMode === "CRIMINAL_RECORDS" && (
        <CriminalRecordModal
          user={reviewCrTarget as CriminalRecordUser}
          onClose={() => setReviewUserId(null)}
          onReject={() => handleCrAction(reviewCrTarget.userId, "Rejected")}
          onApprove={() => handleCrAction(reviewCrTarget.userId, "Approved")}
          loading={actionLoading}
          t={t}
        />
      )}
    </div>
  );
};

export default CompanyReview;
