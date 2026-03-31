import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AllJobs.module.css";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useJobitoAuth } from "../../../context/AuthContext";
import { useRef } from "react";
import {
  FiGrid,
  FiList,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getFullImageUrl = (url?: string, seed?: string) => {
  if (!url) return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed || 'company'}`;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface Job {
  jobId: string | number;
  title: string;
  company?: {
    name: string;
    address?: string;
    logoUrl?: string;
  };
  address: string;
  jobType: string;
  slotsAvailable: number;
  salary?: number;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  expiresAt?: string;
  createdAt?: string;
  appliedCount?: number;
  companyId?: number | string;
  categoryId?: number;
  category?: { name: string };
  applications?: any[];
  classification?: string;
}

const sidebarVariant: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface AllJobsProps {
  searchKeyword?: string;
  location?: string;
}

const AllJobs: React.FC<AllJobsProps> = ({
  searchKeyword = "",
  location = "",
}) => {
  const { apiFetch, isAuthenticated, role } = useJobitoAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">(() => {
    return (localStorage.getItem("jobs_view") as "grid" | "list") || "list";
  });
  const [likedJobs, setLikedJobs] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Fetch Guards
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef<string | null>(null);
  const renderCount = useRef(0);
  renderCount.current++;

  // Persist view preference
  useEffect(() => {
    localStorage.setItem("jobs_view", view);
  }, [view]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);

  // Fetch initial data: Jobs and Favorites
  useEffect(() => {
    const currentParams = JSON.stringify({ searchKeyword, location });
    const abortController = new AbortController();

    const fetchData = async () => {
      // 1. Prevent concurrent identical fetches
      if (fetchInProgress.current && lastFetchParams.current === currentParams) {
        console.log(`🚫 [AllJobs] [Render ${renderCount.current}] Skipping redundant fetch for same params.`);
        return;
      }

      // 2. Track current fetch operation
      console.log(`🔍 [AllJobs] [Render ${renderCount.current}] Starting fetchData...`, { searchKeyword, location });
      fetchInProgress.current = true;
      lastFetchParams.current = currentParams;

      setLoading(true);
      try {
        // Fetch Jobs: Use AI Smart Search when search keyword exists
        let jobsList: Job[] = [];

        if (searchKeyword && searchKeyword.trim() !== '') {
          // 🧠 AI Smart Search - uses role tagging, query expansion, and scoring
          const smartParams = new URLSearchParams({ q: searchKeyword });
          if (location) smartParams.append('location', location);

          const smartRes = await fetch(`${API_BASE_URL}/ai/smart-search?${smartParams.toString()}`, {
            signal: abortController.signal,
          });

          console.log(`🧠 [AllJobs] Smart Search API Status: ${smartRes.status} for query: "${searchKeyword}"`);

          if (!smartRes.ok) {
            throw new Error(`Smart Search error: ${smartRes.status}`);
          }

          const smartData = await smartRes.json();
          if (abortController.signal.aborted) return;

          jobsList = smartData.data || [];
          console.log(`✅ [AllJobs] Smart Search returned ${jobsList.length} jobs. Expanded tags: ${(smartData.expandedTags || []).join(', ')}`);
        } else {
          // Regular fetch when no search keyword
          const queryParams = new URLSearchParams({
            limit: '100',
            ...(location && { location: location }),
          });

          const jobsRes = await fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`, {
            signal: abortController.signal,
          });

          console.log(`🌐 [AllJobs] Jobs API Status: ${jobsRes.status}`);

          if (!jobsRes.ok) {
            const errorText = await jobsRes.text();
            console.error(`❌ [AllJobs] Jobs API Error Detail:`, errorText);
            throw new Error(`Server returned ${jobsRes.status}: ${jobsRes.statusText}`);
          }

          const jobsData = await jobsRes.json();
          if (abortController.signal.aborted) return;

          jobsList = (jobsData && jobsData.data) ? jobsData.data : (Array.isArray(jobsData) ? jobsData : []);
        }

        console.log(`✅ [AllJobs] Received ${jobsList.length} jobs.`);
        setJobs(jobsList);

        // Fetch Favorites
        if (isAuthenticated) {
          try {
            const favsRes = await apiFetch(`${API_BASE_URL}/favorites`, { 
              signal: abortController.signal 
            });
            
            if (favsRes.ok && !abortController.signal.aborted) {
              const favIds = await favsRes.json();
              if (Array.isArray(favIds)) {
                const favMap: Record<string, boolean> = {};
                favIds.forEach((id) => { if (id) favMap[id.toString()] = true; });
                setLikedJobs(favMap);
              }
            }
          } catch (favErr) {
            if (favErr instanceof Error && favErr.name === 'AbortError') return;
            console.error("❌ [AllJobs] Error fetching favorites:", favErr);
          }
        }
        
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log("⏹️ [AllJobs] Fetch aborted by cleanup.");
          return;
        }
        console.error("❌ [AllJobs] CRITICAL Error fetching data:", err);
        setError(`فشل في تحميل البيانات: ${err instanceof Error ? err.message : "خطأ غير معروف"}`);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
          fetchInProgress.current = false;
        }
      }
    };

    fetchData();

    return () => {
      // Cancel pending request on unmount or dependency change
      console.log(`🚮 [AllJobs] [Render ${renderCount.current}] Cleaning up effect...`);
      abortController.abort();
      fetchInProgress.current = false;
    };
  }, [searchKeyword, location, isAuthenticated, apiFetch]);
 
  const toggleLike = async (e: React.MouseEvent, jobId: string | number | undefined) => {
    e.stopPropagation();
    if (!jobId) return;

    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      alert("يرجى تسجيل الدخول لحفظ الوظائف المفضلة.");
      return;
    }

    try {
      const res = await apiFetch(`${API_BASE_URL}/favorites/toggle/${jobId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const result = await res.json();
        setLikedJobs((prev) => ({
          ...prev,
          [jobId.toString()]: result.isFavorite,
        }));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const getJobLevel = (job: Job) => {
    // 1. Use explicit classification field if available
    if (job.classification) return job.classification;

    const text = (job.title + " " + (job.description || "")).toLowerCase();
    
    // 2. Fallback: Check for explicit Classification tags in text
    if (text.includes("التصنيف: تقني") || text.includes("تقني")) return "تقني";
    if (text.includes("التصنيف: غير تقني") || text.includes("غير تقني")) return "غير تقني";
    if (text.includes("التصنيف: صنيعي") || text.includes("صنيعي")) return "صنيعي";

    if (text.includes("director") || text.includes("مدير")) return "مدير";
    if (text.includes("senior") || text.includes("خبير")) return "خبير";
    if (text.includes("mid") || text.includes("متوسط")) return "متوسط الخبرة";
    if (text.includes("vp") || text.includes("نائب")) return "نائب رئيس وأعلى";
    return "مبتدئ";
  };

  const getSalaryRange = (job: Job) => {
    const s = job.salary || job.salaryMin || 0;
    if (s >= 3000) return "٣٠٠٠$ أو أكثر";
    if (s >= 1500) return "١٥٠٠$ - ٢٠٠٠$";
    if (s >= 1000) return "١٠٠٠$ - ١٥٠٠$";
    if (s >= 700) return "٧٠٠$ - ١٠٠٠$";
    return null;
  };

  const filteredJobs = jobs.filter((job, index) => {
    const keywordLower = searchKeyword.toLowerCase();
    const keywordMatch =
      !searchKeyword ||
      job.title?.toLowerCase().includes(keywordLower) ||
      job.company?.name?.toLowerCase().includes(keywordLower);

    const locationMatch =
      !location || job.address?.toLowerCase().includes(location.toLowerCase());

    const typeMatch =
      selectedTypes.length === 0 ||
      selectedTypes.some((t) => {
        const jt = (job.jobType || "").toLowerCase();
        if (t === "دوام كامل") return jt === "full-time";
        if (t === "دوام جزئي") return jt === "part-time";
        if (t === "عن بعد") return jt === "remote";
        if (t === "تدريب") return jt === "internship";
        if (t === "عمل لمرة واحدة") return jt === "one-time";
        return jt.includes(t.toLowerCase());
      });

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => {
        const cn = (job.category?.name || "").toLowerCase();
        if (cat === "تصميم") return cn.includes("design") || job.categoryId === 16;
        if (cat === "مبيعات") return cn.includes("sales") || job.categoryId === 15;
        if (cat === "تسويق") return cn.includes("marketing") || job.categoryId === 14;
        if (cat === "أعمال") return cn.includes("business");
        if (cat === "موارد بشرية") return cn.includes("hr") || job.categoryId === 3;
        if (cat === "مالية") return cn.includes("finance") || job.categoryId === 13;
        if (cat === "هندسة") return cn.includes("engineering") || job.categoryId === 11;
        if (cat === "تكنولوجيا") return cn.includes("technology") || job.categoryId === 12;
        return cn.includes(cat.toLowerCase());
      });

    const levelMatch = 
      selectedLevels.length === 0 || 
      selectedLevels.includes(getJobLevel(job));

    const salaryMatch = 
      selectedSalaries.length === 0 || 
      selectedSalaries.includes(getSalaryRange(job) || "");

    const result = keywordMatch && locationMatch && typeMatch && categoryMatch && levelMatch && salaryMatch;
    if (index === 0) console.log(`🔍 [AllJobs] Filter Debug: Job[0] match=${result}`, { keywordMatch, locationMatch, typeMatch, categoryMatch, levelMatch, salaryMatch });
    return result;
  });

  console.log(`📊 [AllJobs] Displaying ${filteredJobs.length} jobs out of ${jobs.length} total.`);

  const totalItems = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / jobsPerPage));
  const adjustedPage = Math.min(currentPage, totalPages);

  const currentJobs = filteredJobs.slice(
    (adjustedPage - 1) * jobsPerPage,
    adjustedPage * jobsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className={styles.jobsPage} style={{ direction: "rtl" }}>
      <motion.aside
        className={styles.sidebar}
        variants={sidebarVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Filter
          title="نوع التوظيف"
          items={[
            { name: "دوام كامل", count: jobs.filter(j => (j.jobType || "").toLowerCase() === "full-time").length },
            { name: "دوام جزئي", count: jobs.filter(j => (j.jobType || "").toLowerCase() === "part-time").length },
            { name: "عن بعد", count: jobs.filter(j => (j.jobType || "").toLowerCase() === "remote").length },
            { name: "تدريب", count: jobs.filter(j => (j.jobType || "").toLowerCase() === "internship").length },
            { name: "عمل لمرة واحدة", count: jobs.filter(j => (j.jobType || "").toLowerCase() === "one-time").length },
          ]}
          selected={selectedTypes}
          setSelected={setSelectedTypes}
        />

        <Filter
          title="صنيفات"
          items={[
            { name: "تقني", count: jobs.filter(j => getJobLevel(j) === "تقني").length },
            { name: "غير تقني", count: jobs.filter(j => getJobLevel(j) === "غير تقني").length },
            { name: "صنيعي", count: jobs.filter(j => getJobLevel(j) === "صنيعي").length },
          ]}
          selected={selectedLevels}
          setSelected={setSelectedLevels}
        />

        <Filter
          title="نطاق الراتب"
          items={[
            { name: "٧٠٠$ - ١٠٠٠$", count: jobs.filter(j => getSalaryRange(j) === "٧٠٠$ - ١٠٠٠$").length },
            { name: "١٠٠٠$ - ١٥٠٠$", count: jobs.filter(j => getSalaryRange(j) === "١٠٠٠$ - ١٥٠٠$").length },
            { name: "١٥٠٠$ - ٢٠٠٠$", count: jobs.filter(j => getSalaryRange(j) === "١٥٠٠$ - ٢٠٠٠$").length },
            { name: "٣٠٠٠$ أو أكثر", count: jobs.filter(j => getSalaryRange(j) === "٣٠٠٠$ أو أكثر").length },
          ]}
          selected={selectedSalaries}
          setSelected={setSelectedSalaries}
        />
      </motion.aside>

      <main className={styles.jobsContent}>
        {error && <div className={styles.apiStatus}>⚠️ {error}</div>}

        <div className={styles.jobsHeader}>
          <div>
            <h2>جميع الوظائف</h2>
            <p>
              عرض {filteredJobs.length} نتائج
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.sort}>
              ترتيب حسب:
              <select
                defaultValue="Newest"
                onChange={(e) => {
                  const sortType = e.target.value;
                  const sorted = [...jobs].sort((a, b) => {
                    if (sortType === "Newest")
                      return (
                        new Date(b.createdAt || 0).getTime() -
                        new Date(a.createdAt || 0).getTime()
                      );
                    if (sortType === "Oldest")
                      return (
                        new Date(a.createdAt || 0).getTime() -
                        new Date(b.createdAt || 0).getTime()
                      );
                    return 0;
                  });
                  setJobs(sorted);
                }}
              >
                <option value="Newest">الأحدث</option>
                <option value="Oldest">الأقدم</option>
              </select>
            </div>
            <div className={styles.viewToggles}>
              <button
                className={`${styles.toggleBtn} ${view === "grid" ? styles.active : ""}`}
                onClick={() => setView("grid")}
              >
                <FiGrid size={20} />
              </button>
              <button
                className={`${styles.toggleBtn} ${view === "list" ? styles.active : ""}`}
                onClick={() => setView("list")}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={`${styles.list} ${view === "grid" ? styles.gridView : ""}`}>
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className={styles.loading}>جاري التحميل...</div>
            ) : currentJobs.length === 0 ? (
              <div className={styles.loading}>
                لم يتم العثور على وظائف.
              </div>
            ) : (
              currentJobs.map((job, index) => (
                <motion.div
                  key={job.jobId || `job-${index}`}
                  className={view === "grid" ? styles.jobCard : styles.jobRow}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  layout
                  onClick={() =>
                    navigate("/Job details", { state: { jobId: job.jobId } })
                  }
                >
                  {view === "list" ? (
                    <>
                      <div className={styles.jobLeft}>
                        <div className={styles.logoPlaceholder}>
                          <img
                            src={getFullImageUrl(job.company?.logoUrl, job.company?.name || job.jobId?.toString())}
                            alt="Logo"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name || job.jobId}`;
                            }}
                          />
                        </div>
                        <div className={styles.jobInfo}>
                          <h3>{job.title || "وظيفة بدون عنوان"}</h3>
                          <p>
                            {job.company?.name || "جوبيتو المحدودة"} •{" "}
                            {job.address || "الموقع"}
                          </p>
                          <div className={styles.tags}>
                            <span className={`${styles.tag} ${styles.fulltime}`}>
                                {job.jobType === "full-time"
                                  ? "دوام كامل"
                                  : job.jobType === "part-time"
                                    ? "دوام جزئي"
                                    : job.jobType === "remote"
                                      ? "عن بعد"
                                      : job.jobType === "internship"
                                        ? "تدريب"
                                        : job.jobType === "one-time"
                                          ? "عمل لمرة واحدة"
                                          : job.jobType}
                              </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.jobRight}>
                        <div
                          className={`${styles.like} ${job.jobId && likedJobs[job.jobId.toString()] ? styles.liked : ""}`}
                          onClick={(e) => toggleLike(e, job.jobId)}
                        >
                          {job.jobId && likedJobs[job.jobId.toString()] ? (
                            <FaHeart size={22} />
                          ) : (
                            <FaRegHeart size={22} />
                          )}
                        </div>
                        <button 
                          className={styles.applyBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) {
                              navigate("/user-information");
                            } else {
                              navigate("/Job details", { state: { jobId: job.jobId } });
                            }
                          }}
                        >
                          تقدم الآن
                        </button>
                        <div className={styles.statusContainer}>
                          <span className={styles.appliedBadge}>
                            <strong>{job.applications?.length || job.appliedCount || 0}</strong> المتقدمين
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* --- GRID VIEW --- */}
                      <div className={styles.cardHeader}>
                        <div className={styles.cardLogo}>
                          <img
                            src={getFullImageUrl(job.company?.logoUrl, job.company?.name || job.jobId?.toString())}
                            alt="Logo"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name || job.jobId}`;
                            }}
                          />
                        </div>
                        <div
                          className={`${styles.like} ${job.jobId && likedJobs[job.jobId.toString()] ? styles.liked : ""}`}
                          onClick={(e) => toggleLike(e, job.jobId)}
                        >
                          {job.jobId && likedJobs[job.jobId.toString()] ? (
                            <FaHeart size={22} />
                          ) : (
                            <FaRegHeart size={22} />
                          )}
                        </div>
                      </div>
                      <div className={styles.cardBody}>
                        <h3>{job.title || "عنوان الوظيفة"}</h3>
                        <p style={{ fontWeight: "bold", fontSize: "0.9rem", color: "#6b7280", marginBottom: "8px" }}>
                          {job.company?.name || "جوبيتو"}
                        </p>
                        <p className={styles.cardDesc}>
                          {job.description ? (job.description.length > 80 ? job.description.substring(0, 80) + "..." : job.description) : "لا يوجد وصف لهذه الوظيفة حالياً."}
                        </p>
                      </div>
                      <div className={styles.cardFooter}>
                        <span className={`${styles.tag} ${styles.fulltime}`}>
                          {job.jobType === "full-time" ? "دوام كامل"
                            : job.jobType === "part-time" ? "دوام جزئي"
                            : job.jobType === "remote" ? "عن بعد"
                            : job.jobType === "internship" ? "تدريب"
                            : job.jobType === "contract" ? "عقد"
                            : job.jobType}
                        </span>
                        {job.address && (
                          <span className={`${styles.tag} ${styles.tagBusiness}`}>
                            {job.address}
                          </span>
                        )}
                      </div>
                      <div className={styles.cardAction}>
                         <div className={styles.statusContainerGrid}>
                            <span className={styles.appliedBadge}>
                              <strong>{job.applications?.length || job.appliedCount || 0}</strong> المتقدمين
                            </span>
                         </div>
                         <button 
                           className={styles.applyBtnGrid}
                           onClick={(e) => {
                             e.stopPropagation();
                             if (!isAuthenticated) {
                               navigate("/user-information");
                             } else {
                               navigate("/Job details", { state: { jobId: job.jobId } });
                             }
                           }}
                         >
                           تقدم
                         </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.navBtn}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FiChevronRight />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.active : ""}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className={styles.pageBtn}>
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className={styles.navBtn}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FiChevronLeft />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

interface FilterItem {
  name: string;
  count: number;
}
interface FilterProps {
  title: string;
  items: FilterItem[];
  selected: string[];
  setSelected: (items: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({
  title,
  items,
  selected,
  setSelected,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleItem = (name: string) =>
    selected.includes(name)
      ? setSelected(selected.filter((i) => i !== name))
      : setSelected([...selected, name]);

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader} onClick={() => setIsOpen(!isOpen)}>
        <h4>{title}</h4>
        <span className={styles.chevron}>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </div>
      {isOpen && (
        <div className={styles.filterList}>
          {items.map((item) => (
            <label key={item.name}>
              <input
                type="checkbox"
                checked={selected.includes(item.name)}
                onChange={() => toggleItem(item.name)}
              />
              {item.name}
              <span className={styles.itemCount}>({item.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
