import { useState } from "react";
import { NavBar } from "../../Subject to/Header/NavBar/NavBar";
import styles from "./Header.module.css";
import { HeaderActions } from "../../Subject to/Header/HeaderActions/HeaderActions";
import { Logo } from "../../Subject to/Header/Logo/Logo";
import { HeaderActionscompany } from "../../Subject to/Header/HeaderActionscompany/HeaderActionscompany";
import { useJobitoAuth } from "../../context/AuthContext";
import { Logocompany } from "../../Subject to/Header/Logocompany/Logocompany";

const guestNavLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "ابحث عن وظيفة", path: "/Find Jobs" },
  { label: "الشركات", path: "/Browse Companies" },
  { label: "من نحن", path: "/about" },
  { label: "اتصل بنا", path: "/contact" },
];

const authNavLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "ابحث عن وظيفة", path: "/Find Jobs" },
  { label: "اللوحة الرئيسية", path: "/JobDashboard" },
  { label: "الشركات", path: "/Browse Companies" },
  { label: "الملف الشخصي", path: "/Profile" },
  { label: "إجمالي الوظائف المتقدم لها", path: "/MyApplications" },
  { label: "الرسائل", path: "/Messagingapp" },
  { label: "اتصل بنا", path: "/contact" },
];

const navLinkscompany = [
  { label: "الرئيسية", path: "/home" },
  { label: "الرسائل", path: "/Messagingapp" },
  { label: "الملف الشخصي", path: "/Profile" },
  { label: "الوظائف", path: "/JobListing" },
  // { label: "اللوحة الرئيسية", path: "/Help" },
];

export function Header() {
  const { isAuthenticated, user, role } = useJobitoAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinksuser = isAuthenticated ? authNavLinks : guestNavLinks;
  const showNever = role !== "company";



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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <HeaderActionscompany />
          </div>
        </header>
      )}
    </>
  );
}
