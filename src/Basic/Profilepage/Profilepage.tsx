import { useState, useEffect } from "react";
import styles from "./Profilepage.module.css";
import { useJobitoAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type {
  ExperienceItem as Experience,
  EducationItem as Education,
} from "../../context/AuthContext";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const BriefcaseIcon = () => (
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
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const GraduationIcon = () => (
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
    <path d="M22 10L12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const InstagramIcon = () => (
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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TwitterIcon = () => (
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
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const Share2Icon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const getAvatarUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function ProfilePage() {
  const { user, apiFetch } = useJobitoAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [showMoreExp, setShowMoreExp] = useState(false);
  const [showMoreEdu, setShowMoreEdu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/users/me`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, [apiFetch]);

  const profileUser = profile || user;

  const experiences = (profileUser?.experiences || []) as Experience[];
  const educations = (profileUser?.educations || []) as Education[];
  const skills = profileUser?.skills || [];
  const portfolios = (profileUser?.portfolios || []) as string[];
  const socialLinks = profileUser?.socialLinks || {
    instagram: "",
    twitter: "",
    website: "",
  };

  const displayName =
    profileUser?.fullName || profileUser?.name || "اسم المستخدم";
  const displayAvatar = profileUser?.avatarUrl || profileUser?.avatar;
  const displayBio = profileUser?.bio || "أضف نبذة عن نفسك...";
  const displayLocation = profileUser?.location || "الموقع غير محدد";

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={`${styles.card} ${styles.heroCard}`}>
          <div className={styles.heroBanner}>
            <button className={styles.shareIcon}>
              <Share2Icon />
            </button>
          </div>
          <div className={styles.heroBody}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>
                {displayAvatar ? (
                  <img src={getAvatarUrl(displayAvatar) || ""} alt="avatar" />
                ) : (
                  displayName[0] || "U"
                )}
              </div>
            </div>
            <div className={styles.heroInfo}>
              <div className={styles.heroName}>{displayName}</div>
              <div className={styles.heroRole}>
                {profileUser?.role === "company" ? "حساب شركة" : "باحث عن عمل"}
              </div>
              <div className={styles.heroLoc}>
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {displayLocation}
              </div>
            </div>
            <div className={styles.heroActions}>
              <button
                className={styles.editProfileBtn}
                onClick={() => navigate("/edit-profile")}
              >
                تعديل الملف الشخصي
              </button>
              <div className={styles.openBadge}>
                <div className={styles.openDot} />
                متاح للفرص
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>نبذة عني</span>
            </div>
            <div
              className={`${styles.aboutText} ${aboutExpanded ? styles.expanded : styles.collapsed}`}
            >
              {displayBio}
            </div>
            <button
              className={styles.showMore}
              onClick={() => setAboutExpanded((e) => !e)}
            >
              {aboutExpanded ? "عرض أقل ↑" : "عرض المزيد ↓"}
            </button>
          </div>
        </div>

        {/* Experiences */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>الخبرات</span>
              <button className={styles.plusBtn}>
                <PlusIcon />
              </button>
            </div>
            {experiences
              .slice(0, showMoreExp ? undefined : 4)
              .map((exp, idx) => (
                <div className={styles.expItem} key={idx}>
                  <div className={styles.expLogo}>
                    <BriefcaseIcon />
                  </div>
                  <div className={styles.expContent}>
                    <div className={styles.expTop}>
                      <div>
                        <div className={styles.expTitle}>{exp.role}</div>
                        <div className={styles.expCompany}>{exp.period}</div>
                        <div className={styles.expLoc}>{exp.location}</div>
                      </div>
                    </div>
                    {exp.desc && (
                      <div className={styles.expDesc}>{exp.desc}</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Education */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>التعليم</span>
              <button className={styles.plusBtn}>
                <PlusIcon />
              </button>
            </div>
            {educations
              .slice(0, showMoreEdu ? undefined : 4)
              .map((edu, idx) => (
                <div className={styles.eduItem} key={idx}>
                  <div className={styles.eduLogo}>
                    <GraduationIcon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.expTop}>
                      <div>
                        <div className={styles.eduSchool}>{edu.school}</div>
                        <div className={styles.eduDegree}>{edu.degree}</div>
                        <div className={styles.eduPeriod}>{edu.period}</div>
                      </div>
                    </div>
                    {edu.desc && (
                      <div className={styles.eduDesc}>{edu.desc}</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Skills */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>المهارات</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className={styles.plusBtn}>
                  <PlusIcon />
                </button>
              </div>
            </div>
            <div className={styles.skillsWrap}>
              {skills.map((s) => (
                <div className={styles.skillTag} key={s}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>المعرض</span>
              <button className={styles.plusBtn}>
                <PlusIcon />
              </button>
            </div>
            <div className={styles.portfolioGrid}>
              {portfolios.map((img, idx) => (
                <div className={styles.portfolioItem} key={idx}>
                  <img
                    src={getAvatarUrl(img) || ""}
                    alt={`Gallery ${idx}`}
                    className={styles.portfolioImg}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT ===== */}
      <div className={styles.right}>
        {/* Additional Details */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>تفاصيل إضافية</span>
            </div>
            {[
              {
                icon: <MailIcon />,
                label: "البريد الإلكتروني",
                val: profileUser?.email || "غير محدد",
              },
              {
                icon: <PhoneIcon />,
                label: "الهاتف",
                val: profileUser?.phone || "غير محدد",
              },
              {
                icon: <GlobeIcon />,
                label: "اللغات",
                val: profileUser?.languages?.join(", ") || "غير محدد",
              },
            ].map((d) => (
              <div className={styles.detailRow} key={d.label}>
                <div className={styles.detailIcon}>{d.icon}</div>
                <div>
                  <div className={styles.detailLabel}>{d.label}</div>
                  <div className={styles.detailVal}>{d.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>روابط التواصل الاجتماعي</span>
            </div>
            {[
              {
                icon: <InstagramIcon />,
                label: "إنستجرام",
                link: socialLinks.instagram || "غير محدد",
              },
              {
                icon: <TwitterIcon />,
                label: "تويتر",
                link: socialLinks.twitter || "غير محدد",
              },
              {
                icon: <GlobeIcon />,
                label: "الموقع الإلكتروني",
                link: socialLinks.website || "غير محدد",
              },
            ].map((s) => (
              <div className={styles.socialRow} key={s.label}>
                <div className={styles.socialIcon}>{s.icon}</div>
                <div>
                  <div className={styles.socialLabel}>{s.label}</div>
                  <a
                    className={styles.socialLink}
                    href={s.link !== "غير محدد" ? `https://${s.link}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
