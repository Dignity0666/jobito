import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdmin/SuperAdmin';
import OpsManagerDashboard from './OpsManager/OpsManager';
import UserManagement from './UserManagement/UserManagement';
import SupportDashboard from './Support/SupportDashboard';
import ContentManagement from './Content/ContentManagement';
import CompanyReview from './CompanyReview/CompanyReview';
import { useJobitoAuth } from '../../context/LinkContxt';
import { useTranslation } from '../../context/translation-context';
import { useTheme } from '../../context/ThemeContext';
import styles from './Admin.module.css';

/**
 * Main Admin Entry Point
 * This component handles switching between all Admin dashboard modules.
 * It also protects the route and ensures only authorized admins can enter.
 */
const Admin: React.FC = () => {
  const { isAuthenticated, role, logout } = useJobitoAuth();
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const userAdminRole = useJobitoAuth().user?.adminRole;

  const [adminRole, setAdminRole] = useState<'SUPER_ADMIN' | 'OPERATIONS_MANAGER' | 'USER_MANAGEMENT' | 'SUPPORT' | 'CONTENT' | 'COMPANY_REVIEW'>(
    userAdminRole === 'super_admin' ? 'SUPER_ADMIN' : 'OPERATIONS_MANAGER'
  );

  // If context hasn't caught up yet, check the token in localStorage directly
  if (!isAuthenticated || role !== 'admin') {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.role === 'admin' && decoded.exp && decoded.exp * 1000 > Date.now()) {
          return (
            <div className={styles.loadingScreen}>
              <div className={styles.spinner} />
              {t("Loading Admin Dashboard...")}
            </div>
          );
        }
      } catch { /* invalid token */ }
    }
    navigate('/');
    return null;
  }

  const allNavItems = [
    { id: 'SUPER_ADMIN', label: t("Super Admin"), role: 'super_admin' },
    { id: 'OPERATIONS_MANAGER', label: t("Operations"), role: 'operation_manager' },
    { id: 'USER_MANAGEMENT', label: t("User Mgmt"), role: 'operation_manager' },
    { id: 'SUPPORT', label: t("Support"), role: 'operation_manager' },
    { id: 'CONTENT', label: t("Content"), role: 'operation_manager' },
    { id: 'COMPANY_REVIEW', label: t("Company Review"), role: 'operation_manager' },
  ];

  const navItems = allNavItems.filter(item => item.role === userAdminRole);

  return (
    <div className={`${styles.layout} ${isDark ? styles.dark : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <nav className={styles.adminNav}>
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setAdminRole(item.id as any)}
            className={`${styles.navTab} ${adminRole === item.id ? styles.navTabActive : ''}`}
          >
            {item.label}
          </button>
        ))}
        
        <div className={styles.navDivider} />
        
        <button className={styles.logoutBtn} onClick={logout}>
          {t("Logout")}
        </button>
      </nav>

      {/* Render the appropriate dashboard based on role */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {adminRole === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {adminRole === 'OPERATIONS_MANAGER' && <OpsManagerDashboard />}
        {adminRole === 'USER_MANAGEMENT' && <UserManagement />}
        {adminRole === 'SUPPORT' && <SupportDashboard />}
        {adminRole === 'CONTENT' && <ContentManagement />}
        {adminRole === 'COMPANY_REVIEW' && <CompanyReview />}
      </div>
    </div>
  );
};

export default Admin;
