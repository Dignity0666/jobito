import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProfileSettings.module.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/* ─── Tab types ──────────────────────────────── */
type Tab = "profile" | "login" | "notifications";

/* ─── Tiny SVG icons ─────────────────────────── */
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#26a4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ─── Tab variants ───────────────────────────── */
const tabVariants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

/* ═══════════════════════════════════════════════
   MY PROFILE TAB
═══════════════════════════════════════════════ */
function MyProfileTab({ user }: { user?: { name?: string; email?: string; avatar?: string; phone?: string } | null }) {
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [accountType, setAccountType] = useState<"jobseeker" | "employer">("jobseeker");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.avatar) setAvatar(user.avatar);
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No secure token found. Please log in again.");

      // 1. Handle image upload if a new file was selected
      let finalAvatarUrl = avatar;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch(`${API_BASE_URL}/images/profile`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (uploadRes.ok) {
          const imgData = await uploadRes.json();
          finalAvatarUrl = imgData.image_url;
          // Prepend base URL if it's a relative path
          if (finalAvatarUrl && finalAvatarUrl.startsWith("/")) {
            finalAvatarUrl = API_BASE_URL + finalAvatarUrl;
          }
        }
      }

      // 2. Save other profile details
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: name,
          email,
          phone,
          avatar_url: finalAvatarUrl
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const responseData = await res.json();
      if (responseData.access_token) {
        localStorage.setItem("token", responseData.access_token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>Basic Information</h2>
        <p>This is your personal information that you can update anytime.</p>
      </div>

      {/* Profile Photo */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>Profile Photo</strong>
          <span>This image will be shown publicly as your profile picture. It will help recruiters recognize you!</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.photoRow}>
            <div className={styles.avatarPreview}>
              {avatar
                ? <img src={avatar} alt="avatar" />
                : <div className={styles.avatarPlaceholder}>J</div>}
            </div>
            <motion.div
              className={styles.uploadZone}
              whileHover={{ borderColor: "#26a4ff", background: "#f0f8ff" }}
              onClick={() => fileRef.current?.click()}
            >
              <UploadIcon />
              <p><span className={styles.uploadLink}>Click to replace</span> or drag and drop</p>
              <span>SVG, PNG, JPG or GIF (max. 400 × 400px)</span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            </motion.div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Personal Details */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>Personal Details</strong>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.fieldFull}>
            <label>Full Name <span className={styles.req}>*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
          </div>
          <div className={styles.fieldGrid}>
            <div>
              <label>Phone Number <span className={styles.req}>*</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
            </div>
            <div>
              <label>Email <span className={styles.req}>*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div>
              <label>Date of Birth <span className={styles.req}>*</span></label>
              <input type="date" defaultValue="1997-09-08" />
            </div>
            <div>
              <label>Gender <span className={styles.req}>*</span></label>
              <select defaultValue="male">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Account Type */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>Account Type</strong>
          <span>You can update your account type</span>
        </div>
        <div className={styles.rowContent}>
          {[
            { id: "jobseeker", label: "Job Seeker", desc: "Looking for a job" },
            { id: "employer", label: "Employer", desc: "Hiring, sourcing candidates, or posting a jobs" },
          ].map((opt) => (
            <motion.label
              key={opt.id}
              className={`${styles.radioCard} ${accountType === opt.id ? styles.radioActive : ""}`}
              whileHover={{ x: 3 }}
            >
              <input
                type="radio"
                name="accountType"
                value={opt.id}
                checked={accountType === opt.id as "jobseeker" | "employer"}
                onChange={() => setAccountType(opt.id as "jobseeker" | "employer")}
              />
              <div>
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <div className={styles.saveRow}>
        <motion.button className={styles.saveBtn}
          onClick={handleSaveProfile}
          disabled={isSaving}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(38,164,255,0.35)" }}
          whileTap={{ scale: 0.97 }}>
          {isSaving ? "Saving..." : "Save Profile"}
        </motion.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN DETAILS TAB
═══════════════════════════════════════════════ */
function LoginDetailsTab({ user }: { user?: { name?: string; email?: string; avatar?: string; phone?: string } | null }) {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [isClosingInfo, setIsClosingInfo] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail) return alert("Please enter a new email");
    try {
      setIsUpdatingEmail(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update email");
      }
      alert("Email updated successfully! Please log in again.");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return alert("Please enter both passwords");
    try {
      setIsChangingPwd(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to change password");
      }
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsChangingPwd(false);
    }
  };

  const handleCloseAccount = async () => {
    if (!window.confirm("Are you sure you want to continuously close your account? This action cannot be undone.")) return;
    try {
      setIsClosingInfo(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to close account");

      alert("Account closed successfully.");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (err: any) {
      alert(err.message);
      setIsClosingInfo(false);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>Basic Information</h2>
        <p>This is login information that you can update anytime.</p>
      </div>

      {/* Update Email */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>Update Email</strong>
          <span>Update your email address to make sure it is safe</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.verifiedEmail}>
            <span>{user?.email || "No email provided"}</span>
            <CheckIcon />
            <small>Your email address is verified.</small>
          </div>
          <div className={styles.fieldFull}>
            <label>Update Email</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter your new email" />
          </div>
          <motion.button className={styles.saveBtn}
            onClick={handleUpdateEmail}
            disabled={isUpdatingEmail}
            whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(38,164,255,0.35)" }}
            whileTap={{ scale: 0.97 }}>
            {isUpdatingEmail ? "Updating..." : "Update Email"}
          </motion.button>
        </div>
      </div>

      <div className={styles.divider} />

      {/* New Password */}
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>New Password</strong>
          <span>Manage your password to make sure it is safe</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.fieldFull}>
            <label>Old Password</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter your old password" />
            <small className={styles.hint}>Minimum 8 characters</small>
          </div>
          <div className={styles.fieldFull}>
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter your new password" />
            <small className={styles.hint}>Minimum 8 characters</small>
          </div>
          <motion.button className={styles.saveBtn}
            onClick={handleChangePassword}
            disabled={isChangingPwd}
            whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(38,164,255,0.35)" }}
            whileTap={{ scale: 0.97 }}>
            {isChangingPwd ? "Changing..." : "Change Password"}
          </motion.button>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Close Account */}
      <div className={styles.closeAccountRow}>
        <motion.button className={styles.closeAccountBtn}
          onClick={handleCloseAccount}
          disabled={isClosingInfo}
          whileHover={{ color: "#dc2626" }}
          whileTap={{ scale: 0.97 }}>
          {isClosingInfo ? "Closing..." : "Close Account"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NOTIFICATIONS TAB
═══════════════════════════════════════════════ */
const notifItems = [
  { id: "applications", label: "Applications", desc: "These are notifications for jobs that you have applied to", default: true },
  { id: "jobs", label: "Jobs", desc: "These are notifications for job openings that suit your profile", default: false },
  { id: "recs", label: "Recommendations", desc: "These are notifications for personalized recommendations from our recruiters", default: false },
];

function NotificationsTab({ user }: { user?: { name?: string; email?: string; avatar?: string; notification_preferences?: any } | null }) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    user?.notification_preferences || Object.fromEntries(notifItems.map((n) => [n.id, n.default]))
  );
  const [isSavingNotifs, setIsSavingNotifs] = useState(false);

  useEffect(() => {
    if (user?.notification_preferences) {
      setChecked(user.notification_preferences);
    }
  }, [user]);

  const handleSaveNotifs = async () => {
    try {
      setIsSavingNotifs(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ notification_preferences: checked }),
      });
      if (!res.ok) throw new Error("Failed to save preferences");

      const responseData = await res.json();
      if (responseData.access_token) {
        localStorage.setItem("token", responseData.access_token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      alert("Notification preferences saved successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingNotifs(false);
    }
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionHeader}>
        <h2>Basic Information</h2>
        <p>This is notifications preferences that you can update anytime.</p>
      </div>

      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <strong>Notifications</strong>
          <span>Customize your preferred notification settings</span>
        </div>
        <div className={styles.rowContent}>
          {notifItems.map((item) => (
            <motion.label
              key={item.id}
              className={styles.checkCard}
              whileHover={{ x: 3 }}
            >
              <input
                type="checkbox"
                checked={checked[item.id]}
                onChange={() => setChecked((p) => ({ ...p, [item.id]: !p[item.id] }))}
              />
              <div>
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </div>
            </motion.label>
          ))}
          <motion.button className={styles.saveBtn}
            onClick={handleSaveNotifs}
            disabled={isSavingNotifs}
            whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(38,164,255,0.35)" }}
            whileTap={{ scale: 0.97 }}>
            {isSavingNotifs ? "Saving..." : "Save Preferences"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings({ user }: { user?: { name?: string; email?: string; avatar?: string; phone?: string; notification_preferences?: any } | null }) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "My Profile" },
    { id: "login", label: "Login Details" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <div className={styles.page}>
      {/* Tab bar */}
      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div className={styles.tabUnderline} layoutId="tabUnderline"
                transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {activeTab === "profile" && <MyProfileTab user={user} />}
          {activeTab === "login" && <LoginDetailsTab user={user} />}
          {activeTab === "notifications" && <NotificationsTab user={user} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}