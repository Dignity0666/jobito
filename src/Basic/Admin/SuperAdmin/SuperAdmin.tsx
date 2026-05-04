import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Bell, 
  Moon, 
  Sun,
  ArrowUpRight,
  MousePointer2
} from 'lucide-react';
import styles from './SuperAdmin.module.css';
import { useTranslation } from '../../../context/translation-context';
import { useTheme } from '../../../context/ThemeContext';
import { useJobitoAuth } from '../../../context/LinkContxt';
import { API_BASE_URL } from '../../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Tooltip, Legend);

// ─── Data Defaults ───────────────────────────────────────────────────────────
const STATS = [
  { label: 'Active Users', value: '0', change: '', trend: '', color: 'success', sparkData: [] },
  { label: 'Total Companies', value: '0', change: '', trend: '', color: 'info', sparkData: [] },
  { label: 'System Uptime', value: '100%', change: '', trend: '', color: 'warn', sparkData: [] },
  { label: 'Active Security Alerts', value: '0', change: '', trend: '', color: 'danger', sparkData: [] },
];

const BAR_LABELS = ['3 Jun','4 Jun','5 Jun','6 Jun','7 Jun','8 Jun','9 Jun','10 Jun','11 Jun','12 Jun','13 Jun','14 Jun'];
const BAR_VALUES = [120, 220, 150, 250, 280, 210, 250, 110, 280, 340, 380, 410];

