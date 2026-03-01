import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BorderAnimatedContainer from "../../Subject to/User Information/BorderAnimatedContainer";
import "./User_Information.css";

import LoginPage from "../../Subject to/User Information/Login/Login";
import UI from "../../Subject to/User Information/CreateAcont/Up/UP";


export const UserInformation: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);

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
    <div className="user-info-wrapper">
      <div className="user-info-container">
        <BorderAnimatedContainer>
          <AnimatePresence>
            {!showLogin && (
              <motion.button
                key="signin-btn"
                className="sign-in-btn"
                onClick={toggleLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Sign In
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showLogin ? (
              <motion.div
                key="login"
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full h-full"
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
                className="w-full h-full"
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full h-full"
                >
                  <UI setShowLogin={setShowLogin} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
};
