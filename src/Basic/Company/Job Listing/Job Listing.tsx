import { useState, useEffect, useCallback } from "react";
import "./Job Listing.css";
import { useNavigate } from "react-router-dom";
import { useJobitoAuth } from "../../../context/LinkContxt";
import { useTranslation } from "../../../context/translation-context";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Job {
  jobId?: number;
  job_id?: number;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  jobType: string;
  slotsAvailable: number;
  salary: number;
  appliedCount?: number;
}

export default function JobListing() {
  const { user, apiFetch } = useJobitoAuth();
  const { t, language } = useTranslation();
  console.log("Logged in as:", user?.name);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("المتقدمون");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      let companyId;
      try {
        const profileRes = await apiFetch(
          `${API_BASE_URL}/companies/my/profile`,
        );
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.companyId) {
            companyId = profileData.companyId;
          }
        }
      } catch (e) {
        console.warn("Profile fetch failed:", e);
      }

      const url = companyId
        ? `${API_BASE_URL}/jobs?companyId=${companyId}`
        : `${API_BASE_URL}/jobs`;

      const jobsRes = await apiFetch(url);

      if (!jobsRes.ok) {
        const errData = await jobsRes.json().catch(() => ({}));
        throw new Error(
          errData.message || `Failed to fetch jobs (Status: ${jobsRes.status})`,
        );
      }
      const jobsData = await jobsRes.json();
      setJobs(jobsData.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [navigate, apiFetch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    const id = job.jobId || job.job_id;
    if (!id || !window.confirm(t("هل أنت متأكد من حذف هذه الوظيفة؟"))) return;

    try {
      const res = await apiFetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setJobs(jobs.filter((j) => (j.jobId || j.job_id) !== id));
      } else {
        const data = await res.json();
        alert(t(data.message) || t("فشل حذف الوظيفة"));
      }
    } catch {
      alert(t("خطأ أثناء حذف الوظيفة"));
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    const id = job.jobId || job.job_id;
    const currentActive =
      job.isActive !== undefined ? job.isActive : job.is_active;

    if (id === undefined) return;

    try {
      const res = await apiFetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (res.ok) {
        const updated = await res.json();
        setJobs(
          jobs.map((j) =>
            (j.jobId || j.job_id) === id
              ? {
                  ...j,
                  isActive: updated.isActive,
                  is_active: updated.isActive,
                }
              : j,
          ),
        );
      } else {
        const data = await res.json();
        alert(t(data.message) || t("فشل تحديث الحالة"));
      }
    } catch {
      alert(t("خطأ أثناء تحديث الحالة"));
    }
  };

  const handleEdit = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    navigate("/PostJob", { state: { editJob: job } });
  };

  const getStatusClass = (isActive: boolean) => {
    return isActive ? "status-open" : "status-closed";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? t("مفتوح") : t("مغلق");
  };

  const getTypeClass = (type: string) => {
    const t = (type || "").toLowerCase();
    return t === "full-time" || t === "part-time"
      ? "type-fulltime"
      : "type-freelance";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <div className="jl-loading">{t("جاري التحميل...")}</div>;
  if (error) return <div className="jl-error">{t("خطأ")}: {t(error)}</div>;

  return (
    <div className="job-listing-page">
      <div className="jl-header-area">
        <div className="jl-title-row">
          <div className="jl-title-group">
            <h1 className="jl-title">{t("قائمة الوظائف")}</h1>
            <p className="jl-subtitle">
              {t("إدارة الوظائف التي قمت بنشرها ومتابعة المتقدمين.")}
            </p>
          </div>
        </div>

        <div className="jl-tabs">
          {["المتقدمون"].map((tab) => (
            <button
              key={tab}
              className={`jl-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </div>

      <div className="jl-main-card">
        <div className="jl-card-toolbar">
          <h2 className="jl-card-title">{t("قائمة الوظائف")} ({jobs.length})</h2>
          <button className="jl-filter-btn">
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
              <line x1="4" y1="6" x2="16" y2="6"></line>
              <line x1="8" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="12" y2="18"></line>
            </svg>
            {t("تصفية")}
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="jl-empty-state">{t("لا توجد وظائف منشورة حالياً.")}</div>
        ) : (
          <table className="jl-table">
            <thead>
              <tr>
                <th>{t("المسمى الوظيفي")}</th>
                <th>{t("الحالة")}</th>
                <th>{t("تاريخ النشر")}</th>
                <th>{t("نوع الوظيفة")}</th>
                <th>{t("المتقدمون")}</th>
                <th>{t("المقاعد")}</th>
                <th>{t("الإجراءات")}</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.jobId || job.job_id}
                  onClick={() =>
                    navigate("/Job details", {
                      state: { jobId: job.jobId || job.job_id },
                    })
                  }
                >
                  <td className="jl-col-role">{t(job.title)}</td>
                  <td>
                    <span
                      className={`jl-status-badge ${getStatusClass(job.isActive)}`}
                    >
                      {getStatusText(job.isActive)}
                    </span>
                  </td>
                  <td className="jl-col-date">{formatDate(job.createdAt)}</td>
                  <td>
                    <span
                      className={`jl-type-badge ${getTypeClass(job.jobType)}`}
                    >
                      {t(job.jobType) || t("دوام كامل")}
                    </span>
                  </td>
                  <td className="jl-col-appl">
                    <button
                      className="jl-applicants-link"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4640DE",
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "inherit",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/AllApplicants?jobId=${job.jobId || job.job_id}`,
                        );
                      }}
                    >
                      {job.appliedCount || 0}
                    </button>
                  </td>
                  <td className="jl-col-needs">
                    <strong>{job.slotsAvailable}</strong>
                  </td>
                  <td>
                    <div className="jl-actions">
                      <button
                        className="jl-action-btn edit"
                        title={t("تعديل")}
                        onClick={(e) => handleEdit(e, job)}
                      >
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
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={`jl-action-btn ${job.isActive ? "close" : "reopen"}`}
                        title={job.isActive ? t("إغلاق") : t("فتح")}
                        onClick={(e) => handleToggleStatus(e, job)}
                      >
                        {job.isActive ? (
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
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="9" y1="9" x2="15" y2="15" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                          </svg>
                        ) : (
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
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        )}
                      </button>
                      <button
                        className="jl-action-btn delete"
                        title={t("حذف")}
                        onClick={(e) => handleDelete(e, job)}
                      >
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
