import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import styles from "./Categories.module.css";
import { Link } from "react-router-dom";
import { 
  FiLayout, 
  FiBarChart2, 
  FiTarget,
  FiHeadphones,
  FiBookOpen,
  FiUsers,
  FiActivity,
  FiEdit3,
  FiBriefcase,
  FiTruck,
  FiCoffee,
  FiEdit2,
  FiTrendingUp,
  FiTool,
  FiCpu,
  FiDollarSign,
  FiPlus
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Category {
  categoryId: number;
  name: string;
  nameEn?: string;
  jobCount?: number;
}

const CATEGORY_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  "تقني": { icon: <FiCpu />, color: "#4f46e5" },
  "غير تقني": { icon: <FiUsers />, color: "#f59e0b" },
  "حرفي": { icon: <FiTool />, color: "#f97316" }, 
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/jobs/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        
        // Priority map for sorting (Tech, Non-Tech, Trades)
        const priority: Record<string, number> = {
          "تقني": 3,
          "غير تقني": 2,
          "حرفي": 1,
        };

        const filtered = data.filter((c: Category) => priority[c.name.trim()] !== undefined);
        const sorted = filtered.sort((a: Category, b: Category) => {
          const pA = priority[a.name.trim()] || 0;
          const pB = priority[b.name.trim()] || 0;
          return pB - pA;
        });

        setCategories(sorted); 
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("فشل تحميل الفئات");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 40, x: 40, opacity: 0 },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getMapping = (name: string) => {
    return CATEGORY_MAP[name] || { icon: <FiPlus />, color: "#6b7280" };
  };

  return (
    <motion.div 
      className={styles.pageContainer} 
      style={{ direction: "rtl" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className={styles.sectionHeader} variants={cardVariants}>
        <h2>
          استكشف حسب <span>الفئات</span>
        </h2>
        <Link to="/Find Jobs" className={styles.showAll}>
          عرض كل الوظائف ←
        </Link>
      </motion.div>

      {/* Categories Grid */}
      {loading ? (
        <div className={styles.loading}>جاري التحميل...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <motion.div className={styles.categoriesGrid} variants={containerVariants}>
          {categories.map((cat) => {
            const { icon, color } = getMapping(cat.name);
            return (
              <motion.div 
                key={cat.categoryId} 
                className={styles.categoryCard}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  transition: { duration: 0.2 }
                }}
              >
                <div className={styles.content}>
                  <h3>{cat.name}</h3>
                  <p>{cat.jobCount || 0} وظيفة متاحة</p>
                </div>
                <div 
                  className={styles.icon}
                  style={{ 
                    backgroundColor: `${color}15`, 
                    color: color 
                  }}
                >
                  {icon}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Categories;
