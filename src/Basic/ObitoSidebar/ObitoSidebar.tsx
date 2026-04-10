import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useJobitoAuth } from "../../context/LinkContxt";
import { useTranslation } from "../../context/translation-context";
import styles from "./ObitoSidebar.module.css";
import LogoIMG from "../../assets/412ec68f361b4f49b52fb8d584c317ccf197a403.png";

interface ObitoSidebarProps {
  setshowObitoSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MessageIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ApplicationIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HelpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const navItems = [
  { id: "home", label: "الرئيسية", icon: HomeIcon, route: "/JobDashboard" },
  {
    id: "messages",
    label: "الرسائل",
    icon: MessageIcon,
    route: "/Messagingapp",
    badge: 1,
  },
  {
    id: "applications",
    label: "طلباتي",
    icon: ApplicationIcon,
    route: "/MyApplications",
  },
  {
    id: "profile",
    label: "ملفي الشخصي",
    icon: UserIcon,
    route: "/ProfilePage",
  },
];

const navItemscompany = [
  {
    id: "home",
    label: "الرئيسية",
    icon: HomeIcon,
    route: "/company-home",
  },
  {
    id: "post-job",
    label: "نشر وظيفة",
    icon: ApplicationIcon,
    route: "/PostJob",
  },
  {
    id: "messages",
    label: "الرسائل",
    icon: MessageIcon,
    route: "/Messagingapp",
    badge: 1,
  },
  {
    id: "job-listings",
    label: "وظائفي",
    icon: ApplicationIcon,
    route: "/JobListing",
  },
  {
    id: "applicants",
    label: "المتقدمون",
    icon: UserIcon,
    route: "/Applicants",
  },
];

const settingsItems = [
  { id: "help", label: "مركز المساعدة", icon: HelpIcon, route: "/Help" },
];

const sidebarVariants: Variants = {
  hidden: { x: -280, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.45, duration: 0.4, ease: "easeOut" },
  },
};

export const ObitoSidebar: React.FC<ObitoSidebarProps> = ({
  setshowObitoSidebar,
}) => {
  const { role, user } = useJobitoAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (route: string) => location.pathname === route;
  const handleNav = (route: string) => navigate(route);
  const handleClose = () => {
    setIsOpen(false);
    setshowObitoSidebar(false);
  };

  const currentNavItems = role === "company" ? navItemscompany : navItems;

  return (
    <div className={(styles as any).wrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={(styles as any).sidebar}
            variants={sidebarVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className={(styles as any).topSection}>
              <div className={(styles as any).header}>
                <motion.div
                  className={(styles as any).logo}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                >
                  <img src={LogoIMG} alt="Jobito" className="hdr-logo-img" />
                </motion.div>

                <motion.button
                  className={(styles as any).closeBtn}
                  onClick={handleClose}
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  <CloseIcon />
                </motion.button>
              </div>

              <motion.ul
                className={(styles as any).navList}
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {currentNavItems.map(
                  ({ id, label, icon: Icon, badge, route }) => {
                    const active = isActive(route);
                    return (
                      <motion.li
                        key={id}
                        variants={itemVariants}
                        className={`${(styles as any).navItem} ${active ? (styles as any).active : ""}`}
                        onClick={() => handleNav(route)}
                        whileHover={
                          !active
                            ? { x: 5, backgroundColor: "rgba(255,255,255,0.1)" }
                            : {}
                        }
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        {active && (
                          <motion.span
                            className={(styles as any).activeBar}
                            layoutId="activeBar"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}

                        <span className={(styles as any).navIcon}>
                          <Icon />
                        </span>
                        <span className={(styles as any).navLabel}>{t(label)}</span>

                        {badge && (
                          <motion.span
                            className={(styles as any).badge}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 14,
                              delay: 0.3,
                            }}
                          >
                            {badge}
                          </motion.span>
                        )}
                      </motion.li>
                    );
                  },
                )}
              </motion.ul>
            </div>

            <div className={(styles as any).bottomSection}>
              <motion.ul
                className={(styles as any).navList}
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {settingsItems.map(({ id, label, icon: Icon, route }) => {
                  const active = isActive(route);
                  return (
                    <motion.li
                      key={id}
                      variants={itemVariants}
                      className={`${(styles as any).navItem} ${active ? (styles as any).active : ""}`}
                      onClick={() => handleNav(route)}
                      whileHover={
                        !active
                          ? { x: 5, backgroundColor: "rgba(255,255,255,0.1)" }
                          : {}
                      }
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {active && (
                        <motion.span
                          className={(styles as any).activeBar}
                          layoutId="activeBarSettings"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className={(styles as any).navIcon}>
                        <Icon />
                      </span>
                      <span className={(styles as any).navLabel}>{t(label)}</span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>

            <motion.div
              className={(styles as any).footer}
              variants={footerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div
                className={(styles as any).avatar}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                <div className={(styles as any).avatarInner}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" />
                  ) : (
                    user?.name?.[0] || "U"
                  )}
                </div>
              </motion.div>
              <div className={(styles as any).userInfo}>
                <div className={(styles as any).userName}>
                  {user?.name || t("الملف الشخصي")}
                </div>
                <div className={(styles as any).userEmail}>
                  {user?.email || "user@example.com"}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ObitoSidebar;
