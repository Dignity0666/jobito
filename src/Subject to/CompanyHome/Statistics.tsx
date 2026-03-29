import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Eye, ClipboardList, ChevronUp, ChevronDown } from "lucide-react";
import { useJobitoAuth } from "../../context/AuthContext";
import styles from "./Statistics.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface StatSummary {
  views: { total: string; trend: string; isUp: boolean };
  applied: { total: string; trend: string; isUp: boolean };
  jobOpen: number;
  applicants: Array<{ label: string; count: number; color: string }>;
}

interface PeriodData {
  labels: string[];
  views: number[];
  applied: number[];
  summary: StatSummary;
}

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#FFFFFF",
      titleColor: "#111827",
      bodyColor: "#6B7280",
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      usePointStyle: true,
      borderColor: "#E5E7EB",
      borderWidth: 1,
    },
  },
  animation: {
    duration: 500,
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#6B7280",
        font: {
          size: 12,
          weight: "normal",
        },
      },
    },
    y: {
      stacked: true,
      display: false,
      grid: {
        display: false,
      },
    },
  },
};

export default function Statistics({
  companyId,
}: {
  companyId: number | null;
}) {
  const { apiFetch } = useJobitoAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [activePeriod, setActivePeriod] = useState<"Week" | "Month" | "Year">(
    "Week",
  );
  const [data, setData] = useState<PeriodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(
          `${API_BASE_URL}/companies/${companyId}/statistics?period=${activePeriod}`,
        );
        if (!response.ok) throw new Error("Failed to fetch statistics");
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback to demo data...
        if (isMounted) {
          setData({
            labels: ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
            views: [0, 0, 0, 0, 0, 0, 0],
            applied: [0, 0, 0, 0, 0, 0, 0],
            summary: {
              views: { total: "0", trend: "0%", isUp: true },
              applied: { total: "0", trend: "0%", isUp: false },
              jobOpen: 0,
              applicants: [],
            },
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [activePeriod, companyId, apiFetch]);

  // Handle Initial Loading
  if (!data && isLoading) {
    return (
      <div className={styles.wrapper}>
        <div
          style={{ padding: "100px", textAlign: "center", color: "#578BC7" }}
        >
          جاري تحميل إحصائيات المشروع...
        </div>
      </div>
    );
  }

  if (!data) return null;

  const tabs = ["Overview", "Jobs View", "Jobs Applied"];
  const periods = ["Week", "Month", "Year"];

  const tabLabels: Record<string, string> = {
    "Overview": "نظرة عامة",
    "Jobs View": "مشاهدات الوظائف",
    "Jobs Applied": "طلبات التقديم"
  };

  const periodLabels: Record<string, string> = {
    "Week": "أسبوع",
    "Month": "شهر",
    "Year": "سنة"
  };

  const summary = data.summary;
  const applicantTypes = summary.applicants;
  const totalApplicants = applicantTypes.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  const datasets = [];

  if (activeTab === "Overview" || activeTab === "Jobs Applied") {
    datasets.push({
      label: "طلبات التقديم",
      data: data.applied,
      backgroundColor: "#5484C4",
      borderRadius: activeTab === "Jobs Applied" ? 4 : 0,
      stack: "stack1",
      barThickness: activePeriod === "Year" ? 30 : 20,
    });
  }

  if (activeTab === "Overview" || activeTab === "Jobs View") {
    datasets.push({
      label: "مشاهدات الوظائف",
      data: data.views,
      backgroundColor: "#FFA524",
      borderRadius: {
        topLeft: 4,
        topRight: 4,
        bottomLeft: 0,
        bottomRight: 0,
      } as any,
      stack: "stack1",
      barThickness: activePeriod === "Year" ? 30 : 20,
    });
  }

  const chartLabelsMap: Record<string, string> = {
    // Week days
    "Mon": "الأثنين",
    "Tue": "الثلاثاء",
    "Wed": "الأربعاء",
    "Thu": "الخميس",
    "Fri": "الجمعة",
    "Sat": "السبت",
    "Sun": "الأحد",
    // Weeks
    "W1": "الأسبوع 1",
    "W2": "الأسبوع 2",
    "W3": "الأسبوع 3",
    "W4": "الأسبوع 4",
    // Months
    "Jan": "يناير",
    "Mar": "مارس",
    "May": "مايو",
    "Jul": "يوليو",
    "Sep": "سبتمبر",
    "Nov": "نوفمبر"
  };

  const chartData: ChartData<"bar"> = {
    labels: data.labels.map(l => chartLabelsMap[l] || l),
    datasets: datasets,
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.mainLayout}
        style={{ opacity: isLoading ? 0.6 : 1, transition: "opacity 0.2s" }}
      >
        {/* LEFT CARD */}
        <div className={styles.statisticsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.titleArea}>
              <h2 className={styles.title}>إحصائيات الوظائف</h2>
              <p className={styles.subtitle}>
                عرض {tabLabels[activeTab]} لـ {periodLabels[activePeriod]}
              </p>
            </div>
            <div className={styles.periodSwitcher}>
              {periods.map((p) => (
                <button
                  key={p}
                  disabled={isLoading}
                  onClick={() => setActivePeriod(p as any)}
                  className={`${styles.periodBtn} ${activePeriod === p ? styles.periodBtnActive : ""}`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tabList}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabItem} ${activeTab === tab ? styles.tabItemActive : ""}`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <div className={styles.chartArea}>
                <div style={{ width: "100%", height: "260px" }}>
                  <Bar
                    data={chartData}
                    options={chartOptions}
                    key={activePeriod}
                  />
                </div>
              </div>

              <div className={styles.legend}>
                {(activeTab === "Overview" || activeTab === "Jobs View") && (
                  <div className={styles.legendItem}>
                    <span
                      className={`${styles.legendDot} ${styles.dotOrange}`}
                    />
                    <span className={styles.legendLabel}>مشاهدات الوظائف</span>
                  </div>
                )}
                {(activeTab === "Overview" || activeTab === "Jobs Applied") && (
                  <div className={styles.legendItem}>
                    <span className={`${styles.legendDot} ${styles.dotBlue}`} />
                    <span className={styles.legendLabel}>طلبات التقديم</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.miniStatsColumn}>
              <div className={styles.miniStatCard}>
                <div className={styles.miniStatHeader}>
                  <div className={styles.miniStatInfo}>
                    <p className={styles.miniStatLabel}>مشاهدات الوظائف</p>
                    <h3 className={styles.miniStatValue}>
                      {summary.views.total}
                    </h3>
                    <div className={styles.miniStatTrend}>
                      <span className={styles.trendLabel}>
                        هذا الـ {periodLabels[activePeriod]}
                      </span>
                      <span
                        className={
                          summary.views.isUp ? styles.trendUp : styles.trendDown
                        }
                      >
                        {summary.views.trend}{" "}
                        {summary.views.isUp ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${styles.miniStatIcon} ${styles.iconBgOrange}`}
                  >
                    <Eye size={18} color="#FFA524" />
                  </div>
                </div>
              </div>

              <div className={styles.miniStatCard}>
                <div className={styles.miniStatHeader}>
                  <div className={styles.miniStatInfo}>
                    <p className={styles.miniStatLabel}>طلبات التقديم</p>
                    <h3 className={styles.miniStatValue}>
                      {summary.applied.total}
                    </h3>
                    <div className={styles.miniStatTrend}>
                      <span className={styles.trendLabel}>
                        هذا الـ {periodLabels[activePeriod]}
                      </span>
                      <span
                        className={
                          summary.applied.isUp
                            ? styles.trendUp
                            : styles.trendDown
                        }
                      >
                        {summary.applied.trend}{" "}
                        {summary.applied.isUp ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`${styles.miniStatIcon} ${styles.iconBgBlue}`}
                  >
                    <ClipboardList size={18} color="#5484C4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightColumn}>
          <div className={styles.sideCard}>
            <p className={styles.sideCardLabel}>الوظائف المفتوحة</p>
            <div className={styles.sideCardValueRow}>
              <span className={styles.sideCardValue}>{summary.jobOpen}</span>
              <span className={styles.sideCardUnit}>وظيفة مفتوحة</span>
            </div>
          </div>

          <div className={`${styles.sideCard} ${styles.applicantsSummaryCard}`}>
            <h3 className={styles.sideCardHeaderTitle}>ملخص المتقدمين</h3>
            <div className={styles.sumValueArea}>
              <span className={styles.sumHugeNumber}>{totalApplicants}</span>
              <span className={styles.sumLabelText}>متقدم</span>
            </div>

            <div className={styles.progressBar}>
              {applicantTypes.map((t, idx) => (
                <div
                  key={idx}
                  className={styles.progressSegment}
                  style={{
                    width: `${totalApplicants > 0 ? (t.count / totalApplicants) * 100 : 0}%`,
                    backgroundColor: t.color,
                  }}
                />
              ))}
            </div>

            <div className={styles.applicantsLegendGrid}>
              {applicantTypes.map((t, idx) => {
                const arabicLabels: Record<string, string> = {
                   'Full Time': 'دوام كامل',
                   'Part-Time': 'دوام جزئي',
                   'Remote': 'عن بعد',
                   'Internship': 'تدريب',
                   'Contract': 'عقد'
                };
                return (
                  <div key={idx} className={styles.applicantLegendItem}>
                    <span
                      className={styles.applicantLegendBox}
                      style={{ backgroundColor: t.color }}
                    />
                    <span className={styles.applicantLegendLabel}>
                      {arabicLabels[t.label] || t.label} : <strong>{t.count}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
