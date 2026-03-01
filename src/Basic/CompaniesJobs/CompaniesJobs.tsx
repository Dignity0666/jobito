import { useState } from "react";
import { Search } from "lucide-react";
import styles from "./CompaniesJobs.module.css";
import companiesData from "../../Data/companies.json";

type Company = {
  name: string;
  desc: string;
  tags: string[];
  jobs: number;
};

const CompaniesJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const companies: Company[] = companiesData;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => company.tags.includes(tag));

    return matchesSearch && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // رجع للصفحة الأولى بعد التصفية
  };

  const uniqueTags = Array.from(
    new Set(companies.flatMap((company) => company.tags))
  );

  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Find your <span className={styles.purpleText}>dream Companies</span>
            </h1>

            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <Search className={styles.icon} size={20} />
                <input
                  type="text"
                  placeholder="Search company..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // رجع للصفحة الأولى بعد البحث
                  }}
                />
              </div>

              <button className={styles.searchBtn}>Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Page */}
      <div className={styles.Companiespage}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filter}>
            <h4>Industry</h4>
            {uniqueTags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className={styles.Companiespagemu}>
          <div className={styles.CompaniesHeader}>
            <div>
              <h2>All Companies</h2>
              <p>Showing {filteredCompanies.length} results</p>
            </div>
          </div>

          {/* Companies Grid */}
          <div className={styles.Companiesgrid}>
            {currentCompanies.map((company) => (
              <div key={company.name} className={styles.Companycard}>
                <div className={styles.Cardtop}>
                  <div className={styles.Logoplaceholder}>
                    {company.name[0]}
                  </div>
                  <span className={styles.Jobscount}>
                    {company.jobs} Jobs
                  </span>
                </div>

                <h3>{company.name}</h3>
                <p className={styles.desc}>{company.desc}</p>

                <div className={styles.tags}>
                  {company.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? styles.active : ""}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default CompaniesJobs;
