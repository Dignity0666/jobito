import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2 } from "lucide-react";
import styles from "./CompaniesJobs.module.css";



const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface Company {
  id: number;
  name: string;
  desc: string;
  tags: string[];
  jobsCount: number;
  logoUrl?: string;
  industry?: string;
  employees?: string;
}

const DEFAULT_INDUSTRIES = [
  "نقمي", "غير تقني", "حرفي"
];

const DEFAULT_TAGS = [
  "تكنولوجيا", "تصميم", "تسويق", "مبيعات", "هندسة", "إدارة", "مالية"
];

const CompaniesJobs = () => {


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedIndustries.length > 0) params.append("industry", selectedIndustries[0]);
        if (selectedSizes.length > 0) params.append("employees", selectedSizes[0]);

        const response = await fetch(`${API_BASE_URL}/companies?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const rawData = await response.json();
        // Backend now returns { data: [], total: ... }
        const data = rawData.data || (Array.isArray(rawData) ? rawData : []);

        if (!Array.isArray(data)) {
          console.error("API returned non-array data:", data);
          if (isMounted) setCompanies([]);
          return;
        }

        interface APIJob {
          category?: {
            name?: string;
          };
          categoryEn?: {
            nameEn?: string;
          };
        }

        interface APICompany {
          companyId: number;
          name?: string;
          description?: string;
          logoUrl?: string;
          industry?: string;
          employees?: string;
          jobs?: APIJob[];
        }

        if (isMounted) {
          const uniqueCompaniesMap = new Map<string, Company>();

          (data as APICompany[]).forEach((item) => {
            const tagsSet = new Set<string>();
            item.jobs?.forEach((job) => {
              if (job.category?.name) tagsSet.add(job.category.name);
            });

            let description =
              item.description || "شركة رائدة في مجالها.";
            if (
              description.includes("figmeta") ||
              description.includes("figma")
            ) {
              description = "شركة رائدة في مجالها.";
            }

            const companyObj: Company = {
              id: item.companyId,
              name: item.name || "شركة غير مسماة",
              desc: description,
              tags: Array.from(tagsSet),
              jobsCount: item.jobs?.length || 0,
              logoUrl: item.logoUrl,
              industry: item.industry,
              employees: item.employees,
            };

            const existing = uniqueCompaniesMap.get(
              companyObj.name.toLowerCase(),
            );
            if (
              !existing ||
              (companyObj.jobsCount > 0 && existing.jobsCount === 0)
            ) {
              uniqueCompaniesMap.set(companyObj.name.toLowerCase(), companyObj);
            }
          });

          setCompanies(Array.from(uniqueCompaniesMap.values()));
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        if (isMounted) {
          setError("تعذر تحميل البيانات.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCompanies();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => company.tags.includes(tag));

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      (company.industry && selectedIndustries.includes(company.industry));

    const matchesSize =
      selectedSizes.length === 0 ||
      (company.employees && selectedSizes.includes(company.employees));

    return matchesSearch && matchesTag && matchesIndustry && matchesSize;
  });

  // Calculate counts for sidebar filters
  const tagCounts = companies.flatMap(c => c.tags).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Add defaults to tagCounts with 0 if not present
  DEFAULT_TAGS.forEach(tag => {
    if (tagCounts[tag] === undefined) tagCounts[tag] = 0;
  });

  const industryCounts = companies.reduce((acc, company) => {
    if (company.industry) {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Add defaults to industryCounts
  DEFAULT_INDUSTRIES.forEach(ind => {
    if (industryCounts[ind] === undefined) industryCounts[ind] = 0;
  });

  const sizeCounts = companies.reduce((acc, company) => {
    if (company.employees) {
      acc[company.employees] = (acc[company.employees] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sizeBuckets = [
    "1-50",
    "51-150",
    "151-250",
    "251-500",
    "501-1000",
    "1000 - above",
  ];

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setCurrentPage(1);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );
    setCurrentPage(1);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
    setCurrentPage(1);
  };

  return (
    <div style={{ direction: "rtl" }}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              ابحث عن{" "}
              <span className={styles.purpleText}>
                الشركات التي تحلم بها
              </span>
            </h1>
            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <Search className={styles.icon} size={20} />
                <input
                  type="text"
                  placeholder="ابحث عن شركة..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button className={styles.searchBtn}>بحث</button>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.Companiespage}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>القطاع (Industry)</h4>
            <div className={styles.filterList}>
              {Object.entries(industryCounts).map(([ind, count]) => (
                <label key={ind} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIndustries.includes(ind)}
                    onChange={() => handleIndustryChange(ind)}
                  />
                  <span className={styles.labelSpan}>
                    {ind} <span className={styles.countText}>({count})</span>
                  </span>
                </label>
              ))}
              {Object.keys(industryCounts).length === 0 && !isLoading && (
                <p className={styles.emptyText}>لا توجد قطاعات.</p>
              )}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>حجم الشركة (Company Size)</h4>
            <div className={styles.filterList}>
              {sizeBuckets.map((size) => {
                const count = sizeCounts[size] || 0;
                return (
                  <label key={size} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                    />
                    <span className={styles.labelSpan}>
                      {size} <span className={styles.countText}>({count})</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        <main className={styles.Companiespagemu}>
          <div className={styles.CompaniesHeader}>
            <div>
              <h2>جميع الشركات</h2>
              <p>
                إجمالي الشركات المدرجة: {filteredCompanies.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
              <p>جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "10px",
                  padding: "5px 15px",
                  cursor: "pointer",
                }}
              >
                إعادة المحاولة
              </button>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <>
              <div className={styles.Companiesgrid}>
                {currentCompanies.map((company) => (
                  <div 
                    key={company.id} 
                    className={styles.Companycard}
                    onClick={() => navigate(`/Company/${company.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.Cardtop}>
                      <div className={styles.Logoplaceholder}>
                        {company.logoUrl ? (
                          <img
                            src={
                              company.logoUrl.startsWith("http")
                                ? company.logoUrl
                                : `${API_BASE_URL}${company.logoUrl}`
                            }
                            alt={company.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "inherit",
                            }}
                          />
                        ) : (
                          <Building2 size={24} color="#4640de" />
                        )}
                      </div>
                      <span className={styles.Jobscount}>
                        {company.jobsCount} وظائف شاغرة
                      </span>
                    </div>

                    <h3>{company.name}</h3>
                    <p className={styles.desc}>{company.desc}</p>

                    <div className={styles.tags}>
                      {company.tags.length > 0 ? (
                        company.tags.map((tag) => (
                          <span
                            key={tag}
                            className={styles.tag}
                            style={{ background: "#eef2ff", color: "#4640de" }}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className={styles.noTag}>خدمات عامة</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    {" > "}
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page ? styles.activePage : ""
                          }
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                     {" < "}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <h3>لم يتم العثور على نتائج.</h3>
              <p>حاول البحث بكلمات أخرى.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CompaniesJobs;