// ─── Sparkline Component ─────────────────────────────────────────────────────
const SparkLine = ({ data, color }: { data: number[]; color: string }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const colors: Record<string, { border: string; bg: string }> = {
    success: { border: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    info:    { border: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    warn:    { border: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    danger:  { border: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  };

  const c = colors[color] || colors.info;
  
  return (
    <div className={styles.sparklineWrapper}>
      <Line
        data={{
          labels: ['M','T','W','T','F','S','S'],
          datasets: [{
            data,
            borderColor: c.border,
            backgroundColor: c.bg,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHitRadius: 0,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: { 
              display: true, 
              ticks: { font: { size: 9, weight: 600 }, color: isDark ? '#94a3b8' : '#64748b' }, 
              grid: { display: false }, 
              border: { display: false } 
            },
            y: { display: false },
          },
          animation: { duration: 800 },
        }}
      />
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const SuperAdminDashboard: React.FC = () => {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { apiFetch, user } = useJobitoAuth();
  const isDark = theme === 'dark';

  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [systemRequests, setSystemRequests] = useState<any[]>([]);

  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, chartRes, maintRes, requestsRes] = await Promise.all([
          apiFetch(`${API_BASE_URL}/admin/dashboard/stats`),
          apiFetch(`${API_BASE_URL}/admin/dashboard/charts`),
          apiFetch(`${API_BASE_URL}/admin/maintenance`),
          apiFetch(`${API_BASE_URL}/admin/system-requests`)
        ]);

        if (statsRes.ok) setStatsData(await statsRes.json());
        if (chartRes.ok) setChartData(await chartRes.json());
        if (maintRes.ok) {
          const data = await maintRes.json();
          setMaintenanceOn(data.maintenanceMode);
        }
        if (requestsRes.ok) {
          const data = await requestsRes.json();
          setSystemRequests(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    loadData();
  }, [apiFetch]);

  const handleToggleMaintenance = async () => {
    const newVal = !maintenanceOn;
    setMaintenanceOn(newVal);
    try {
      await apiFetch(`${API_BASE_URL}/admin/maintenance`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newVal })
      });
    } catch (err) {
      setMaintenanceOn(!newVal);
    }
  };

  const handleInviteAdmin = async () => {
    if (!newAdminName || !newAdminEmail) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: newAdminName, 
          email: newAdminEmail, 
          password: newAdminPassword, 
          role: 'operation_manager' 
        })
      });
      if (res.ok) {
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        alert(t('Admin invited successfully'));
      }
    } catch (err) {
      console.error('Error inviting admin:', err);
    }
  };

  const handleReviewRequest = async (id: number, action: 'approve' | 'reject') => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/admin/system-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reviewNote: `Reviewed by Super Admin` })
      });
      if (res.ok) {
        const updated = await apiFetch(`${API_BASE_URL}/admin/system-requests`);
        if (updated.ok) {
          const data = await updated.json();
          setSystemRequests(data.data || []);
        }
      }
    } catch (err) {
      console.error('Error reviewing request:', err);
    }
  };

  const currentStats = statsData ? [
    { label: 'Active Users', value: statsData.activeUsers?.toString() || '0', change: '', trend: '', color: 'success', sparkData: [12, 19, 14, 22, 18, 25, 20] },
    { label: 'Total Companies', value: statsData.totalCompanies?.toString() || '0', change: '', trend: '', color: 'info', sparkData: [10, 15, 18, 14, 22, 16, 24] },
    { label: 'System Uptime', value: `${statsData.systemUptime || 100}%`, change: '', trend: '', color: 'warn', sparkData: [20, 22, 21, 23, 24, 22, 25] },
    { label: 'Active Security Alerts', value: statsData.activeSecurityAlerts?.toString() || '0', change: '', trend: '', color: 'danger', sparkData: [] },
  ] : STATS;

  const barLabels = chartData?.activity?.map((a: any) => new Date(a.date).toLocaleDateString()) || BAR_LABELS;
  const barValues = chartData?.activity?.map((a: any) => parseInt(a.count)) || BAR_VALUES;

  const barData = {
    labels: barLabels,
    datasets: [{
      label: t('Activity'),
      data: barValues,
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.5,
      categoryPercentage: 0.7,
    }],
  };

  const barOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#334155' : '#1e293b',
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 11, weight: 600 }, color: isDark ? '#94a3b8' : '#64748b' },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 11, weight: 600 }, color: isDark ? '#94a3b8' : '#64748b' },
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' },
        border: { display: false },
      },
    },
    animation: { duration: 1000, easing: 'easeOutQuart' as const },
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.welcomeTitle}>{t("Hello,")} {user?.name || 'Admin'}</h1>
            <p className={styles.welcomeSub}>{t("Following Is Your Organization's Performance Summary")}</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.actionIcon} onClick={toggleTheme}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div className={styles.actionIcon}><Bell size={20} /></div>
            <div className={styles.userPill}>
              <div className={styles.avatarCircle}>{user?.name?.[0]?.toUpperCase() || 'A'}</div>
              <span className={styles.userName}>{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* KPI Cards */}
        <div className={styles.statsRow}>
          {currentStats.map((stat, i) => (
            <div key={i} className={`${styles.statCard} ${stat.color === 'danger' ? styles.statCardDanger : ''}`}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>{t(stat.label)}</span>
                {stat.change && (
                  <span className={`${styles.statBadge} ${styles[stat.color]}`}>
                    {stat.change} {stat.trend === 'up' && <ArrowUpRight size={10} />}
                  </span>
                )}
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              {stat.sparkData.length > 0 && <SparkLine data={stat.sparkData} color={stat.color} />}
            </div>
          ))}
        </div>

        {/* Chart + Controls */}
        <div className={styles.chartControlsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartWrapper}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className={styles.controlsCard}>
            <div>
              <div className={styles.controlHeader}>
                <MousePointer2 size={16} className={styles.controlIcon} />
                <span className={styles.controlTitle}>{t("Quick Controls")}</span>
              </div>
              <p className={styles.controlSub}>{t("Quick Access To Critical Functions")}</p>
            </div>
            <div className={styles.controlBox}>
              <span className={styles.controlLabel}>{t("Maintenance Mode")}</span>
              <p className={styles.controlDesc}>{t("Disable External User Access")}</p>
              <div
                className={`${styles.toggleTrack} ${maintenanceOn ? styles.toggleOn : ''}`}
                onClick={handleToggleMaintenance}
              >
                <div className={styles.toggleThumb} />
              </div>
            </div>
          </div>
        </div>

        {/* Add Admin Form */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div>
              <h2 className={styles.formTitle}>{t("Add New Admin")}</h2>
              <p className={styles.formSub}>{t("Invite A New Member To Join The Dashboard With Specific Permissions")}</p>
            </div>
            <span className={styles.exclusiveBadge}>{t("Exclusive Access")}</span>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{t("Full Name")}</label>
              <input type="text" className={styles.inputField} placeholder={t("Full Name")} value={newAdminName} onChange={e => setNewAdminName(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{t("Email Address")}</label>
              <input type="email" className={styles.inputField} placeholder="admin@jobito.com" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>{t("Password")}</label>
              <input type="password" className={styles.inputField} placeholder={t("Password")} value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} />
            </div>
            <button className={styles.submitBtn} onClick={handleInviteAdmin}>{t("Send invitation")}</button>
          </div>
        </div>

        {/* System Requests */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <div>
              <h2 className={styles.formTitle}>{t("Pending System Requests")}</h2>
              <p className={styles.formSub}>{t("Review Requests From Operations Managers")}</p>
            </div>
          </div>
          <div className={styles.tableBody}>
            {systemRequests.length === 0 ? (
              <p className={styles.emptyRequests}>{t("No pending requests")}</p>
            ) : (
              systemRequests.map((req, i) => (
                <div key={i} className={styles.requestItem}>
                  <div className={styles.requestInfo}>
                    <div className={styles.requestTitle}>{req.requestType} - {req.candidateName}</div>
                    <div className={styles.requestSub}>{req.candidateEmail} | {req.description}</div>
                    <div className={styles.requestMeta}>
                      {t("From")}: {req.requesterName} | {new Date(req.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className={styles.requestActions}>
                      <button className={styles.approveBtn} onClick={() => handleReviewRequest(req.requestId, 'approve')}>
                        {t("Approve")}
                      </button>
                      <button className={styles.rejectBtn} onClick={() => handleReviewRequest(req.requestId, 'reject')}>
                        {t("Reject")}
                      </button>
                    </div>
                  )}
                  {req.status !== 'pending' && (
                    <span className={`${styles.statBadge} ${req.status === 'approved' ? styles.success : styles.danger}`}>
                      {t(req.status)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
