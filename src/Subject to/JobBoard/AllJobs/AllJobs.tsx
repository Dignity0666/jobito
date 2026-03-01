import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllJobs.css";
import { FaHeart } from "react-icons/fa";
import jobsData from "../../../Data/JobBoard.json";
import { motion, AnimatePresence } from "framer-motion";

type Job = {
  title: string;
  company: string;
  location: string;
  type: string;
  categories: string[];
  applied: number;
  capacity: number;
};

type AllJobsProps = {
  size?: number;
  color?: string;
};

// ✅ Sidebar بتنزل من الشمال
const sidebarVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ✅ قائمة الكاردات — container للـ stagger
const listVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07, // كل كارت بيظهر بعد السابق بـ 70ms
      delayChildren: 0.1,
    },
  },
};

// ✅ كل كارت وظيفة
const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const AllJobs: React.FC<AllJobsProps> = ({ size = 20, color = "#ff4d4f" }) => {
  const navigate = useNavigate();
  const allJobs: Job[] = jobsData.jobs;

  const employmentTypes = allJobs.reduce((acc: Record<string, number>, job) => {
    acc[job.type] = (acc[job.type] || 0) + 1;
    return acc;
  }, {});

  const jobCategories = allJobs.reduce((acc: Record<string, number>, job) => {
    job.categories.forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const [keyword, setKeyword] = useState("");
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredJobs = allJobs.filter((job) => {
    const keywordMatch =
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase());

    const employmentMatch =
      selectedEmployment.length === 0 ||
      selectedEmployment.some((item) => job.type === item);

    const categoryMatch =
      selectedCategories.length === 0 ||
      job.categories.some((cat) => selectedCategories.includes(cat));

    return keywordMatch && employmentMatch && categoryMatch;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // ✅ عند تغيير الفلتر أو الصفحة، نرجع للصفحة الأولى
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="jobs-page">
      {/* ── Sidebar ── */}
      <motion.aside
        className="sidebar"
        variants={sidebarVariant}
        initial="hidden"
        animate="visible"
      >
        <Filter
          title="Search Keyword"
          items={[]}
          selected={[]}
          setSelected={() => {}}
          isInput
          keyword={keyword}
          setKeyword={(val) => {
            setKeyword(val);
            setCurrentPage(1); // reset page on search
          }}
        />

        <Filter
          title="Type of Employment"
          items={Object.entries(employmentTypes).map(
            ([key, val]) => `${key} (${val})`
          )}
          selected={selectedEmployment}
          setSelected={(val) => {
            setSelectedEmployment(val);
            setCurrentPage(1);
          }}
          isSingleSelect={true}
        />

        <Filter
          title="Categories"
          items={Object.entries(jobCategories).map(
            ([key, val]) => `${key} (${val})`
          )}
          selected={selectedCategories}
          setSelected={(val) => {
            setSelectedCategories(val);
            setCurrentPage(1);
          }}
        />
      </motion.aside>

      {/* ── Jobs List ── */}
      <main className="jobs-content">
        <div className="jobs-header">
          <h2>All Jobs</h2>
          <p>Showing {filteredJobs.length} results</p>
        </div>

        {currentJobs.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No jobs found.
          </motion.p>
        )}

        {/* ✅ AnimatePresence + stagger على الكاردات */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPage}-${keyword}-${selectedEmployment.join()}-${selectedCategories.join()}`}
            variants={listVariant}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {currentJobs.map((job, index) => (
              <motion.div
                className="job-row"
                key={index}
                variants={cardVariant}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: { duration: 0.2 },
                }}
              >
                <div className="job-left">
                  <div className="logo-placeholder">Logo</div>
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {job.company} · {job.location} · {job.type}
                    </p>
                    <div className="tags">
                      {job.categories.map((cat, i) => (
                        <span
                          key={i}
                          className={`tag ${cat.toLowerCase().replace(/\s+/g, "")}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="job-right">
                  <div className="fabutter">
                    <motion.div
                      className="like"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.85 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <FaHeart size={size} color={color} />
                    </motion.div>
                    <motion.button
                      className="apply-btn"
                      onClick={() => navigate("/Job details")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply
                    </motion.button>
                  </div>

                  <div className="progress">
                    <motion.div
                      className="progress-bar"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          (job.applied / job.capacity) * 100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.05 }}
                    />
                  </div>

                  <span className="applied-text">
                    {job.applied} applied of {job.capacity} capacity
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Pagination ── */}
        <motion.div
          className="pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              className={page === currentPage ? "active" : ""}
              onClick={() => handlePageChange(page)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {page}
            </motion.button>
          ))}
          <button
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
          >
            &gt;
          </button>
        </motion.div>
      </main>
    </div>
  );
};

type FilterProps = {
  title: string;
  items: string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  isInput?: boolean;
  keyword?: string;
  setKeyword?: React.Dispatch<React.SetStateAction<string>>;
  isSingleSelect?: boolean;
};

const Filter: React.FC<FilterProps> = ({
  title,
  items,
  selected,
  setSelected,
  isInput = false,
  keyword,
  setKeyword,
  isSingleSelect = false,
}) => {
  const handleChange = (item: string) => {
    const actualValue = item.split(" (")[0];

    if (isSingleSelect) {
      if (selected.includes(actualValue)) {
        setSelected([]);
      } else {
        setSelected([actualValue]);
      }
    } else {
      if (selected.includes(actualValue)) {
        setSelected(selected.filter((i) => i !== actualValue));
      } else {
        setSelected([...selected, actualValue]);
      }
    }
  };

  if (isInput) {
    return (
      <div className="filter">
        <h4>{title}</h4>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword && setKeyword(e.target.value)}
          placeholder="Type to search..."
        />
      </div>
    );
  }

  return (
    <div className="filter">
      <h4>{title}</h4>
      {items.map((item, i) => (
        <label key={i}>
          <input
            type={isSingleSelect ? "radio" : "checkbox"}
            checked={selected.includes(item.split(" (")[0])}
            onChange={() => handleChange(item)}
          />
          {item}
        </label>
      ))}
    </div>
  );
};

export default AllJobs;