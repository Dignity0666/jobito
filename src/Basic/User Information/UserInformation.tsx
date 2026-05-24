import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import BorderAnimatedContainer from "../../Subject to/User Information/BorderAnimatedContainer";
import styles from "./User_Information.module.css";
import { useTranslation } from "../../context/translation-context";

import LoginPage from "../../Subject to/User Information/Login/Login";
import UI from "../../Subject to/User Information/CreateAcont/Up/UP";

export const UserInformation: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isCustomer, setIsCustomer] = useState(true);
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.showLogin !== undefined) setShowLogin(location.state.showLogin);
      if (location.state.isCustomer !== undefined) setIsCustomer(location.state.isCustomer);
    }
  }, [location.state]);

  const toggleLogin = () => setShowLogin(!showLogin);

  const pageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.4 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>JOBITO</div>
        <div className={styles.headerActions}>
          {!showLogin && (
            <>
              <button 
                className={styles.outlineBtn} 
                onClick={() => setIsCustomer(!isCustomer)}
              >
                {isCustomer ? t("صاحب عمل؟ حساب شركة") : t("مستخدم؟ حساب شخصي")}
              </button>
              <button className={styles.primaryBtn} onClick={toggleLogin}>
                {t("Login")}
              </button>
            </>
          )}
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.formCard}>

          <AnimatePresence mode="wait">
            {showLogin ? (
              <motion.div
                key="login"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ width: "100%" }}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ width: "100%" }}
                >
                  <LoginPage setShowLogin={setShowLogin} />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ width: "100%" }}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ width: "100%" }}
                >
                  <UI setShowLogin={setShowLogin} isCustomer={isCustomer} setIsCustomer={setIsCustomer} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className={styles.footer}>
        Copyright @Jobito 2026 | Privacy Policy
      </footer>
    </div>
  );
};
