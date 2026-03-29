import styles from "./home.module.css";
import { Search, MapPin } from "lucide-react";
import heroSectionImage from "../../assets/WhatsApp Image 2026-02-20 at 12.17.19 AM.jpeg";
import Testimonial from "../../Subject to/Home/Partners/Partners";
import JobsSection from "../../Subject to/Home/JobsSection/JobsSection";
import HiringBanner from "../../Subject to/Home/HiringBanner/HiringBanner";
import Categories from "../../Subject to/Home/Categories/Categories";
import JobsDashboard from "../../Subject to/Home/JobCard/JobCard";
import { motion } from "framer-motion";
import { useJobitoAuth } from "../../context/AuthContext";

export const Home = () => {
  const { isAuthenticated } = useJobitoAuth();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, x: 30, opacity: 0 },
    visible: { 
      y: 0, 
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <motion.section 
        className={styles.heroSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        variants={containerVariants}
      >
        <div className={styles.container}>
          <motion.div className={styles.content} variants={containerVariants}>
            <motion.h1 className={styles.title} variants={itemVariants}>
              جد وظيفة <br />
              <span className={styles.purpleText}>أحلامك</span> <br />
              <span className={styles.blueText}>
                اليوم
                <svg className={styles.underline} viewBox="0 0 300 20">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                    d="M5 15 Q 40 5, 80 15 T 160 15 T 240 15 T 300 15"
                    stroke="#26A4FF"
                    fill="transparent"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p className={styles.description} variants={itemVariants}>
              نربط المحترفين الموهوبين بأفضل الفرص في الشرق الأوسط.
            </motion.p>

            <motion.div className={styles.searchBar} variants={itemVariants}>
              <div className={styles.inputGroup}>
                <Search className={styles.icon} size={20} />
                <input type="text" placeholder="مسمى وظيفي، كلمات مفتاحية..." />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.inputGroup}>
                <MapPin className={styles.icon} size={20} />
                <select defaultValue="Florence">
                   <option value="Florence">Egpt , EL-shrock</option>
                </select>
              </div>

              <button className={styles.searchBtn}>بحث</button>
            </motion.div>

            <motion.p className={styles.popular} variants={itemVariants}>
              <strong>عمليات البحث الشائعة:</strong> UI Designer, UX Researcher, Android,
              Admin
            </motion.p>
          </motion.div>
        </div>
        <motion.img
          src={heroSectionImage}
          alt="Hero Section"
          className={styles.heroImage}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.8 },
            x: { duration: 0.8 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </motion.section>
      <section className={styles.companiesSection}>
        <Testimonial />
      </section>
      <Categories />
      {!isAuthenticated && <HiringBanner />}
      <JobsSection />
      <JobsDashboard />
      {/* <Testimonil /> */}
    </>
  );
};

