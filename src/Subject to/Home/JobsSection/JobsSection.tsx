import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import styles from "./JobsSection.module.css";

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
  titleEn?: string;
  company?: {
    name: string;
    nameEn?: string;
    logo?: string;
    logoUrl?: string;
  };
  address: string;
  jobType: string;
  category?: { name: string };
  categoryId?: number;
}

const JobsSection = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        
        const result = await response.json();
        const jobsData = result.data || (Array.isArray(result) ? result : []);
        setJobs(jobsData.slice(0, 8)); 
        setError(null);
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError("حدث خطأ في تحميل الوظائف");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 50, x: 50, opacity: 0 },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const getTranslatedTag = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes("marketing")) return "تسويق";
    if (lowerTag.includes("design")) return "تصميم";
    if (lowerTag.includes("sales") || lowerTag.includes("business")) return "مبيعات";
    if (lowerTag.includes("technology") || lowerTag.includes("development")) return "تكنولوجيا";
    return tag;
  };

  const getTagClass = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes("marketing")) return styles.marketing;
    if (lowerTag.includes("design")) return styles.design;
    if (lowerTag.includes("sales") || lowerTag.includes("business")) return styles.business;
    if (lowerTag.includes("technology") || lowerTag.includes("development")) return styles.technology;
    return "";
  };

  return (
    <motion.div 
      className={styles.jobsContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div className={styles.sectionHeader} variants={cardVariants}>
        <h2>
          الوظائف <span>المميزة</span>
        </h2>
        <Link to="/Browse jobs" className={styles.showAllLink}>
          تصفح جميع الوظائف ←
        </Link>
      </motion.div>

      {isLoading ? (
        <div className={styles.loader}>جاري التحميل...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <motion.div className={styles.featuredGrid} variants={containerVariants}>
          {jobs.map((job) => (
            <motion.div 
              key={job.jobId} 
              className={styles.jobCard}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.jobTop}>
                <div className={styles.logo}>
                  <img
                    src={getFullImageUrl(job.company?.logoUrl || job.company?.logo, job.company?.name || job.jobId?.toString())}
                    alt={job.company?.name || "Company Logo"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company?.name || job.jobId}`;
                    }}
                  />
                </div>
                <span className={styles.badge}>
                  {job.jobType === "Full Time" ? "دوام كامل" : job.jobType === "Part Time" ? "دوام جزئي" : job.jobType === "Contract" ? "عقد" : job.jobType === "Internship" ? "تدريب" : "دوام كامل"}
                </span>
              </div>

              <h3>{job.title}</h3>
              <p>
                {job.company?.name || "Jobito Ltd"} · {job.address}
              </p>

              <div className={styles.tags}>
                {job.category?.name && (
                  <span className={`${styles.tag} ${getTagClass(job.category.name)}`}>
                    {getTranslatedTag(job.category.name)}
                  </span>
                )}
                {!job.category?.name && (
                   <span className={`${styles.tag} ${styles.technology}`}>
                    تكنولوجيا
                   </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobsSection;


