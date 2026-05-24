import { useState, useMemo } from "react";
import { NavBar } from "../../Subject to/Header/NavBar/NavBar";
import styles from "./Header.module.css";
import { HeaderActions } from "../../Subject to/Header/HeaderActions/HeaderActions";
import { Logo } from "../../Subject to/Header/Logo/Logo";
import { HeaderActionscompany } from "../../Subject to/Header/HeaderActionscompany/HeaderActionscompany";
import { useJobitoAuth } from "../../context/LinkContxt";
import { Logocompany } from "../../Subject to/Header/Logocompany/Logocompany";
import { useTranslation } from "../../context/translation-context";
import { useTheme } from "../../context/ThemeContext";
import SidebarMenu from "../../Basic/SidebarMenu/SidebarMenu";
import {
  Home,
  Search,
  Building2,
  Info,
  Mail,
  LayoutDashboard,
  UserCircle,
  FileText,
  MessageSquare,
  List,
  Plus,
  Moon,
  Sun,
  Menu,
  Star,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

export function Header() {
  const { isAuthenticated, user, role } = useJobitoAuth();
  const { language, setLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const guestNavLinks = useMemo(() => [
    { label: t("الرئيسية"), path: "/", icon: <Home size={16} /> },
    { label: t("بحث عن وظائف"), path: "/Find Jobs", icon: <Search size={16} /> },
    { label: t("تصفح الشركات"), path: "/Browse Companies", icon: <Building2 size={16} /> },
    { label: t("عن المنصة"), path: "/about", icon: <Info size={16} /> },
    { label: t("اتصل بنا"), path: "/contact", icon: <Mail size={16} /> },
  ], [t]);

  const authNavLinks = useMemo(() => [
    { label: t("الرئيسية"), path: "/", icon: <Home size={16} /> },
    { label: t("بحث عن وظائف"), path: "/Find Jobs", icon: <Search size={16} /> },
    { label: t("لوحة التحكم"), path: "/JobDashboard", icon: <LayoutDashboard size={16} /> },
    { label: t("تصفح الشركات"), path: "/Browse Companies", icon: <Building2 size={16} /> },
    { label: t("الملف الشخصي"), path: "/Profile", icon: <UserCircle size={16} /> },
    { label: t("الرسائل"), path: "/chat", icon: <MessageSquare size={16} /> },
  ], [t]);

  const navLinkscompany = useMemo(() => [
    { label: t("الرئيسية"), path: "/home", icon: <Home size={16} /> },
    { label: t("التقييمات"), path: "/CompanyRatings", icon: <Star size={16} /> },
    { label: t("الرسائل"), path: "/chat", icon: <MessageSquare size={16} /> },
    { label: t("الملف الشخصي"), path: "/Profile", icon: <UserCircle size={16} /> },
    { label: t("قائمة الوظائف"), path: "/JobListing", icon: <List size={16} /> },
  ], [t]);

  const navLinkstradesman = useMemo(() => [

    { label: t("الرئيسية"), path: "/", icon: <Home size={16} /> },
    { label: t("البحث عن عمل"), path: "/Find Jobs", icon: <Search size={16} /> },
    { label: t("الوظائف"), path: "/JobListing", icon: <List size={16} /> },
    { label: t("التقييمات"), path: "/CompanyRatings", icon: <Star size={16} /> },
    { label: t("تصفح الشركات"), path: "/Browse Companies", icon: <Building2 size={16} /> },
    { label: t("الملف الشخصي"), path: "/Profile", icon: <UserCircle size={16} /> },
    { label: t("الدردشة"), path: "/chat", icon: <MessageSquare size={16} /> },
  ], [t]);

  const adminNavLinks = useMemo(() => [
    { label: t("الرئيسية"), path: "/", icon: <Home size={16} /> },
    { label: t("لوحة الإدارة"), path: "/admin", icon: <ShieldCheck size={16} /> },
    { label: t("الرسائل"), path: "/chat", icon: <MessageSquare size={16} /> },
    { label: t("الملف الشخصي"), path: "/Profile", icon: <UserCircle size={16} /> },
  ], [t]);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navLinksuser = isAuthenticated 
    ? (role === "admin" ? adminNavLinks : (user?.classification === "tradesman" ? navLinkstradesman : authNavLinks)) 
    : guestNavLinks;
  const navLinks = role === "company" ? navLinkscompany : navLinksuser;

  const isDarkHeader = role === "company";
  const LogoComponent = role === "company" ? Logocompany : Logo;
  const HeaderActionsComponent = role === "company" ? HeaderActionscompany : HeaderActions;

  return (
    <>
      <motion.header 
        className={isDarkHeader ? styles.rootcompany : styles.rootUser}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className={styles.leftSection}>
          <motion.div 
            className={styles.logoSection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
          >
            {isAuthenticated && role !== "company" && (
              <SidebarMenu />
            )}
            <LogoComponent />
          </motion.div>
          <NavBar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            navLinks={navLinks}
          />
        </div>
        
        <motion.div 
          className={styles.rightSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
        >
          <button
            className={styles.themeToggleBtn}
            onClick={toggleTheme}
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className={styles.langBtn} onClick={toggleLanguage} title={language === "ar" ? "English" : "العربية"}>
            <span>{language === "ar" ? "EN" : "AR"}</span>
          </button>
          {role === "company" ? (
            <HeaderActionscompany />
          ) : (
            <HeaderActions isAuthenticated={isAuthenticated} user={user} />
          )}
        </motion.div>
      </motion.header>
    </>
  );
}
