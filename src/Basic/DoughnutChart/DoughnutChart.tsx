import { useState, useEffect, useRef } from "react";
import "./DoughnutChart.css"
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const apps = [
  {
    id: 1,
    company: "Nomad",
    role: "Social Media Assistant",
    location: "Paris, France",
    type: "Full-Time",
    date: "24 July 2021",
    status: "In Review",
    icon: "🧭",
    color: "#12b886",
    delay: "0s",
  },
  {
    id: 2,
    company: "Udacity",
    role: "Social Media Assistant",
    location: "New York, USA",
    type: "Full-Time",
    date: "23 July 2021",
    status: "Shortlisted",
    icon: "🎓",
    color: "#228be6",
    delay: "0.1s",
  },
  {
    id: 3,
    company: "Packer",
    role: "Social Media Assistant",
    location: "Madrid, Spain",
    type: "Full-Time",
    date: "22 July 2021",
    status: "Declined",
    icon: "📦",
    color: "#f03e3e",
    delay: "0.2s",
  },
];

function DoughnutChart() {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    chartRef.current = new Chart(ref.current, {
      type: "doughnut",
      data: {
        labels: ["Unsuitable", "Interviewed"],
        datasets: [
          {
            data: [60, 40],
            backgroundColor: ["#e8eaf0", "#3b5bdb"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` ${ctx.parsed}%` },
          },
        },
        animation: { animateRotate: true, duration: 900 },
      },
    });
    return () => chartRef.current?.destroy();
  }, []);

  return <canvas ref={ref} />;
}

function CountUp({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(interval);
      } else setVal(start);
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return <>{val}</>;
}

export default function JobDashboard() {
  return (
    <>
      <div className="dashboard">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Good morning, Jake 👋</h1>
            <p>
              Here is what's happening with your job search applications from
              Jul 19 – Jul 25.
            </p>
          </div>
          <div className="date-badge">
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Jul 19 – Jul 25
          </div>
        </div>

        {/* Top grid */}
        <div className="top-grid">
          {/* Stats */}
          <div className="stats-col">
            <div className="card stat-card">
              <div className="stat-label">Total Jobs Applied</div>
              <div className="stat-num">
                <CountUp target={45} />
              </div>
              <span className="stat-icon">📋</span>
            </div>
            <div className="card stat-card">
              <div className="stat-label">Interviewed</div>
              <div className="stat-num">
                <CountUp target={18} />
              </div>
              <span className="stat-icon">🧑‍💼</span>
            </div>
          </div>

          {/* Chart */}
          <div className="card chart-card">
            <h3>Jobs Applied Status</h3>
            <div className="chart-inner">
              <div className="chart-wrap">
                <DoughnutChart />
              </div>
              <div className="legend">
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ background: "#3b5bdb" }}
                  />
                  <div>
                    <div className="legend-pct">60%</div>
                    <div className="legend-label">Unsuitable</div>
                  </div>
                </div>
                <div className="legend-item">
                  <div
                    className="legend-dot"
                    style={{ background: "#e8eaf0", border: "1px solid #cdd" }}
                  />
                  <div>
                    <div className="legend-pct">40%</div>
                    <div className="legend-label">Interviewed</div>
                  </div>
                </div>
              </div>
            </div>
            <button className="view-link">View All Applications →</button>
          </div>

          {/* Interviews */}
          <div className="card interviews-card">
            <div className="interview-nav">
              <div>
                <div className="stat-label">Upcoming Interviews</div>
                <div className="interview-date">Today, 26 November</div>
              </div>
              <div className="nav-btns">
                <button className="nav-btn">‹</button>
                <button className="nav-btn">›</button>
              </div>
            </div>
            <div className="timeline">
              {["10:00 AM", "10:30 AM", "11:00 AM"].map((t, i) => (
                <div className="time-slot" key={t}>
                  <span className="time-label">{t}</span>
                  {i === 1 ? (
                    <div className="interview-slot">
                      <div className="avatar">J</div>
                      <div>
                        <div className="interview-name">Joe Bartmann</div>
                        <div className="interview-role">
                          HR Manager at Divvy
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="time-line" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="history-header">
          <h2>Recent Applications History</h2>
        </div>
        <div className="app-list">
          {apps.map((app) => (
            <div
              className="app-item"
              key={app.id}
              style={{ animationDelay: app.delay }}
            >
              <div
                className="app-logo"
                style={{ background: app.color + "20" }}
              >
                {app.icon}
              </div>
              <div className="app-info">
                <div className="app-title">{app.role}</div>
                <div className="app-meta">
                  {app.company} · {app.location} · {app.type}
                </div>
              </div>
              <div className="app-date-col">
                <div className="app-date-label">Date Applied</div>
                <div className="app-date-val">{app.date}</div>
              </div>
              <span
                className={`badge ${
                  app.status === "In Review"
                    ? "badge-review"
                    : app.status === "Shortlisted"
                      ? "badge-shortlisted"
                      : "badge-declined"
                }`}
              >
                {app.status}
              </span>
              <button className="more-btn">⋯</button>
            </div>
          ))}
        </div>
        <div className="bottom-link">
          <button className="view-link">View all applications history →</button>
        </div>
      </div>
    </>
  );
}
