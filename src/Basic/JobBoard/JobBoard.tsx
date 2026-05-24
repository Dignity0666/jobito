import { MapPin, Search } from "lucide-react";
import Styles from "./JobBoard.module.css";
import AllJobs from "../../Subject to/JobBoard/AllJobs/AllJobs";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "../../context/translation-context";
import { useJobitoAuth } from "../../context/LinkContxt";
import { useTheme } from "../../context/ThemeContext";
import darkBg from "../../assets/WhatsApp Image 2026-05-10 at 1.22.54 AM.jpeg";
import lightBg from "../../assets/WhatsApp Image 2026-05-10 at 1.40.25 AM.jpeg";

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // Faster stagger for words
      delayChildren: 1.2,
    },
  },
};

const staggerWords = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const searchBarVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.45 },
  },
};

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

export default function JobBoard() {
  const { apiFetch, isAuthenticated, role, user } = useJobitoAuth();
  const { isDark } = useTheme();
  const classification = user?.classification;
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const { t } = useTranslation();

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    location: "",
  });

  const handleSearch = () => {
    setAppliedFilters({ search, location });
  };

  return (
    <div className={Styles.page}>
      {/* ── Hero Section ── */}
      <section className={Styles.heroSection}>
        <div className={Styles.container}>
          <motion.div
            className={Styles.content}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className={Styles.title} variants={fadeUp}>
              {classification === "tradesman"
                ? t("ابحث عن أعمال")
                : t("ابحث عن وظائف")}
            </motion.h1>
            <motion.p className={Styles.description} variants={fadeUp}>
              {classification === "tradesman"
                ? t("اكتشف فرص العمل المتاحة في مجالك وقدّم خدماتك.")
                : t("اكتشف آلاف الفرص الوظيفية وابدأ مسيرتك المهنية.")}
            </motion.p>

            {/* Search Bar */}
            <motion.div
              className={`${Styles.searchBar} ${isDark ? Styles.darkSearchBar : ""}`}
              variants={searchBarVariant}
            >
              <div className={Styles.inputGroup}>
                <Search className={Styles.icon} size={20} />
                <input
                  type="text"
                  placeholder={
                    classification === "tradesman"
                      ? t("ما هي الخدمة التي تستطيع تقديمها؟ (سباكة، نجارة...)")
                      : t("مسمى الوظيفة أو الكلمة الرئيسية...")
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className={Styles.divider}></div>

              <div className={Styles.inputGroup}>
                <MapPin className={Styles.icon} size={20} />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">{t("أي مكان")}</option>
                  <option value="Cairo">{t("القاهرة، مصر")}</option>
                  <option value="Alexandria">{t("الإسكندرية، مصر")}</option>
                </select>
              </div>

              <button className={Styles.searchBtn} onClick={handleSearch}>
                {t("بحث")}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Jobs Section ── */}
      <motion.div
        className={Styles.cardJobBoard}
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AllJobs
          searchKeyword={appliedFilters.search}
          location={appliedFilters.location}
        />
      </motion.div>
    </div>
  );
}
