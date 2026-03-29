import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./AccountSecurity.module.css";
import { useJobitoAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function AccountSecurity() {
  const { user, apiFetch } = useJobitoAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingEmail(true);
      const res = await apiFetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("فشل في تحديث البريد الإلكتروني.");
      alert("تم تحديث البريد الإلكتروني بنجاح!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      setIsSavingPass(true);
      const res = await apiFetch(`${API_BASE_URL}/users/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      if (!res.ok) throw new Error("فشل في تحديث كلمة المرور. تأكد من كلمة المرور الحالية.");
      alert("تم تحديث كلمة المرور بنجاح!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingPass(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Account Security</h1>
          <p>Manage your email address and password to keep your account secure.</p>
        </header>

        <section className={styles.section}>
          <div className={styles.sectionInfo}>
            <h2>Email Address</h2>
            <p>Update your email address to receive notifications and recover your account.</p>
          </div>
          <form className={styles.form} onSubmit={handleUpdateEmail}>
            <div className={styles.field}>
              <label>Current Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email@example.com"
                required
              />
            </div>
            <div className={styles.formFooter}>
              <motion.button 
                type="submit" 
                className={styles.saveBtn}
                disabled={isSavingEmail}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSavingEmail ? "Updating..." : "Update Email"}
              </motion.button>
            </div>
          </form>
        </section>

        <div className={styles.divider} />

        <section className={styles.section}>
          <div className={styles.sectionInfo}>
            <h2>Change Password</h2>
            <p>We recommend using a strong password that you don't use elsewhere.</p>
          </div>
          <form className={styles.form} onSubmit={handleUpdatePassword}>
            <div className={styles.field}>
              <label>Current Password</label>
              <input 
                type="password" 
                value={passwords.current} 
                onChange={(e) => setPasswords({...passwords, current: e.target.value})} 
                placeholder="••••••••"
                required
              />
            </div>
            <div className={styles.field}>
              <label>New Password</label>
              <input 
                type="password" 
                value={passwords.new} 
                onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                placeholder="••••••••"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={passwords.confirm} 
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} 
                placeholder="••••••••"
                required
              />
            </div>
            <div className={styles.formFooter}>
              <motion.button 
                type="submit" 
                className={styles.saveBtn}
                disabled={isSavingPass}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSavingPass ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
