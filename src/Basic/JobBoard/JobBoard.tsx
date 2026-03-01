import { MapPin, Search } from "lucide-react";
import Styles from "./JobBoard.module.css";
import AllJobs from "../../Subject to/JobBoard/AllJobs/AllJobs";
import { motion } from "framer-motion";

// ✅ Hero variants — عناصر الـ hero بتظهر واحدة ورا التانية
const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ✅ Search bar بتيجي من تحت بعد باقي العناصر
const searchBarVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.45 },
  },
};

// ✅ AllJobs section بتظهر بـ fade بعد الـ hero
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

export default function JobBoard() {
  return (
    <div className="job-board">
      {/* ── Hero Section ── */}
      <section className={Styles.heroSection}>
        <div className={Styles.container}>
          <motion.div
            className={Styles.content}
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Title */}
            <motion.h1 className={Styles.title} variants={fadeUp}>
              Find your{" "}
              <span className={Styles.purpleText}>
                dream job{" "}
                <svg className={Styles.underline} viewBox="0 0 300 20">
                  <path
                    d="M5 15 Q 40 5, 80 15 T 160 15 T 240 15 T 300 15"
                    stroke="#26A4FF"
                    fill="transparent"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p className={Styles.description} variants={fadeUp}>
              Find your next career at companies like HubSpot, Nike, and Dropbox
            </motion.p>

            {/* Search Bar */}
            <motion.div className={Styles.searchBar} variants={searchBarVariant}>
              <div className={Styles.inputGroup}>
                <Search className={Styles.icon} size={20} />
                <input type="text" placeholder="Job title or keyword" />
              </div>

              <div className={Styles.divider}></div>

              <div className={Styles.inputGroup}>
                <MapPin className={Styles.icon} size={20} />
                <select defaultValue="Florence">
                  <option value="Florence">Florence, Italy</option>
                  <option value="London">London, UK</option>
                </select>
              </div>

              <button className={Styles.searchBtn}>Search my job</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Jobs Section ── */}
      <motion.div
        className={Styles.cardJobBoard}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <AllJobs />
      </motion.div>
    </div>
  );
}