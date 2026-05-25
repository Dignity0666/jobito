import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./CompleteProfile.module.css";
import { useJobitoAuth } from "../../context/LinkContxt";
import { useTranslation } from "../../context/translation-context";
import { useToast } from "../../context/ToastContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";



const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة", "الفيوم", "الغربية", "الإسماعيلية", "المنوفية", "المنيا", "القليوبية", "الوادي الجديد", "الشرقية", "السويس", "أسوان", "أسيوط", "بني سويف", "بورسعيد", "دمياط", "جنوب سيناء", "كفر الشيخ", "مطروح", "قنا", "شمال سيناء", "سوهاج", "الأقصر"
];

interface Experience {
  role: string;
  period: string;
}

interface Education {
  school: string;
  degree: string;
  period: string;
}

const UploadIcon = () => (
  <svg
    className={styles.uploadIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default function CompleteProfile() {
  const { t, language, setLanguage } = useTranslation();
  const { user, apiFetch } = useJobitoAuth();
  const navigate = useNavigate();

  // Role state
  const [role, setRole] = useState<"job_seeker" | "tradesman">(
    (localStorage.getItem("signup_classification") as "job_seeker" | "tradesman") || "job_seeker"
  );

  // Profile photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wallpaper
  const [wallpaperPreview, setWallpaperPreview] = useState<string | null>(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState<File | null>(null);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  // Personal Details
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    location: user?.location || "",
  });

  // Validation errors state
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Toast System
  const { showToast } = useToast();

  // About me
  const [bio, setBio] = useState("");

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Education
  const [educations, setEducations] = useState<Education[]>([]);

  // Skills & Languages
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");



  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    website: "",
  });

  // Work Images
  const [workImages, setWorkImages] = useState<string[]>([]);
  const [workImageFiles, setWorkImageFiles] = useState<File[]>([]);
  const workImageRef = useRef<HTMLInputElement>(null);

  // Criminal Record (Tradesman Only)
  const [criminalRecordPreview, setCriminalRecordPreview] = useState<string | null>(null);
  const [selectedCriminalRecord, setSelectedCriminalRecord] = useState<File | null>(null);
  const criminalRecordInputRef = useRef<HTMLInputElement>(null);

  // Services (Tradesman Only)
  const PREDEFINED_SERVICES = ["كهربائي", "فني سباكة", "نجار", "منظف بيوت", "نقاش", "ميكانيكي", "حداد"];
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showServiceInput, setShowServiceInput] = useState(false);
  const [customService, setCustomService] = useState("");

  // Saving
  const [isSaving, setIsSaving] = useState(false);

  // ─── Handlers ─────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedWallpaper(file);
      const reader = new FileReader();
      reader.onloadend = () => setWallpaperPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleWorkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        setWorkImageFiles((prev) => [...prev, file]);
        const reader = new FileReader();
        reader.onloadend = () =>
          setWorkImages((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCriminalRecordUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCriminalRecord(file);
      const reader = new FileReader();
      reader.onloadend = () => setCriminalRecordPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const addExperience = () => {
    setExperiences([...experiences, { role: "", period: "" }]);
  };

  const addEducation = () => {
    setEducations([...educations, { school: "", degree: "", period: "" }]);
  };

  // ─── Save Profile ─────────────────────────────
  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    let isValid = true;

    if (!formData.fullName.trim()) { errors.fullName = true; isValid = false; }
    if (!formData.phone.trim()) { errors.phone = true; isValid = false; }
    if (!formData.email.trim()) { errors.email = true; isValid = false; }
    if (!formData.dob.trim()) { errors.dob = true; isValid = false; }
    if (!formData.gender.trim()) { errors.gender = true; isValid = false; }
    if (!formData.location.trim()) { errors.location = true; isValid = false; }

    if (!bio.trim()) {
      errors.bio = true;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast(t("يرجى إكمال جميع الحقول المطلوبة (المشار إليها بنجمة *) قبل الحفظ."), "error");
      return;
    }

    try {
      setIsSaving(true);

      // Upload avatar
      let avatarUrl = user?.avatar || "";
      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        const uploadRes = await apiFetch(`${API_BASE_URL}/images/profile`, {
          method: "PUT",
          body: fd,
        });
        if (uploadRes.ok) {
          const imgData = await uploadRes.json();
          avatarUrl = imgData.imageUrl || imgData.image_url;
        }
      }

      // Upload banner
      let bannerUrl = "";
      if (selectedWallpaper) {
        const fd = new FormData();
        fd.append("file", selectedWallpaper);
        const uploadRes = await apiFetch(`${API_BASE_URL}/images/banner`, {
          method: "PUT",
          body: fd,
        });
        if (uploadRes.ok) {
          const imgData = await uploadRes.json();
          bannerUrl = imgData.imageUrl || imgData.image_url;
        }
      }

      // Upload Criminal Record
      let criminalRecordUrl = "";
      if (selectedCriminalRecord) {
        const fd = new FormData();
        fd.append("file", selectedCriminalRecord);
        const uploadRes = await apiFetch(`${API_BASE_URL}/images/upload`, {
          method: "POST",
          body: fd,
        });
        if (uploadRes.ok) {
          const imgData = await uploadRes.json();
          criminalRecordUrl = imgData.imageUrl || imgData.image_url;
        }
      }

      // Build update payload
      const updateData: Record<string, unknown> = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        location: formData.location,
        bio,
        socialLinks,
        experiences: experiences,
        educations: educations,
        skills,
        portfolios: workImages,
        avatarUrl: avatarUrl,
        avatar: avatarUrl,
        banner_url: bannerUrl,
        role: "user",
        classification: role,
        services: selectedServices,
        criminalRecordUrl: criminalRecordUrl, 
      };

      const res = await apiFetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const result = await res.json();
      if (result.access_token) {
        localStorage.setItem("token", result.access_token);
        window.dispatchEvent(new Event("auth-changed"));
      }

      localStorage.removeItem("signup_classification");
      localStorage.removeItem("isNewUser");
      navigate("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      showToast(`${t("فشل الحفظ:")} ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Animation Variants ───────────────────────
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className={styles.page}>
      {/* ─── Language Toggle ─────────────────────── */}
      <div className={styles.topActions}>
        <button
          className={styles.langBtn}
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          title={language === "ar" ? "English" : "العربية"}
        >
          {language === "ar" ? "EN" : "AR"}
        </button>
      </div>

      {/* ─── Hero Header ─────────────────────────── */}
      <motion.div
        className={styles.heroHeader}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className={styles.heroTitle}>
          {language === "ar" ? (
            <>
              يمكنك تسجيل الدخول <span className={styles.highlight}>كصنايعي</span>
              <br />
              أو <span className={styles.accentText}>باحث عن عمل</span> مع <span className={styles.brandText}>Jobito</span>
            </>
          ) : (
            <>
              You Can SignIn <span className={styles.highlight}>treadsman</span>
              <br />
              or <span className={styles.accentText}>a job seeker</span> with <span className={styles.brandText}>Jobito</span>
            </>
          )}
          <motion.svg
            className={styles.heroUnderline}
            viewBox="0 0 120 6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
          >
            <motion.path
              d="M2 4 Q 30 0, 60 4 T 118 4"
              stroke="var(--color-accent)"
              fill="transparent"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
            />
          </motion.svg>
        </h1>
      </motion.div>

      {/* ─── Role Switcher ───────────────────────── */}
      <motion.div
        className={styles.roleSwitcher}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          className={`${styles.roleBtn} ${role === "job_seeker" ? styles.roleBtnActive : ""}`}
          onClick={() => setRole("job_seeker")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {language === "ar" ? "باحث عن عمل" : "Job Seeker"}
        </motion.button>

        <span className={styles.roleDivider}>
          {language === "ar" ? "ضد" : "vs"}
        </span>

        <motion.button
          className={`${styles.roleBtn} ${role === "tradesman" ? styles.roleBtnActive : ""}`}
          onClick={() => setRole("tradesman")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {language === "ar" ? "صنايعي" : "Treadsman"}
        </motion.button>
      </motion.div>

      <div className={styles.container}>
        {/* ═══════════════════════════════════════════
            ─── Section 1: Profile Photo ──────────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.section}
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.sectionRow}>
            <div className={styles.sectionLabel}>
              <h3>{language === "ar" ? "صورة الملف الشخصي" : "Profile Photo"}</h3>
              <p>
                {language === "ar"
                  ? "تُعرض هذه الصورة للعامة وتساعد أصحاب العمل في التعرف عليك."
                  : "This Image Will Show System For All Users And Help The Work Provider to Identify you."}
              </p>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.photoUploadRow}>
                <div className={styles.avatarPreview}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Avatar" />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <i className="fas fa-user" />
                    </div>
                  )}
                </div>
                <div
                  className={styles.uploadZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon />
                  <p className={styles.uploadText}>
                    <span className={styles.uploadLink}>
                      {language === "ar" ? "انقر للاستبدال" : "Click to replace"}
                    </span>{" "}
                    {language === "ar" ? "أو سحب وإفلات" : "or drag and drop"}
                  </p>
                  <p className={styles.uploadHint}>
                    SVG, PNG, JPG or GIF (max. 400 x 400px)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            ─── Section 2: Personal Details ───────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.section}
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.sectionRow}>
            <div className={styles.sectionLabel}>
              <h3>{language === "ar" ? "التفاصيل الشخصية" : "Personal Details"}</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>
                    {language === "ar" ? "الاسم الكامل" : "Full Name"} <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className={`${styles.input} ${formErrors.fullName ? styles.inputError : ''}`}
                    placeholder="Jake Gyll"
                    value={formData.fullName}
                    onChange={handleChange}
                    dir="auto"
                  />
                  {formErrors.fullName && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "رقم الهاتف" : "Phone Number"} <span>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className={`${styles.input} ${formErrors.phone ? styles.inputError : ''}`}
                    placeholder="+44 1245 572 135"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    style={{ textAlign: "left" }}
                  />
                  {formErrors.phone && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "البريد الإلكتروني" : "Email"} <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                    placeholder="jakegyll@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                    style={{ textAlign: "left" }}
                  />
                  {formErrors.email && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "تاريخ الميلاد" : "Date of Birth"} <span>*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className={`${styles.input} ${formErrors.dob ? styles.inputError : ''}`}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {formErrors.dob && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "الجنس" : "Gender"} <span>*</span>
                  </label>
                  <select
                    name="gender"
                    className={`${styles.select} ${formErrors.gender ? styles.inputError : ''}`}
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">{language === "ar" ? "اختر..." : "Choose..."}</option>
                    <option value="male">{language === "ar" ? "ذكر" : "Male"}</option>
                    <option value="female">{language === "ar" ? "أنثى" : "Female"}</option>
                  </select>
                  {formErrors.gender && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>
                    {language === "ar" ? "المحافظة" : "Governorate"} <span>*</span>
                  </label>
                  <select
                    name="location"
                    className={`${styles.select} ${formErrors.location ? styles.inputError : ''}`}
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="">{language === "ar" ? "اختر المحافظة..." : "Choose Governorate..."}</option>
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  {formErrors.location && (
                    <div className={styles.errorMessage}>
                      {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            ─── Criminal Record Check (Tradesman Only) 
            ═══════════════════════════════════════════ */}
        {role === "tradesman" && (
          <motion.div
            className={styles.section}
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.sectionRow}>
              <div className={styles.sectionLabel}>
                <h3>{language === "ar" ? "صحيفة الحالة الجنائية" : "Criminal Record Check"}</h3>
                <p>
                  {language === "ar"
                    ? "صحيفة الحالة الجنائية هي وثيقة رسمية توضح التاريخ الجنائي للشخص."
                    : "Is An Official Document That Shows A Person's Criminal History."}
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div
                  className={styles.criminalRecordZone}
                  onClick={() => criminalRecordInputRef.current?.click()}
                >
                  {criminalRecordPreview ? (
                    <div className={styles.previewContainer}>
                      <img
                        src={criminalRecordPreview}
                        alt="Criminal Record"
                        className={styles.previewImg}
                      />
                      <div className={styles.previewOverlay}>
                        {language === "ar" ? "تغيير الملف" : "Change file"}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.placeholderBox}>
                      <UploadIcon />
                      <p className={styles.uploadText}>
                        <span className={styles.uploadLink}>
                          {language === "ar" ? "Click to replace" : "Click to replace"}
                        </span>{" "}
                        {language === "ar" ? "or drag and drop" : "or drag and drop"}
                      </p>
                      <p className={styles.uploadHint}>
                        SVG, PNG, JPG or GIF (max. 400 x 400px)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={criminalRecordInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleCriminalRecordUpload}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            ─── Section 3: About Me ───────────────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.section}
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.sectionRow}>
            <div className={styles.sectionLabel}>
              <h3>{language === "ar" ? "نبذة عني" : "About me"}</h3>
              <p>
                {language === "ar"
                  ? "صف مهاراتك وخبراتك باختصار."
                  : "Tell Us About Yourself."}
              </p>
            </div>
            <div className={styles.sectionContent}>
              <textarea
                className={`${styles.textarea} ${formErrors.bio ? styles.inputError : ""}`}
                placeholder={language === "ar" ? "أضف نبذة عن نفسك..." : "Tell Us About Yourself..."}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (formErrors.bio) {
                    setFormErrors((prev) => {
                      const newErrs = { ...prev };
                      delete newErrs.bio;
                      return newErrs;
                    });
                  }
                }}
              />
              {formErrors.bio && (
                <div className={styles.errorMessage}>
                  {language === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            ─── Section 4: Education (Job Seeker / Both)
            ═══════════════════════════════════════════ */}
        {role === "job_seeker" && (
          <motion.div
            className={styles.section}
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.sectionRow}>
              <div className={styles.sectionLabel}>
                <h3>{language === "ar" ? "التعليم" : "Education"}</h3>
                <p>
                  {language === "ar"
                    ? "أضف مؤهلاتك العلمية."
                    : "Tell Us About Your Education."}
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.listContainer}>
                  <AnimatePresence>
                    {educations.map((edu, index) => (
                      <motion.div
                        key={index}
                        className={styles.listItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.listHeader}>
                          <span className={styles.label}>
                            {language === "ar" ? `تعليم ${index + 1}` : `Education ${index + 1}`}
                          </span>
                          <button
                            className={styles.removeBtn}
                            onClick={() =>
                              setEducations(
                                educations.filter((_, i) => i !== index)
                              )
                            }
                          >
                            {language === "ar" ? "حذف" : "Remove"}
                          </button>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.field}>
                            <label className={styles.label}>
                              {language === "ar" ? "المؤسسة التعليمية" : "School"}
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={edu.school}
                              onChange={(e) => {
                                const updated = [...educations];
                                updated[index].school = e.target.value;
                                setEducations(updated);
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>
                              {language === "ar" ? "الدرجة العلمية" : "Graduate Degree"}
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...educations];
                                updated[index].degree = e.target.value;
                                setEducations(updated);
                              }}
                            />
                          </div>
                          <div className={`${styles.field} ${styles.fieldFull}`}>
                            <label className={styles.label}>
                              {language === "ar" ? "المدة" : "Period"}
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder={language === "ar" ? "مثال: 2018 - 2022" : "e.g. 2018 - 2022"}
                              value={edu.period}
                              onChange={(e) => {
                                const updated = [...educations];
                                updated[index].period = e.target.value;
                                setEducations(updated);
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    className={styles.addBtn}
                    onClick={addEducation}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + {language === "ar" ? "إضافة تعليم جديد" : "Add Education"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            ─── Section 5: Experiences (Job Seeker Only)
            ═══════════════════════════════════════════ */}
        {role === "job_seeker" && (
          <motion.div
            className={styles.section}
            custom={5}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.sectionRow}>
              <div className={styles.sectionLabel}>
                <h3>{language === "ar" ? "الخبرات" : "Experiences"}</h3>
                <p>
                  {language === "ar"
                    ? "أضف خبراتك العملية السابقة."
                    : "Tell Us About Your Work Experience."}
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.listContainer}>
                  <AnimatePresence>
                    {experiences.map((exp, index) => (
                      <motion.div
                        key={index}
                        className={styles.listItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.listHeader}>
                          <span className={styles.label}>
                            {language === "ar" ? `خبرة ${index + 1}` : `Experience ${index + 1}`}
                          </span>
                          <button
                            className={styles.removeBtn}
                            onClick={() =>
                              setExperiences(
                                experiences.filter((_, i) => i !== index)
                              )
                            }
                          >
                            {language === "ar" ? "حذف" : "Remove"}
                          </button>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={`${styles.field} ${styles.fieldFull}`}>
                            <label className={styles.label}>
                              {language === "ar" ? "المسمى الوظيفي" : "Role"}
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].role = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                          <div className={`${styles.field} ${styles.fieldFull}`}>
                            <label className={styles.label}>
                              {language === "ar" ? "المدة" : "Period"}
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder={language === "ar" ? "مثل: يناير 2020 - مارس 2023" : "e.g. Jan 2020 - Mar 2023"}
                              value={exp.period}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].period = e.target.value;
                                setExperiences(updated);
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <motion.button
                    className={styles.addBtn}
                    onClick={addExperience}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + {language === "ar" ? "إضافة خبرة جديدة" : "Add Experience"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            ─── Service (Tradesman Only) ──────────────
            ═══════════════════════════════════════════ */}
        {role === "tradesman" && (
          <motion.div
            className={styles.section}
            custom={6}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.sectionRow}>
              <div className={styles.sectionLabel}>
                <h3>{language === "ar" ? "الخدمة" : "Service"}</h3>
                <p>
                  {language === "ar"
                    ? "اختر الخدمات التي تقدمها لعملائك."
                    : "Tell Us About Your Services."}
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.servicesGrid}>
                  <div className={styles.serviceTagGroup}>
                    {[
                      { ar: "كهربائي", en: "Electrician" },
                      { ar: "فني سباكة", en: "Plumber" },
                      { ar: "نجار", en: "Carpenter" },
                      { ar: "منظف بيوت", en: "House Cleaner" },
                      { ar: "نقاش", en: "Painter" },
                      { ar: "ميكانيكي", en: "Mechanic" },
                      { ar: "حداد", en: "Blacksmith" }
                    ].map((s) => {
                      const isSelected = selectedServices.includes(s.ar);
                      return (
                        <button
                          key={s.ar}
                          type="button"
                          className={`${styles.serviceItem} ${
                            isSelected ? styles.serviceItemActive : ""
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedServices(selectedServices.filter((item) => item !== s.ar));
                            } else {
                              setSelectedServices([...selectedServices, s.ar]);
                            }
                          }}
                        >
                          {language === "ar" ? s.ar : s.en}
                        </button>
                      );
                    })}
                  </div>

                  {showServiceInput ? (
                    <div className={styles.customServiceInputRow}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder={language === "ar" ? "اكتب الخدمة هنا..." : "Type service here..."}
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        className={styles.addBtnSmall}
                        onClick={() => {
                          if (customService.trim()) {
                            setSelectedServices([...selectedServices, customService.trim()]);
                            setCustomService("");
                            setShowServiceInput(false);
                          }
                        }}
                      >
                        {language === "ar" ? "إضافة" : "Add"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.addServiceBtn}
                      onClick={() => setShowServiceInput(true)}
                    >
                      <i className="fas fa-plus" /> {language === "ar" ? "إضافة خدمة جديدة" : "Add new Serves"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            ─── Section 6: Skills ─────────────────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.section}
          custom={7}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.sectionRow}>
            <div className={styles.sectionLabel}>
              <h3>{language === "ar" ? "المهارات" : "Skills"}</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.formGrid}>
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    {language === "ar" ? "المهارات" : "Skills"}
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={language === "ar" ? "أضف مهارة واضغط Enter" : "Add a skill and press Enter"}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && skillInput.trim()) {
                        e.preventDefault();
                        setSkills([...skills, skillInput.trim()]);
                        setSkillInput("");
                      }
                    }}
                  />
                  <div className={styles.tagContainer}>
                    {skills.map((skill, i) => (
                      <span key={i} className={styles.tag}>
                        {skill}
                        <span
                          className={styles.tagRemove}
                          onClick={() =>
                            setSkills(skills.filter((_, idx) => idx !== i))
                          }
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            ─── Section 7: Social Links ───────────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.section}
          custom={8}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.sectionRow}>
            <div className={styles.sectionLabel}>
              <h3>{language === "ar" ? "روابط التواصل الاجتماعي" : "Social Links"}</h3>
            </div>
            <div className={styles.sectionContent}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "إنستجرام" : "Instagram"}
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    className={styles.input}
                    placeholder="instagram.com/username"
                    value={socialLinks.instagram}
                    onChange={handleSocialChange}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>
                    {language === "ar" ? "تويتر" : "Twitter"}
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    className={styles.input}
                    placeholder="twitter.com/username"
                    value={socialLinks.twitter}
                    onChange={handleSocialChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════
            ─── Section 8: Work Images (Tradesman Only)
            ═══════════════════════════════════════════ */}
        {role === "tradesman" && (
          <motion.div
            className={styles.section}
            custom={9}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.sectionRow}>
              <div className={styles.sectionLabel}>
                <h3>{language === "ar" ? "صور الأعمال" : "Your work"}</h3>
                <p>
                  {language === "ar"
                    ? "أضف صور لأعمالك السابقة."
                    : "Tell Us About Your Work."}
                </p>
              </div>
              <div className={styles.sectionContent}>
                <div
                  className={styles.workImageZone}
                  onClick={() => workImageRef.current?.click()}
                >
                  <div className={styles.wallpaperPlaceholder}>
                    <UploadIcon />
                    <p className={styles.uploadText}>
                      <span className={styles.uploadLink}>
                        {language === "ar" ? "انقر للاستبدال" : "Click to replace"}
                      </span>{" "}
                      {language === "ar" ? "أو سحب وإفلات" : "or drag and drop"}
                    </p>
                    <p className={styles.uploadHint}>
                      SVG, PNG, JPG or GIF (max. 400 x 400px)
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={workImageRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    multiple
                    onChange={handleWorkImageUpload}
                  />
                </div>
                {workImages.length > 0 && (
                  <div className={styles.workImageGrid}>
                    {workImages.map((img, i) => (
                      <div key={i} className={styles.workImageThumb}>
                        <img src={img} alt={`Work ${i + 1}`} />
                        <button
                          className={styles.workImageRemove}
                          onClick={(e) => {
                            e.stopPropagation();
                            setWorkImages(
                              workImages.filter((_, idx) => idx !== i)
                            );
                            setWorkImageFiles(
                              workImageFiles.filter((_, idx) => idx !== i)
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            ─── Submit Row ────────────────────────────
            ═══════════════════════════════════════════ */}
        <motion.div
          className={styles.submitRow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            className={styles.submitBtn}
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isSaving ? (
              <span className={styles.loader} />
            ) : (
              language === "ar" ? "حفظ وإكمال الملف الشخصي" : "Save Changes"
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
