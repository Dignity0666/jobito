import React, { useState, useEffect } from 'react';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import styles from './ContentManagement.module.css';

// ── Types ─────────────────────────────────────────────────────────
type ReasonTag = "Academic Cheating" | "Fraud / Spam" | "Hate Speech" | "Misinformation" | string;

const ContentManagement: React.FC = () => {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { apiFetch, user: authUser } = useJobitoAuth();
  const isDark = theme === 'dark';

  const [rows, setRows] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContent = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/content/reported`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [apiFetch, language]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/content/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: id, action: 'delete' })
      });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.reportId !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setDeletingId(null);
  };

  const handleDismiss = async (id: number) => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/ops/content/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: id, action: 'dismiss' })
      });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.reportId !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getReasonBadgeClass = (reason: ReasonTag) => {
    // In a real app, you might have specific classes in CSS for each reason
    // For now, we can use inline colors for dynamic reasons or mapping
    const map: Record<ReasonTag, { bg: string; color: string }> = {
      "Academic Cheating": { bg: "var(--color-accent-light)", color: "var(--color-accent)" },
      "Fraud / Spam":      { bg: "rgba(229, 62, 62, 0.1)", color: "#E53E3E" },
      "Hate Speech":       { bg: "var(--color-primary-light)", color: "var(--color-primary)" },
      "Misinformation":    { bg: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" },
    };
    return map[reason] || { bg: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" };
  };

  return (
    <div className={styles.root} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{t("Reported Content")}</h2>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>{t("System request")}</button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>{t("Post Owner")}</th>
                  <th className={styles.th}>{t("Content")}</th>
                  <th className={styles.th}>{t("Reason")}</th>
                  <th className={styles.th}>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.td} style={{ textAlign: 'center', padding: '40px' }}>
                      {t("No flagged content — all clear ✓")}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.reportId} className={styles.tr}>
                      <td className={styles.td} data-label={t("Post Owner")} style={{ fontWeight: 700 }}>{row.postOwner}</td>
                      <td className={styles.td} data-label={t("Content")}>{row.content}</td>
                      <td className={styles.td} data-label={t("Reason")}>
                        <span 
                          className={styles.badge} 
                          style={{ 
                            backgroundColor: getReasonBadgeClass(row.reason).bg, 
                            color: getReasonBadgeClass(row.reason).color,
                            border: `1px solid ${getReasonBadgeClass(row.reason).color}33`
                          }}
                        >
                          {t(row.reason)}
                        </span>
                      </td>
                      <td className={styles.td} data-label={t("Actions")}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className={`${styles.btn} ${styles.btnDanger}`}
                            onClick={() => handleDelete(row.reportId)}
                            title={t("Delete Content")}
                          >
                            🗑
                          </button>
                          <button 
                            className={`${styles.btn} ${styles.btnOutline}`}
                            onClick={() => handleDismiss(row.reportId)}
                          >
                            {t("Dismiss")}
                          </button>
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
          {rows.length} {t("flagged items pending review")}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
