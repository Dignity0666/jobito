import { SignUpPage } from "../Customer Account/SignUpPage";
import { CompanyRegister } from "../CustomerAccount/Customer Account";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UIProps {
  setShowLogin: (value: boolean) => void;
}

export default function UI({ setShowLogin }: UIProps) {
  const [isCustomer, setIsCustomer] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isCustomer ? (
        <motion.div
          key="signup"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <SignUpPage
            isCustomer={isCustomer}
            setIsCustomer={setIsCustomer}
            setShowLogin={setShowLogin}
          />
        </motion.div>
      ) : (
        <motion.div
          key="company"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5 }}
        >
          <CompanyRegister
            setIsCustomer={setIsCustomer}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
