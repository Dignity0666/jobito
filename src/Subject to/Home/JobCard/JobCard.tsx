import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import styles from "./JobCard.module.css";
import { useTranslation } from "../../../context/translation-context";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Job {
  jobId: string | number;
  title: string;
  company?: {
    name: string;
    logo?: string;
    logoUrl?: string;
  };
  address: string;
  jobType: string;
  salary: number | string;
  createdAt: string;
  category?: { name: string };
  description?: string;
}

const getFullImageUrl = (url?: string, seed?: string) => {
  if (!url) return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed || 'company'}`;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const stripMarkdown = (text: string) => {
  if (!text) return "";
  // Remove markdown symbols like **, *, #, -, >, _
  return text.replace(/[*#_~`>]/g, "").replace(/\s+/g, " ").trim();
};

const useTimeAgo = () => {
  const { t } = useTranslation();
  return (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) return `${t("منذ")} ${diffMonths} ${t("أشهر")}`;
    if (diffDays > 0) return `${t("منذ")} ${diffDays} ${t("أيام")}`;
    return t("اليوم");
  };
};

const JobCard: React.FC<{ job: Job; variants: Variants }> = ({ job, variants }) => {
  const { t } = useTranslation();
  const timeAgo = useTimeAgo();
  const cleanDescription = stripMarkdown(job.description || t("نحن نبحث عن شخص موهوب للانضمام إلى فريقنا. هذه فرصة رائعة لتطوير مسيرتك المهنية."));
  
  return (
    <motion.div 
      className={styles.card}
      variants={variants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className={styles.cardTop}>
        <div className={styles.companyInfo}>
          <div className={styles.logoBox}>
            <img 
              src={getFullImageUrl(job.company?.logoUrl || job.company?.logo, job.company?.name || job.jobId?.toString())} 
              alt={job.company?.name} 
              className={styles.logo} 
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name || job.jobId}`;
              }}
            />
          </div>
          <div>
            <h3 className={styles.companyName}>{job.company?.name || t("Jobito Ltd")}</h3>
            <p className={styles.location}>
              <span className={styles.locIcon}>📍</span> {job.address}
            </p>
          </div>
        </div>
        <span className={styles.flash}>⚡</span>
      </div>
 
      <h2 className={styles.jobTitle}>{t(job.title)}</h2>
 
      <div className={styles.meta}>
        <span className={styles.metaItem}>💼 {job.jobType}</span>
        <span className={styles.metaItem}>🕒 {timeAgo(job.createdAt)}</span>
      </div>
 
      <p className={styles.description}>
        {cleanDescription.length > 100 ? t(cleanDescription.substring(0, 100)) + "..." : t(cleanDescription)}
      </p>
 
      <div className={styles.tags}>
        {job.category?.name && (
          <span className={styles.tag}>
            {t(job.category.name)}
          </span>
        )}
      </div>
 
      <div className={styles.footer}>
        <p className={styles.price}>
          ${job.salary || t("قابل للتفاوض")}
          {job.salary && <span className={styles.perHour}>/ {t("ساعة")}</span>}
        </p>
        <Link to="/Job details" state={{ jobId: job.jobId }} className={styles.applyBtn}>
          {t("قدم الآن")}
        </Link>
      </div>
    </motion.div>
  );
};

export default function JobsDashboard() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const result = await response.json();
        const jobsData = result.data || (Array.isArray(result) ? result : []);
        
        // Filter jobs to only show jobs posted today (local time)
        const todayStr = new Date().toLocaleDateString("en-CA"); // Gets YYYY-MM-DD format purely by date
        const todaysJobs = jobsData.filter((j: Job) => {
           if (!j.createdAt) return false;
           const jobDate = new Date(j.createdAt).toLocaleDateString("en-CA");
           return jobDate === todayStr;
        });

        setJobs(todaysJobs.slice(0, 8)); // Show 8 jobs for the dashboard
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("حدث خطأ في جلب الوظائف");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 50, x: 50, opacity: 0 },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div 
      className={styles.dashboard}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "-100px" }}
      variants={containerVariants}
    >
      <div className={styles.container}>
        {/* Header */}
        <motion.div className={styles.header} variants={cardVariants}>
          <h1 className={styles.title}>{t("وظائف اليوم")}</h1>
          <p className={styles.subtitle}>{t("تصفح أحدث الفرص المتاحة التي تم نشرها اليوم.")}</p>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className={styles.loading}>{t("جاري التحميل...")}</div>
        ) : error ? (
          <div className={styles.error}>{t(error)}</div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyState} style={{textAlign: "center", color: "#6b7280", padding: "40px"}}>
             {t("لا توجد وظائف جديدة تم نشرها في هذا اليوم بعد.")}
          </div>
        ) : (
          <motion.div className={styles.grid} variants={containerVariants}>
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} variants={cardVariants} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

