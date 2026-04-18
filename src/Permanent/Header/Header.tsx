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
  Moon,
  Sun,
} from "lucide-react";

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
    { label: t("الرسائل"), path: "/Messagingapp", icon: <MessageSquare size={16} /> },
  ], [t]);

  const navLinkscompany = useMemo(() => [
    { label: t("الرئيسية"), path: "/home", icon: <Home size={16} /> },
    { label: t("الرسائل"), path: "/Messagingapp", icon: <MessageSquare size={16} /> },
    { label: t("الملف الشخصي"), path: "/Profile", icon: <UserCircle size={16} /> },
    { label: t("قائمة الوظائف"), path: "/JobListing", icon: <List size={16} /> },
  ], [t]);

  const navLinksuser = isAuthenticated ? authNavLinks : guestNavLinks;
  const showNever = role !== "company";

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <>
      {showNever ? (
        <header className={styles.rootUser}>
          <Logo />
          <NavBar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            navLinks={navLinksuser}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {isAuthenticated && role === "student" && <SidebarMenu />}
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
            <HeaderActions isAuthenticated={isAuthenticated} user={user} />
          </div>
        </header>
      ) : (
        <header className={styles.rootcompany}>
          <Logocompany />
          <NavBar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            navLinks={navLinkscompany}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
            <HeaderActionscompany />
          </div>
        </header>
      )}
    </>
  );
}
