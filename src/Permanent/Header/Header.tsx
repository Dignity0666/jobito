import { useState, useMemo } from "react";
import { NavBar } from "../../Subject to/Header/NavBar/NavBar";
import styles from "./Header.module.css";
import { HeaderActions } from "../../Subject to/Header/HeaderActions/HeaderActions";
import { Logo } from "../../Subject to/Header/Logo/Logo";
import { HeaderActionscompany } from "../../Subject to/Header/HeaderActionscompany/HeaderActionscompany";
import { useJobitoAuth } from "../../context/LinkContxt";
import { Logocompany } from "../../Subject to/Header/Logocompany/Logocompany";
import { useTranslation } from "../../context/translation-context";

export function Header() {
  const { isAuthenticated, user, role } = useJobitoAuth();
  const { language, setLanguage, t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const guestNavLinks = useMemo(() => [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.find_jobs"), path: "/Find Jobs" },
    { label: t("nav.companies"), path: "/Browse Companies" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.contact"), path: "/contact" },
  ], [t]);

  const authNavLinks = useMemo(() => [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.find_jobs"), path: "/Find Jobs" },
    { label: t("nav.dashboard"), path: "/JobDashboard" },
    { label: t("nav.companies"), path: "/Browse Companies" },
    { label: t("nav.profile"), path: "/Profile" },
    { label: t("dashboard.total_applied"), path: "/MyApplications" },
    { label: t("nav.messaging"), path: "/Messagingapp" },
    { label: t("nav.contact"), path: "/contact" },
  ], [t]);

  const navLinkscompany = useMemo(() => [
    { label: t("nav.home"), path: "/home" },
    { label: t("nav.messaging"), path: "/Messagingapp" },
    { label: t("nav.profile"), path: "/Profile" },
    { label: t("profile.experience"), path: "/JobListing" },
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
            <button className={styles.langBtn} onClick={toggleLanguage}>
              <i className="fas fa-globe"></i>
              <span>{language === "ar" ? "English" : "العربية"}</span>
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
            <button className={styles.langBtn} onClick={toggleLanguage}>
              <i className="fas fa-globe"></i>
              <span>{language === "ar" ? "English" : "العربية"}</span>
            </button>
            <HeaderActionscompany />
          </div>
        </header>
      )}
    </>
  );
}
