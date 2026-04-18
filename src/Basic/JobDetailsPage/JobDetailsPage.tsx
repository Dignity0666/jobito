import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./JobDetailsPage.module.css";
import { ApplyJobModal } from "./ApplyJobModal/ApplyJobModal";
import { useJobitoAuth } from "../../context/LinkContxt.js";
import { useEffect, useState, useMemo } from "react";
import AllApplicants from "../Company/All Applicants/All Applicants";
import { useTranslation } from "../../context/translation-context";


const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="#56CDAD" strokeWidth="2" />
    <path
      d="M8 12L11 15L16 9"
      stroke="#56CDAD"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import { API_BASE_URL, getCommonHeaders } from "../../services/api.js";

interface Benefit {
  emoji: string;
  name: string;
  desc: string;
}

interface Application {
  applicationId: number;
  status: string;
}

interface Job {
  jobId: number | string;
  isActive: boolean;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  address: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  createdAt?: string;
  expiresAt?: string;
  slotsAvailable?: number;
  category?: { name: string };
  company?: {
    name: string;
    description: string;
    website: string;
    benefits: Benefit[];
    officePhoto1Url: string;
    officePhoto2Url: string;
    logoUrl?: string;
  };
  applications?: Application[];
}

export const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { apiFetch, isAuthenticated, role } = useJobitoAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "applicants">(
    "details",
  );
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"original" | "en">("original");
  const [userApplication, setUserApplication] = useState<Application | null>(
    null,
  );

  const jobId = location.state?.jobId || 1;

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
          headers: getCommonHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setJob(data);

        const simRes = await fetch(`${API_BASE_URL}/jobs/similar/${jobId}`, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });
        if (simRes.ok) {
          const simData = await simRes.json();
          setSimilarJobs(simData);
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();

    const fetchApplicationStatus = async () => {
      if (isAuthenticated && role === "student") {
        try {
          const res = await apiFetch(
            `${API_BASE_URL}/applications/status/${jobId}`,
          );
          if (res.ok) {
            const data = await res.json();
            setUserApplication(data);
          }
        } catch (err) {
          console.error("Error fetching application status:", err);
        }
      }
    };
    fetchApplicationStatus();

    // 📈 Record View logic
    const recordView = async () => {
      try {
        let sessionId = localStorage.getItem("jobito_session_id");
        if (!sessionId) {
          sessionId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
          localStorage.setItem("jobito_session_id", sessionId);
        }

        await apiFetch(`${API_BASE_URL}/jobs/${jobId}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (err) {
        // Silent fail for view tracking
      }
    };
    recordView();
  }, [jobId, apiFetch, isAuthenticated, role]);

  const handleDelete = async () => {
    if (!window.confirm(t("هل أنت متأكد من حذف هذه الوظيفة؟"))) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert(t("تم حذف الوظيفة بنجاح."));
        navigate("/JobListing");
      } else {
        throw new Error("Failed to delete job");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting job:", error);
      alert(t("خطأ أثناء حذف الوظيفة."));
    }
  };

  const toggleActive = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !job?.isActive }),
      });
      if (res.ok) {
        const updatedJob = await res.json();
        setJob((prev) =>
          prev ? { ...prev, isActive: updatedJob.isActive } : null,
        );
        alert(
          updatedJob.isActive ? t("تم إعادة فتح الوظيفة") : t("تم إغلاق الوظيفة"),
        );
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      alert(t("خطأ أثناء تحديث حالة الوظيفة."));
    }
  };

  const handleEdit = () => {
    navigate("/PostJob", { state: { editJob: job } });
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/user-information");
    } else {
      setIsApplyModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div
        className={styles.pageContainer}
        style={{ padding: "40px", textAlign: "center" }}
      >
        {t("جاري التحميل...")}
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className={styles.pageContainer}
        style={{ padding: "40px", textAlign: "center" }}
      >
        {t("الوظيفة غير موجودة.")}
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.breadcrumb}>
          <div />
          {job.titleEn && (
            <div className={styles.langToggle}>
              <button
                className={`${styles.langBtn} ${lang === "original" ? styles.activeLang : ""}`}
                onClick={() => setLang("original")}
              >
                {t("الأصلية")}
              </button>
              <button
                className={`${styles.langBtn} ${lang === "en" ? styles.activeLang : ""}`}
                onClick={() => setLang("en")}
              >
                {t("الإنجليزية")}
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation for Companies */}
        {role === "company" && (
          <div className={styles.tabNav}>
            <button
              className={`${styles.tabItem} ${activeTab === "details" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("details")}
            >
              {t("تفاصيل الوظيفة")}
            </button>
            <button
              className={`${styles.tabItem} ${activeTab === "applicants" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("applicants")}
            >
              {t("المتقدمون")} ({job.applications?.length || 0})
            </button>
          </div>
        )}

        {/* Header Card - only show in details tab */}
        {activeTab === "details" && (
          <div className={styles.headerCard}>
            <div className={styles.headerLeft}>
              <div className={styles.companyLogo}>
                {job.company?.logoUrl ? (
                  <img
                    src={
                      job.company.logoUrl.startsWith("http")
                        ? job.company.logoUrl
                        : `${API_BASE_URL}${job.company.logoUrl}`
                    }
                    alt={job.company.name}
                    style={{ width: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span>{job.company?.name?.[0]?.toUpperCase() || "C"}</span>
                )}
              </div>
              <div className={styles.headerTitles}>
                <h1>
                  {lang === "en" && job.titleEn ? job.titleEn : t(job.title)}
                </h1>
                <p>
                  {t(job.company?.name || "شركة")} • {t(job.address || "الموقع")} •{" "}
                  {job.jobType === "full-time"
                    ? t("دوام كامل")
                    : job.jobType === "part-time"
                      ? t("دوام جزئي")
                      : t(job.jobType || "دوام كامل")}
                </p>
              </div>
            </div>
            {role === "company" ? (
              <div className={styles.headerRight}>
                <button
                  className={styles.editBtn}
                  title={t("تعديل الوظيفة")}
                  onClick={handleEdit}
                >
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
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  className={job.isActive ? styles.closeBtn : styles.reopenBtn}
                  title={job.isActive ? t("إغلاق الوظيفة") : t("فتح الوظيفة")}
                  onClick={toggleActive}
                >
                  {job.isActive ? (
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                  ) : (
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
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                </button>
                <button
                  className={styles.deleteBtn}
                  title={t("حذف الوظيفة")}
                  onClick={handleDelete}
                >
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className={styles.headerRight}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <button className={styles.shareBtn}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
                {userApplication ? (
                  <div className={(styles as any).appliedStatusContainer}>
                    <button className={(styles as any).appliedBtn} disabled>
                      <i
                        className="fa-solid fa-check-circle"
                        style={{ marginLeft: "8px" }}
                      ></i>
                      {t("تم التقديم مسبقاً")}
                    </button>
                    <div
                      className={`${(styles as any).statusBadge} ${(styles as any)["status-" + (userApplication.status || "applied")]}`}
                    >
                      <span style={{ fontSize: "13px", opacity: 0.8 }}>
                        {t("حالة الطلب")}:
                      </span>
                      <strong style={{ marginLeft: "4px" }}>
                        {userApplication.status === "applied" ||
                        userApplication.status === "reviewing"
                          ? t("تحت المراجعة") + "⏳"
                          : userApplication.status === "shortlisted" ||
                              userApplication.status === "interviewed" ||
                              userApplication.status === "hired"
                            ? t("تم القبول (تواصل معنا)") + " ✅"
                            : userApplication.status === "declined"
                              ? t("نأسف، تم الرفض") + " ❌"
                              : t("تحت المراجعة") + " ⏳"}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <button
                    className={job.isActive ? styles.applyBtn : styles.closedBtn}
                    onClick={handleApplyClick}
                    disabled={!job.isActive}
                  >
                    {job.isActive ? t("تقدم الآن") : t("مغلق")}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "details" ? (
          <>
            {/* Main 2-Column Layout */}
            <div className={styles.mainLayout}>
              {/* Left Column */}
              <div className={styles.leftCol}>
                {(() => {
                  const descriptionToUse =
                    lang === "en" && job.descriptionEn
                      ? job.descriptionEn
                      : job.description;
                  if (!descriptionToUse) return null;

                  const sections: Record<string, string> = {};
                  let currentTitle = "الوصف";
                  let currentLines: string[] = [];

                  const lines = descriptionToUse.split("\n");
                  lines.forEach((line: string) => {
                    const headerMatch = line.match(/^\*\*(.*):\*\*$/);
                    if (headerMatch) {
                      sections[currentTitle] = currentLines.join("\n").trim();
                      currentTitle = headerMatch[1];
                      currentLines = [];
                    } else {
                      currentLines.push(line);
                    }
                  });
                  sections[currentTitle] = currentLines.join("\n").trim();

                  return Object.entries(sections).map(([title, content]) => {
                    if (!content) return null;

                    const isList =
                      content.includes("•") || content.includes("- ");
                    const listItems = content
                      .split("\n")
                      .map((li) => li.replace(/^[•\-\s*]+/, "").trim())
                      .filter((li) => li.length > 0);

                    return (
                      <section key={title} className={styles.section}>
                        <h2>{t(title)}</h2>
                        {isList ? (
                          <ul className={styles.list}>
                            {listItems.map((item, i) => (
                              <li key={i}>
                                <CheckIcon />
                                {t(item)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{ __html: t(content) }}
                            className={styles.descriptionText}
                          />
                        )}
                      </section>
                    );
                  });
                })()}
              </div>

              {/* Right Column */}
              <div className={styles.rightCol}>
                <div className={styles.widget}>
                  <h2>{t("عن الوظيفة")}</h2>
                  <div className={styles.capacityBox}>
                    <div className={styles.capacityText}>
                      <span className={styles.boldText}>
                        {job.applications?.length || 0} {t("تم التقديم")}
                      </span>{" "}
                      {t("من")} {job.slotsAvailable || 10} {t("متاح")}
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${Math.min(
                            ((job.applications?.length || 0) /
                              (job.slotsAvailable || 10)) *
                              100,
                            100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={styles.roleDetails}>
                    <div className={styles.roleRow}>
                      <span className={styles.roleLabel}>{t("نشر في")}</span>
                      <span className={styles.roleValue}>
                        {job.createdAt
                          ? t(new Date(job.createdAt).toLocaleDateString())
                          : t("غير متاح")}
                      </span>
                    </div>
                    {job.expiresAt && (
                      <div className={styles.roleRow}>
                        <span className={styles.roleLabel}>{t("تقدم قبل")}</span>
                        <span
                          className={styles.roleValue}
                          className={styles.expiresAtValue}
                        >
                          {t(new Date(job.expiresAt).toLocaleDateString())}
                        </span>
                      </div>
                    )}

                    <div className={styles.roleRow}>
                      <span className={styles.roleLabel}>
                        {t("نوع الوظيفة")}
                      </span>
                      <span
                        className={styles.roleValue}
                        style={{ textTransform: "capitalize" }}
                      >
                        {job.jobType === "full-time"
                          ? t("دوام كامل")
                          : job.jobType === "part-time"
                            ? t("دوام جزئي")
                            : t(job.jobType || "دوام كامل")}
                      </span>
                    </div>
                    <div className={styles.roleRow}>
                      <span className={styles.roleLabel}>{t("الراتب")}</span>
                      <span className={styles.roleValue} dir="ltr" style={{ display: "inline-block", textAlign: "right" }}>
                        {job.salaryMin === job.salaryMax || !job.salaryMax
                          ? `${job.salaryMin || 0} EGP`
                          : `${job.salaryMin || 0} - ${job.salaryMax} EGP`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.separator}></div>

                {(job.category || (job as any).categoryName) && (
                  <>
                    <div className={styles.widget}>
                      <h2>{t("الأقسام")}</h2>
                      <div className={styles.tagsContainer}>
                        <span className={styles.tagYellow}>
                          {job.category ? t(job.category.name) : t((job as any).categoryName)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.separator}></div>
                  </>
                )}


              </div>
            </div>

            {/* Perks & Benefits */}
            <div className={styles.perksSection}>
              <div className={styles.perksHeader}>
                <h2>{t("المزايا والفوائد")}</h2>
                <p>{t("نحن نقدم مزايا رائعة لموظفينا.")}</p>
              </div>
              <div className={styles.perksGrid}>
                {job.company?.benefits && job.company.benefits.length > 0 ? (
                  job.company.benefits.map((benefit: Benefit, idx: number) => (
                    <div key={idx} className={styles.perkCard}>
                      <div
                        className={styles.perkIcon}
                        style={{
                          fontSize: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {benefit.emoji}
                      </div>
                      <h3>{t(benefit.name)}</h3>
                      <p>{t(benefit.desc)}</p>
                    </div>
                  ))
                ) : (
                  <p>{t("لا توجد مزايا محددة.")}</p>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            <div className={styles.similarJobsSection}>
              <div className={styles.similarHeader}>
                <h2>{t("وظائف مشابهة")}</h2>
                <Link to="/JobListing" className={styles.companyLink}>
                  {t("عرض كل الوظائف")}{" "}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>

              <div className={styles.similarGrid}>
                {similarJobs.length > 0 ? (
                  similarJobs.map((simJob: Job) => (
                    <div
                      key={simJob.jobId}
                      className={styles.similarJobCard}
                      onClick={() => {
                        navigate("/Job details", {
                          state: { jobId: simJob.jobId },
                        });
                        window.scrollTo(0, 0);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={styles.simLogo}
                        style={{
                          backgroundColor: simJob.company?.logoUrl
                            ? "transparent"
                            : "#4640de",
                        }}
                      >
                        <img
                          src={
                            simJob.company?.logoUrl
                              ? simJob.company.logoUrl.startsWith("http")
                                ? simJob.company.logoUrl
                                : `${API_BASE_URL}${simJob.company.logoUrl}`
                              : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  simJob.company?.name || "Company",
                                )}`
                          }
                          alt={simJob.company?.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "inherit",
                          }}
                        />
                      </div>
                      <div className={styles.simDetails}>
                        <div className={styles.simTitleGroup}>
                          <h3>{t(simJob.title)}</h3>
                          <p>
                            {t(simJob.company?.name || "") || "Jobito"} •{" "}
                            {t(simJob.address || "") || t("عالمي")}
                          </p>
                        </div>
                        <div className={styles.simTags}>
                          <span className={styles.tagGreen}>
                            {simJob.jobType === "full-time"
                              ? t("دوام كامل")
                              : t("دوام جزئي")}
                          </span>
                          {simJob.category && (
                            <span className={styles.tagYellowOutline}>
                              {t(simJob.category.name)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>{t("لا توجد وظائف مشابهة متاحة.")}</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.applicantsContainer}>
            <AllApplicants jobIdProp={jobId} />
          </div>
        )}
      </div>

      <ApplyJobModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={jobId}
        jobTitle={t(job?.title || "")}
        companyName={t(job?.company?.name || "شركة")}
        location={t(job?.address || "عن بعد")}
        jobType={job?.jobType === "full-time" ? t("دوام كامل") : t("دوام جزئي")}
        isActive={job?.isActive}
        logoUrl={
          job?.company?.logoUrl
            ? job.company.logoUrl.startsWith("http")
              ? job.company.logoUrl
              : `${API_BASE_URL}${job.company.logoUrl}`
            : undefined
        }
      />
    </div>
  );
};
