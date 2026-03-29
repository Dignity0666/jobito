import React, { useState, useRef } from "react";
import styles from "./EditProfile.module.css";
import { useJobitoAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const UploadIcon = () => (
  <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
);

interface Experience {
  role: string;
  period: string;
  desc: string;
}

interface Education {
  school: string;
  degree: string;
  period: string;
}

type Tab = "profile" | "login" | "notifications";

const getAvatarUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function EditProfile() {
  const { user, apiFetch } = useJobitoAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  
  // Advanced Profile State
  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "غير محدد",
    email: user?.email || "mohamednasseremam380@gmail.com",
    dob: user?.dob || "",
    gender: user?.gender || "",
    bio: user?.bio || "",
    accountType: user?.role === "company" ? "employer" : "job_seeker",
    socialLinks: {
      instagram: user?.socialLinks?.instagram || "",
      twitter: user?.socialLinks?.twitter || "",
      website: user?.socialLinks?.website || "",
    },
    location: user?.location || "",
  });
  
  const [experience, setExperience] = useState<Experience[]>(user?.experiences || []);
  const [education, setEducation] = useState<Education[]>(user?.educations || []);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [languages, setLanguages] = useState<string[]>(user?.languages || []);
  const [gallery, setGallery] = useState<string[]>(user?.portfolios || []);
  
  const [skillInput, setSkillInput] = useState("");
  const [langInput, setLangInput] = useState("");
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Login Details State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    jobAlerts: true,
    applications: false,
    marketing: false,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      socialLinks: { ...profileData.socialLinks, [e.target.name]: e.target.value }
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setGallery(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const addExperience = () => {
    setExperience([...experience, { role: "", period: "", desc: "" }]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch(`${API_BASE_URL}/users/me`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfileData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          email: data.email || "",
          dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : "",
          gender: data.gender || "",
          bio: data.bio || "",
          accountType: data.role === "company" ? "employer" : "job_seeker",
          socialLinks: {
            instagram: data.socialLinks?.instagram || "",
            twitter: data.socialLinks?.twitter || "",
            website: data.socialLinks?.website || "",
          },
          location: data.location || "",
        });
        setExperience(data.experiences || []);
        setEducation(data.educations || []);
        setSkills(data.skills || []);
        setLanguages(data.languages || []);
        setGallery(data.portfolios || []);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [apiFetch]);

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", period: "" }]);
  };

  const handleSave = async () => {
    if (activeTab === "login" && passwords.new !== passwords.confirm) {
      alert("كلمات المرور الجديدة غير متطابقة!");
      return;
    }

    try {
      setIsSaving(true);
      
      let finalAvatarUrl = user?.avatar || "";
      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        const uploadRes = await apiFetch(`${API_BASE_URL}/images/profile`, {
          method: "PUT",
          body: fd,
        });
        if (uploadRes.ok) {
          const imgData = await uploadRes.json();
          finalAvatarUrl = imgData.imageUrl || imgData.image_url;
        }
      }

      if (activeTab === "login") {
        if (passwords.new) {
          const passRes = await apiFetch(`${API_BASE_URL}/users/me/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              oldPassword: passwords.current,
              newPassword: passwords.new,
            }),
          });
          if (!passRes.ok) {
            const err = await passRes.json();
            throw new Error(err.message || "فشل تحديث كلمة المرور");
          }
        }
      } else {
        const updateData = {
          fullName: profileData.fullName,
          phone: profileData.phone,
          email: profileData.email,
          dob: profileData.dob,
          gender: profileData.gender,
          bio: profileData.bio,
          socialLinks: profileData.socialLinks,
          experiences: experience,
          educations: education,
          skills: skills,
          languages: languages,
          portfolios: gallery,
          avatarUrl: finalAvatarUrl,
          avatar: finalAvatarUrl,
          location: profileData.location,
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
      }

      alert("تم حفظ التعديلات بنجاح!");
      setSelectedFile(null);
      setPhotoPreview(null);
      if (activeTab === "login") {
        setPasswords({ current: "", new: "", confirm: "" });
      }
    } catch (error: any) {
      alert(`فشل الحفظ: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <h1 className={styles.title}>تعديل الملف الشخصي</h1>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "profile" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            الملف الشخصي
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "login" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("login")}
          >
            بيانات الدخول
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "notifications" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            الإشعارات
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {/* Profile Photo */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>المعلومات الأساسية</h3>
                <p className={styles.sectionSub}>هذه معلوماتك الشخصية التي يمكنك تحديثها في أي وقت.</p>
                
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>صورة الملف الشخصي</p>
                    <p className={styles.sectionSub}>تُعرض هذه الصورة للعامة وتساعد أصحاب العمل في التعرف عليك.</p>
                  </div>
                  <div className={styles.photoSection}>
                    <img 
                      src={photoPreview || getAvatarUrl(user?.avatar) || "https://i.pravatar.cc/150?u=fake"} 
                      alt="Avatar" 
                      className={styles.avatar} 
                    />
                    <div className={styles.uploadZone} onClick={() => fileInputRef.current?.click()}>
                      <UploadIcon />
                      <p className={styles.uploadText}>
                        <span className={styles.uploadLink}>انقر للاستبدال</span> أو سحب وإفلات
                      </p>
                      <p className={styles.uploadHint}>SVG, PNG, JPG or GIF (max. 400 x 400px)</p>
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

              {/* Personal Details */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>التفاصيل الشخصية</p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.label}>الاسم الكامل <span>*</span></label>
                      <input 
                        type="text" 
                        name="fullName"
                        className={styles.input} 
                        value={profileData.fullName} 
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>رقم الهاتف <span>*</span></label>
                      <input 
                        type="tel" 
                        name="phone"
                        className={styles.input} 
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>البريد الإلكتروني <span>*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        className={styles.input} 
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>تاريخ الميلاد <span>*</span></label>
                      <input 
                        type="date" 
                        name="dob"
                        className={styles.input} 
                        value={profileData.dob}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>الجنس <span>*</span></label>
                      <select 
                        name="gender"
                        className={styles.select} 
                        value={profileData.gender}
                        onChange={handleProfileChange}
                      >
                        <option value="">اختر...</option>
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                    <div className={styles.fieldFull}>
                      <label className={styles.label}>الموقع / السكن</label>
                      <input 
                        type="text" 
                        name="location"
                        className={styles.input} 
                        placeholder="مثل: القاهرة، مصر"
                        value={profileData.location}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>نبذة عني</p>
                    <p className={styles.sectionSub}>صف مهاراتك وخبراتك باختصار.</p>
                  </div>
                  <div className={styles.fieldFull}>
                    <textarea 
                      name="bio"
                      className={styles.textarea}
                      placeholder="أضف نبذة عن نفسك..."
                      value={profileData.bio}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>الخبرات</p>
                    <p className={styles.sectionSub}>أضف خبراتك العملية السابقة.</p>
                  </div>
                  <div className={styles.listContainer}>
                    {experience.map((exp, index) => (
                      <div key={index} className={styles.listItem}>
                        <div className={styles.listHeader}>
                          <p className={styles.label}>خبرة {index + 1}</p>
                          <button 
                            className={styles.removeBtn} 
                            onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                          >
                            حذف
                          </button>
                        </div>
                          <div className={styles.fieldFull}>
                            <label className={styles.label}>المسمى الوظيفي</label>
                            <input 
                              type="text" 
                              className={styles.input}
                              value={exp.role}
                                onChange={(e) => {
                                  setExperience(experience.map((item, i) => i === index ? { ...item, role: e.target.value } : item));
                                }}
                            />
                          </div>
                          <div className={styles.fieldFull}>
                            <label className={styles.label}>المدة</label>
                            <input 
                              type="text" 
                              className={styles.input}
                              placeholder="مثل: يناير 2020 - مارس 2023"
                              value={exp.period}
                                onChange={(e) => {
                                  setExperience(experience.map((item, i) => i === index ? { ...item, period: e.target.value } : item));
                                }}
                            />
                          </div>
                        </div>
                    ))}
                    <button className={styles.addBtn} onClick={addExperience}>+ إضافة خبرة جديدة</button>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>التعليم</p>
                    <p className={styles.sectionSub}>أضف مؤهلاتك العلمية.</p>
                  </div>
                  <div className={styles.listContainer}>
                    {education.map((edu, index) => (
                      <div key={index} className={styles.listItem}>
                        <div className={styles.listHeader}>
                          <p className={styles.label}>تعليم {index + 1}</p>
                          <button 
                            className={styles.removeBtn} 
                            onClick={() => setEducation(education.filter((_, i) => i !== index))}
                          >
                            حذف
                          </button>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.field}>
                            <label className={styles.label}>المؤسسة التعليمية</label>
                            <input 
                              type="text" 
                              className={styles.input}
                              value={edu.school}
                               onChange={(e) => {
                                 setEducation(education.map((item, i) => i === index ? { ...item, school: e.target.value } : item));
                               }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>الدرجة العلمية</label>
                            <input 
                              type="text" 
                              className={styles.input}
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...education];
                                newEdu[index].degree = e.target.value;
                                setEducation(newEdu);
                              }}
                            />
                          </div>
                          <div className={styles.field}>
                            <label className={styles.label}>المدة</label>
                            <input 
                              type="text" 
                              className={styles.input}
                              value={edu.period}
                              onChange={(e) => {
                                const newEdu = [...education];
                                newEdu[index].period = e.target.value;
                                setEducation(newEdu);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className={styles.addBtn} onClick={addEducation}>+ إضافة تعليم جديد</button>
                  </div>
                </div>
              </div>

              {/* Skills & Languages */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>المهارات واللغات</p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>المهارات</label>
                      <div className={styles.tagInputWrapper}>
                        <input 
                          type="text" 
                          className={styles.input} 
                          placeholder="أضف مهارة واضغط Enter" 
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && skillInput.trim()) {
                              setSkills([...skills, skillInput.trim()]);
                              setSkillInput("");
                            }
                          }}
                        />
                      </div>
                      <div className={styles.tagContainer}>
                        {skills.map((skill, i) => (
                          <span key={i} className={styles.tag}>
                            {skill}
                            <span className={styles.tagRemove} onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>اللغات</label>
                      <div className={styles.tagInputWrapper}>
                        <input 
                          type="text" 
                          className={styles.input} 
                          placeholder="أضف لغة واضغط Enter" 
                          value={langInput}
                          onChange={(e) => setLangInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && langInput.trim()) {
                              setLanguages([...languages, langInput.trim()]);
                              setLangInput("");
                            }
                          }}
                        />
                      </div>
                      <div className={styles.tagContainer}>
                        {languages.map((lang, i) => (
                          <span key={i} className={styles.tag}>
                            {lang}
                            <span className={styles.tagRemove} onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>روابط التواصل الاجتماعي</p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>إنستجرام</label>
                      <input 
                        type="text" 
                        name="instagram"
                        className={styles.input} 
                        placeholder="غير محدد"
                        value={profileData.socialLinks.instagram}
                        onChange={handleSocialChange}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>تويتر</label>
                      <input 
                        type="text" 
                        name="twitter"
                        className={styles.input} 
                        placeholder="غير محدد"
                        value={profileData.socialLinks.twitter}
                        onChange={handleSocialChange}
                      />
                    </div>
                    <div className={styles.fieldFull}>
                      <label className={styles.label}>الموقع الإلكتروني</label>
                      <input 
                        type="text" 
                        name="website"
                        className={styles.input} 
                        placeholder="https://example.com"
                        value={profileData.socialLinks.website}
                        onChange={handleSocialChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>المعرض</p>
                    <p className={styles.sectionSub}>أضف صوراً لأعمالك أو إنجازاتك.</p>
                  </div>
                  <div className={styles.fieldFull}>
                    <div className={styles.uploadZone} onClick={() => galleryInputRef.current?.click()}>
                      <UploadIcon />
                      <p className={styles.uploadText}>انقر لإضافة صور إلى المعرض</p>
                      <input 
                        type="file" 
                        ref={galleryInputRef} 
                        style={{ display: "none" }} 
                        accept="image/*" 
                        multiple 
                        onChange={handleGalleryUpload}
                      />
                    </div>
                    <div className={styles.galleryGrid}>
                      {gallery.map((img, i) => (
                        <div key={i} className={styles.galleryItem}>
                          <img src={img} alt={`Gallery ${i}`} className={styles.galleryImg} />
                          <button 
                            className={styles.galleryRemove}
                            onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Type */}
              <div className={styles.section}>
                <div className={styles.row}>
                  <div className={styles.labelGroup}>
                    <p className={styles.label}>نوع الحساب</p>
                    <p className={styles.sectionSub}>يمكنك تحديث نوع حسابك للوصول لميزات مختلفة.</p>
                  </div>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioItem}>
                      <input 
                        type="radio" 
                        name="accountType" 
                        value="job_seeker"
                        className={styles.radioInput}
                        checked={profileData.accountType === "job_seeker"}
                        onChange={handleProfileChange}
                      />
                      <div className={styles.radioLabel}>
                        <span className={styles.radioTitle}>باحث عن عمل</span>
                        <span className={styles.radioDesc}>ابحث عن وظائف وتقدم لها بسهولة</span>
                      </div>
                    </label>
                    <label className={styles.radioItem}>
                      <input 
                        type="radio" 
                        name="accountType" 
                        value="job_seeker"
                        className={styles.radioInput}
                        // checked={profileData.accountType === "job_seeker"}
                        // onChange={handleProfileChange}
                      />
                      <div className={styles.radioLabel}>
                        <span className={styles.radioTitle}>حرفي</span>
                        <span className={styles.radioDesc}>ابحث عن وظائف وتقدم لها بسهولة</span>
                      </div>
                    </label>
                    <label className={styles.radioItem}>
                      <input 
                        type="radio" 
                        name="accountType" 
                        value="employer"
                        className={styles.radioInput}
                        checked={profileData.accountType === "employer"}
                        onChange={handleProfileChange}
                      />
                      <div className={styles.radioLabel}>
                        <span className={styles.radioTitle}>صاحب عمل</span>
                        <span className={styles.radioDesc}>وظف أفضل الكفاءات وأعلن عن وظائفك</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "login" && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>أمان الحساب</h3>
                <p className={styles.sectionSub}>قم بتحديث كلمة المرور الخاصة بك بانتظام للحفاظ على أمان حسابك.</p>
                <div className={styles.formGrid}>
                  <div className={`${styles.field} ${styles.fieldFull}`}>
                    <label className={styles.label}>كلمة المرور الحالية</label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={showPass ? "text" : "password"} 
                        name="current"
                        className={styles.input} 
                        placeholder="••••••••" 
                        value={passwords.current}
                        onChange={handlePasswordChange}
                      />
                      <button 
                        className={styles.toggleBtn}
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? "إخفاء" : "إظهار"}
                      </button>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>كلمة المرور الجديدة</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      name="new"
                      className={styles.input} 
                      placeholder="••••••••" 
                      value={passwords.new}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>تأكيد كلمة المرور</label>
                    <input 
                      type={showPass ? "text" : "password"} 
                      name="confirm"
                      className={styles.input} 
                      placeholder="••••••••" 
                      value={passwords.confirm}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>إعدادات الإشعارات</h3>
                <p className={styles.sectionSub}>اختر كيف ومتى تود استلام الإشعارات منا.</p>
                
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span className={styles.radioTitle}>إشعارات البريد الإلكتروني</span>
                    <span className={styles.radioDesc}>استلم ملخصاً أسبوعياً للوظائف والمقالات</span>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${notifications.email ? styles.active : ""}`}
                    onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  >
                    <div className={styles.toggleSlider} />
                  </div>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span className={styles.radioTitle}>تنبيهات الوظائف</span>
                    <span className={styles.radioDesc}>عند نشر وظيفة جديدة تناسب مهاراتك</span>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${notifications.jobAlerts ? styles.active : ""}`}
                    onClick={() => setNotifications({...notifications, jobAlerts: !notifications.jobAlerts})}
                  >
                    <div className={styles.toggleSlider} />
                  </div>
                </div>

                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}>
                    <span className={styles.radioTitle}>تحديثات الطلبات</span>
                    <span className={styles.radioDesc}>عند تغيير حالة طلبات التوظيف الخاصة بك</span>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${notifications.applications ? styles.active : ""}`}
                    onClick={() => setNotifications({...notifications, applications: !notifications.applications})}
                  >
                    <div className={styles.toggleSlider} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
          {isSaving ? "جاري الحفظ..." : "حفظ الملف الشخصي"}
        </button>
      </div>
    </div>
  );
}