import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./All Applicants.css";
import { useJobitoAuth } from "../../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Applicant {
  applicationId: number;
  status: string;
  appliedAt: string;
  portfolioUrl?: string;
  coverLetter?: string;
  resumeUrl?: string;
  user: {
    userId: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    phone?: string;
    skills?: string[];
  };
}

const SortIcon = () => (
  <svg
    width="10"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "4px", opacity: 0.5 }}
  >
    <polyline points="7 10 12 5 17 10" />
    <polyline points="7 14 12 19 17 14" />
  </svg>
);

const CustomCheckbox = () => <div className="custom-checkbox"></div>;

export default function AllApplicants() {
  const { apiFetch } = useJobitoAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState("Table View");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    hired: false,
    declined: false,
    inreview: false,
    waitlisted: false,
  });
  const navigate = useNavigate();

  const toggleFilter = (key: keyof typeof statusFilters) => {
    setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        setError("لم يتم تحديد الوظيفة");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await apiFetch(`${API_BASE_URL}/applications/job/${jobId}`);
        if (!res.ok) {
          throw new Error("فشل في جلب بيانات المتقدمين");
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setApplicants(list);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError(err instanceof Error ? err.message : "خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId, apiFetch]);

  const handleDeleteApplicant = async (applicationId: number) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا المتقدم بشكل نهائي؟")) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("فشل في حذف المتقدم");
      setApplicants((prev) => prev.filter((app) => app.applicationId !== applicationId));
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء محاولة الحذف");
    }
  };

  const getBadgeClass = (stage: string) => {
    const s = (stage || "applied").toLowerCase();
    switch (s) {
      case "applied":
      case "inreview":
      case "reviewing":
      case "interviewed":
      case "interviewing":
        return "badge-inreview";
      case "shortlisted":
      case "waitlisted":
        return "badge-waitlisted";
      case "declined":
        return "badge-declined";
      case "hired":
        return "badge-hired";
      default:
        return "badge-inreview";
    }
  };

  const getTranslatedStage = (stage: string) => {
    const s = (stage || "applied").toLowerCase();
    switch (s) {
      case "applied":
      case "inreview":
      case "reviewing":
        return "تحت المراجعة";
      case "shortlisted":
      case "waitlisted":
        return "في الانتظار";
      case "declined":
        return "مرفوض";
      case "hired":
        return "تم التوظيف";
      case "interviewed":
      case "interviewing":
        return "تمت المقابلة";
      case "offered":
        return "عرض عمل";
      default:
        return stage;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getAvatarUrl = (url?: string, name?: string) => {
    if (url) {
      if (url.startsWith("http")) return url;
      return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${name || "User"}`;
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      (app.user?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const anyFilterActive = statusFilters.hired || statusFilters.declined || statusFilters.inreview || statusFilters.waitlisted;
    if (!anyFilterActive) return matchesSearch;

    const s = (app.status || "applied").toLowerCase();
    const matchesStatus =
      (statusFilters.hired && s === "hired") ||
      (statusFilters.declined && s === "declined") ||
      (statusFilters.waitlisted && ["waitlisted", "shortlisted"].includes(s)) ||
      (statusFilters.inreview && ["applied", "inreview", "reviewing", "interviewing", "interviewed"].includes(s));

    return matchesSearch && matchesStatus;
  });


  if (loading) {
    return (
      <div className="applicant-page">
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7C8493" }}>
          جاري تحميل المتقدمين...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applicant-page">
        <div style={{ textAlign: "center", padding: "60px 0", color: "#FF6B6B" }}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="applicant-page">
      <div className="top-p-header">
        <h2 className="top-p-title">
          إجمالي المتقدمين : {applicants.length}
        </h2>
        <div className="top-p-actions">
          <div className="search-box">
           
            <input
              type="text"
              placeholder="البحث عن متقدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="filter-checkboxes">
        <label className={`filter-chip ${statusFilters.hired ? "filter-chip-active filter-chip-hired" : ""}`}>
          <input
            type="checkbox"
            checked={statusFilters.hired}
            onChange={() => toggleFilter("hired")}
          />
          تم التوظيف
        </label>
        <label className={`filter-chip ${statusFilters.declined ? "filter-chip-active filter-chip-declined" : ""}`}>
          <input
            type="checkbox"
            checked={statusFilters.declined}
            onChange={() => toggleFilter("declined")}
          />
          مرفوض
        </label>
        <label className={`filter-chip ${statusFilters.waitlisted ? "filter-chip-active filter-chip-waitlisted" : ""}`}>
          <input
            type="checkbox"
            checked={statusFilters.waitlisted}
            onChange={() => toggleFilter("waitlisted")}
          />
          في الانتظار
        </label>
        <label className={`filter-chip ${statusFilters.inreview ? "filter-chip-active filter-chip-inreview" : ""}`}>
          <input
            type="checkbox"
            checked={statusFilters.inreview}
            onChange={() => toggleFilter("inreview")}
          />
          تحت المراجعة
        </label>
      </div>

      <div className="table-container">
        <table className="applicant-table">
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: "center" }}>
                <CustomCheckbox />
              </th>
              <th>
                الاسم الكامل <SortIcon />
              </th>
              <th>
                البريد الإلكتروني <SortIcon />
              </th>
              <th>
                مرحلة التوظيف <SortIcon />
              </th>
              <th>
                تاريخ التقديم <SortIcon />
              </th>
              <th>
                الهاتف <SortIcon />
              </th>
              <th>
                الإجراء <SortIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredApplicants.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#7C8493" }}>
                  لا يوجد متقدمون لهذه الوظيفة بعد.
                </td>
              </tr>
            ) : (
              filteredApplicants.map((app) => (
                <tr key={app.applicationId}>
                  <td style={{ textAlign: "center" }}>
                    <CustomCheckbox />
                  </td>
                  <td>
                    <div className="app-user">
                      <img
                        src={getAvatarUrl(app.user?.avatarUrl, app.user?.fullName)}
                        alt={app.user?.fullName || "User"}
                      />
                      <span>{app.user?.fullName || "مستخدم"}</span>
                    </div>
                  </td>
                  <td className="app-role">{app.user?.email || "—"}</td>
                  <td>
                    <span className={`app-badge ${getBadgeClass(app.status)}`}>
                      {getTranslatedStage(app.status)}
                    </span>
                  </td>
                  <td className="app-date">{formatDate(app.appliedAt)}</td>
                  <td className="app-role">{app.user?.phone || "—"}</td>
                  <td>
                    <div className="app-actions">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl.startsWith("http") ? app.resumeUrl : `${API_BASE_URL}${app.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="see-app-btn"
                          style={{ textDecoration: "none" }}
                        >
                          السيرة الذاتية
                        </a>
                      )}
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="see-app-btn"
                          style={{ textDecoration: "none" }}
                        >
                          Portfolio
                        </a>
                      )}
                      <button 
                        className="see-app-btn"
                        onClick={() => navigate(`/ApplicantDetails/${app.applicationId}`)}
                      >
                        عرض الطلب
                      </button>
                      <button 
                        className="delete-app-btn"
                        onClick={() => handleDeleteApplicant(app.applicationId)}
                        title="حذف المتقدم"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-footer">
        <div className="page-size-wrap">
          عرض
          <div className="page-select-box">
            <span>10</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          لكل صفحة
        </div>
        <div className="page-controls">
          <button className="page-nav">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          <button className="page-num active">1</button>
          <button className="page-nav">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
