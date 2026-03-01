import { useState, useRef, useEffect } from "react";

const ALL_JOBS = [
    { id: 1, role: "Social Media Assistant", status: "live", datePosted: "20 May 2020", dueDate: "24 May 2020", jobType: "Fulltime", applicants: 19, hired: 4, needs: 11 },
    { id: 2, role: "Senior Designer", status: "live", datePosted: "16 May 2020", dueDate: "24 May 2020", jobType: "Fulltime", applicants: 1234, hired: 0, needs: 20 },
    { id: 3, role: "Visual Designer", status: "live", datePosted: "15 May 2020", dueDate: "24 May 2020", jobType: "Freelance", applicants: 2435, hired: 1, needs: 5 },
    { id: 4, role: "Data Science", status: "closed", datePosted: "13 May 2020", dueDate: "24 May 2020", jobType: "Freelance", applicants: 6234, hired: 10, needs: 10 },
    { id: 5, role: "Kotlin Developer", status: "closed", datePosted: "12 May 2020", dueDate: "24 May 2020", jobType: "Fulltime", applicants: 12, hired: 20, needs: 20 },
    { id: 6, role: "React Developer", status: "closed", datePosted: "11 May 2020", dueDate: "24 May 2020", jobType: "Fulltime", applicants: 14, hired: 10, needs: 10 },
    { id: 7, role: "Kotlin Developer", status: "closed", datePosted: "12 May 2020", dueDate: "24 May 2020", jobType: "Fulltime", applicants: 12, hired: 20, needs: 20 },
    { id: 8, role: "Product Manager", status: "live", datePosted: "10 May 2020", dueDate: "30 May 2020", jobType: "Fulltime", applicants: 342, hired: 2, needs: 8 },
    { id: 9, role: "UX Researcher", status: "live", datePosted: "9 May 2020", dueDate: "28 May 2020", jobType: "Parttime", applicants: 88, hired: 0, needs: 3 },
    { id: 10, role: "Backend Engineer", status: "closed", datePosted: "8 May 2020", dueDate: "20 May 2020", jobType: "Fulltime", applicants: 512, hired: 5, needs: 5 },
    { id: 11, role: "DevOps Engineer", status: "live", datePosted: "7 May 2020", dueDate: "25 May 2020", jobType: "Fulltime", applicants: 76, hired: 1, needs: 4 },
    { id: 12, role: "iOS Developer", status: "closed", datePosted: "6 May 2020", dueDate: "22 May 2020", jobType: "Freelance", applicants: 203, hired: 3, needs: 3 },
    { id: 13, role: "Content Writer", status: "live", datePosted: "5 May 2020", dueDate: "21 May 2020", jobType: "Parttime", applicants: 654, hired: 0, needs: 6 },
    { id: 14, role: "Marketing Manager", status: "closed", datePosted: "4 May 2020", dueDate: "18 May 2020", jobType: "Fulltime", applicants: 431, hired: 7, needs: 7 },
    { id: 15, role: "Android Developer", status: "live", datePosted: "3 May 2020", dueDate: "17 May 2020", jobType: "Fulltime", applicants: 128, hired: 2, needs: 5 },
];

const JOB_TYPES = ["All", "Fulltime", "Freelance", "Parttime"];
const STATUSES = ["All", "live", "closed"];

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',sans-serif; background:#f5f6fa; min-height:100vh; }

  .page { min-height:100vh; background:#f5f6fa; display:flex; flex-direction:column; }

  /* ── Topbar ── */
  .topbar { display:flex; align-items:center; justify-content:space-between; background:#fff; border-bottom:1px solid #e8eaf0; padding:0 28px; height:56px; flex-shrink:0; position:sticky; top:0; z-index:100; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
  .brand { display:flex; align-items:center; gap:10px; }
  .brand-logo { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#10b981,#3b82f6); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:14px; color:#fff; }
  .brand-info { line-height:1.2; }
  .brand-company { font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; }
  .brand-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111827; display:flex; align-items:center; gap:4px; cursor:pointer; }
  .topbar-right { display:flex; align-items:center; gap:12px; }
  .notif-btn { width:36px; height:36px; border-radius:10px; border:none; background:#f5f6fa; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#6b7280; position:relative; }
  .notif-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; background:#ef4444; border-radius:50%; border:2px solid #f5f6fa; }
  .post-job-btn { display:flex; align-items:center; gap:7px; padding:9px 18px; background:#6366f1; border:none; border-radius:10px; color:#fff; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .post-job-btn:hover { background:#4f46e5; }

  /* ── Content ── */
  .content { max-width:1060px; margin:0 auto; padding:28px 24px 60px; width:100%; }

  /* Page title row */
  .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:24px; }
  .page-title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; color:#111827; margin-bottom:4px; letter-spacing:-0.4px; }
  .page-subtitle { font-size:13px; color:#9ca3af; }
  .date-range-btn { display:flex; align-items:center; gap:8px; padding:9px 16px; background:#fff; border:1.5px solid #e5e7eb; border-radius:10px; color:#374151; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; white-space:nowrap; }
  .date-range-btn:hover { border-color:#6366f1; color:#6366f1; }

  /* Summary stats */
  .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:20px; }
  .stat-card { background:#fff; border:1px solid #ebebf0; border-radius:14px; padding:18px 20px; position:relative; overflow:hidden; }
  .stat-card::after { content:''; position:absolute; top:0; left:0; width:100%; height:3px; border-radius:14px 14px 0 0; }
  .stat-card.c-live::after { background:#10b981; }
  .stat-card.c-closed::after { background:#ef4444; }
  .stat-card.c-total::after { background:#6366f1; }
  .stat-card.c-hired::after { background:#f59e0b; }
  .stat-num { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#111827; letter-spacing:-0.5px; margin-bottom:3px; }
  .stat-label { font-size:12px; color:#9ca3af; font-weight:500; }
  .stat-trend { position:absolute; top:16px; right:16px; font-size:11px; font-weight:700; display:flex; align-items:center; gap:3px; padding:3px 8px; border-radius:6px; }
  .stat-trend.up { color:#10b981; background:#d1fae5; }
  .stat-trend.down { color:#ef4444; background:#fee2e2; }

  /* Main card */
  .main-card { background:#fff; border:1px solid #ebebf0; border-radius:18px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.04); }

  /* Card toolbar */
  .card-toolbar { display:flex; align-items:center; justify-content:space-between; padding:18px 22px; border-bottom:1px solid #f3f4f6; }
  .card-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#111827; }
  .toolbar-right { display:flex; align-items:center; gap:10px; }

  /* Search */
  .search-wrap { position:relative; display:flex; align-items:center; }
  .search-icon { position:absolute; left:11px; color:#c4c9d4; pointer-events:none; }
  .search-input { padding:8px 12px 8px 33px; border:1.5px solid #e5e7eb; border-radius:9px; outline:none; font-size:13px; color:#374151; font-family:'DM Sans',sans-serif; background:#fff; width:200px; }
  .search-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.08); }
  .search-input::placeholder { color:#d1d5db; }

  /* Filter panel */
  .filter-panel-wrap { position:relative; }
  .filter-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; background:#fff; border:1.5px solid #e5e7eb; border-radius:9px; color:#374151; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .filter-btn:hover, .filter-btn.active { border-color:#6366f1; color:#6366f1; background:#f5f3ff; }
  .filter-badge { width:16px; height:16px; border-radius:50%; background:#6366f1; color:#fff; font-size:9px; font-weight:800; display:flex; align-items:center; justify-content:center; }
  .filter-dropdown { position:absolute; top:calc(100%+8px); right:0; background:#fff; border:1px solid #e5e7eb; border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,0.12); z-index:50; padding:18px; width:280px; }
  .filter-section-title { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; }
  .filter-chips { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:16px; }
  .filter-chip { padding:5px 12px; border-radius:99px; font-size:12px; font-weight:600; border:1.5px solid #e5e7eb; background:#fff; color:#374151; cursor:pointer; }
  .filter-chip:hover { border-color:#6366f1; color:#6366f1; }
  .filter-chip.selected { background:#6366f1; color:#fff; border-color:#6366f1; }
  .filter-actions { display:flex; gap:8px; padding-top:8px; border-top:1px solid #f3f4f6; }
  .filter-clear { flex:1; padding:8px; background:#fff; border:1.5px solid #e5e7eb; border-radius:8px; color:#374151; font-size:12px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .filter-clear:hover { border-color:#9ca3af; }
  .filter-apply { flex:1; padding:8px; background:#6366f1; border:none; border-radius:8px; color:#fff; font-size:12px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .filter-apply:hover { background:#4f46e5; }

  /* Table */
  .table-scroll { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead th { padding:10px 20px; font-size:11px; font-weight:700; color:#b0b7c3; text-transform:uppercase; letter-spacing:0.5px; text-align:left; background:#fafafa; border-bottom:1px solid #f3f4f6; white-space:nowrap; cursor:pointer; user-select:none; }
  thead th:hover { color:#374151; }
  thead th .sort-icon { display:inline-flex; flex-direction:column; gap:1px; margin-left:5px; vertical-align:middle; opacity:0.4; }
  thead th.sorted .sort-icon { opacity:1; color:#6366f1; }
  thead th .sort-icon svg { display:block; }
  tbody tr { border-bottom:1px solid #f3f4f6; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover td { background:#fafbff; }
  tbody td { padding:14px 20px; font-size:13px; color:#374151; white-space:nowrap; vertical-align:middle; }
  .col-role { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#111827; cursor:pointer; }
  .col-role:hover { color:#6366f1; }

  /* Status badge */
  .status-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 11px; border-radius:99px; font-size:11px; font-weight:700; border:1.5px solid; }
  .status-live { color:#10b981; border-color:#10b981; background:#ecfdf5; }
  .status-closed { color:#ef4444; border-color:#ef4444; background:#fef2f2; }
  .status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .status-dot-live { background:#10b981; }
  .status-dot-closed { background:#ef4444; }

  /* Job type badge */
  .type-badge { display:inline-flex; padding:4px 11px; border-radius:99px; font-size:11px; font-weight:700; }
  .type-fulltime { background:#ede9fe; color:#6366f1; }
  .type-freelance { background:#fef3c7; color:#d97706; }
  .type-parttime { background:#d1fae5; color:#059669; }

  /* Needs progress */
  .needs-cell { display:flex; align-items:center; gap:8px; }
  .needs-bar { width:48px; height:4px; background:#f3f4f6; border-radius:99px; overflow:hidden; }
  .needs-fill { height:100%; border-radius:99px; }
  .needs-full { background:#10b981; }
  .needs-partial { background:#6366f1; }
  .needs-none { background:#e5e7eb; }

  /* Row actions */
  .row-actions { display:flex; align-items:center; gap:4px; }
  .row-action-btn { width:28px; height:28px; border-radius:7px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#9ca3af; }
  .row-action-btn:hover { border-color:#6366f1; color:#6366f1; background:#f5f3ff; }
  .row-menu { position:relative; }
  .row-menu-btn { width:28px; height:28px; border-radius:7px; border:none; background:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:16px; font-weight:700; }
  .row-menu-btn:hover { background:#f3f4f6; color:#374151; }
  .row-dropdown { position:absolute; right:0; top:calc(100%+4px); background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.1); z-index:40; overflow:hidden; min-width:150px; }
  .row-dropdown-item { padding:9px 14px; font-size:13px; color:#374151; cursor:pointer; display:flex; align-items:center; gap:8px; }
  .row-dropdown-item:hover { background:#f5f3ff; color:#6366f1; }
  .row-dropdown-item.danger { color:#ef4444; }
  .row-dropdown-item.danger:hover { background:#fef2f2; color:#ef4444; }

  /* Pagination */
  .pagination-bar { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #f3f4f6; }
  .per-page { display:flex; align-items:center; gap:10px; font-size:13px; color:#6b7280; }
  .per-page-select { display:flex; align-items:center; gap:6px; padding:6px 10px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:13px; font-weight:600; color:#374151; cursor:pointer; font-family:'DM Sans',sans-serif; background:#fff; }
  .per-page-select:hover { border-color:#6366f1; }
  .page-controls { display:flex; align-items:center; gap:4px; }
  .page-btn { width:32px; height:32px; border-radius:8px; border:1.5px solid #e5e7eb; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#6b7280; font-size:12px; font-weight:700; font-family:'Syne',sans-serif; }
  .page-btn:hover { border-color:#6366f1; color:#6366f1; }
  .page-btn.active { background:#6366f1; border-color:#6366f1; color:#fff; }
  .page-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .page-ellipsis { width:32px; height:32px; display:flex; align-items:center; justify-content:center; color:#9ca3af; font-size:12px; }

  /* Empty state */
  .empty-state { padding:60px 40px; text-align:center; }
  .empty-icon { font-size:40px; margin-bottom:12px; }
  .empty-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#374151; margin-bottom:6px; }
  .empty-desc { font-size:13px; color:#9ca3af; }

  /* Checkbox */
  .cb { width:16px; height:16px; border-radius:4px; border:1.5px solid #e5e7eb; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cb.checked { background:#6366f1; border-color:#6366f1; }
  .select-bar { display:flex; align-items:center; gap:12px; padding:10px 22px; background:#f0f0ff; border-bottom:1px solid #e0e0ff; font-size:13px; color:#6366f1; font-weight:600; }
  .select-bar-btn { padding:6px 12px; background:#6366f1; border:none; border-radius:7px; color:#fff; font-size:12px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; }
  .select-bar-btn.secondary { background:#fff; border:1.5px solid #6366f1; color:#6366f1; }
  .select-bar-btn:hover { opacity:0.9; }

  /* Tooltip */
  [data-tip] { position:relative; }
  [data-tip]:hover::after { content:attr(data-tip); position:absolute; bottom:calc(100%+6px); left:50%; transform:translateX(-50%); background:#1f2937; color:#fff; font-size:11px; white-space:nowrap; padding:4px 8px; border-radius:6px; pointer-events:none; z-index:99; font-family:'DM Sans',sans-serif; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const SortIcon = ({ col, sortCol, sortDir }) => (
    <span className="sort-icon">
        <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
            <path d="M0.5 4.5L3.5 1.5L6.5 4.5" stroke={sortCol === col && sortDir === "asc" ? "#6366f1" : "#d1d5db"} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
            <path d="M0.5 0.5L3.5 3.5L6.5 0.5" stroke={sortCol === col && sortDir === "desc" ? "#6366f1" : "#d1d5db"} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    </span>
);

function NeedsCell({ hired, needs }) {
    const pct = needs === 0 ? 100 : Math.min((hired / needs) * 100, 100);
    const full = hired >= needs;
    const none = hired === 0;
    return (
        <div className="needs-cell">
            <span style={{ fontSize: 13, fontWeight: 700, color: full ? "#10b981" : none ? "#9ca3af" : "#374151" }}>
                {hired} / {needs}
            </span>
            <div className="needs-bar">
                <div className={`needs-fill ${full ? "needs-full" : none ? "needs-none" : "needs-partial"}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

const PAGE_SIZES = [5, 10, 15, 25];

// ── Component ─────────────────────────────────────────────────────────────────
export default function JobListing() {
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [pendingStatus, setPendingStatus] = useState("All");
    const [pendingType, setPendingType] = useState("All");
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [openMenu, setOpenMenu] = useState(null);
    const filterRef = useRef(null);

    // close on outside click
    useEffect(() => {
        const fn = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
            setOpenMenu(null);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    // ── Filter & sort ──
    let data = ALL_JOBS.filter(j => {
        const matchSearch = j.role.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || j.status === filterStatus;
        const matchType = filterType === "All" || j.jobType.toLowerCase() === filterType.toLowerCase();
        return matchSearch && matchStatus && matchType;
    });

    if (sortCol) {
        data = [...data].sort((a, b) => {
            let av = a[sortCol], bv = b[sortCol];
            if (typeof av === "string") av = av.toLowerCase();
            if (typeof bv === "string") bv = bv.toLowerCase();
            return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
        });
    }

    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const paged = data.slice((page - 1) * pageSize, page * pageSize);

    const handleSort = (col) => {
        if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortCol(col); setSortDir("asc"); }
        setPage(1);
    };

    const toggleSelect = (id) => setSelectedIds(s => {
        const n = new Set(s);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
    });
    const allSelected = paged.length > 0 && paged.every(j => selectedIds.has(j.id));
    const toggleAll = () => {
        if (allSelected) setSelectedIds(s => { const n = new Set(s); paged.forEach(j => n.delete(j.id)); return n; });
        else setSelectedIds(s => { const n = new Set(s); paged.forEach(j => n.add(j.id)); return n; });
    };

    const applyFilters = () => { setFilterStatus(pendingStatus); setFilterType(pendingType); setPage(1); setFilterOpen(false); };
    const clearFilters = () => { setPendingStatus("All"); setPendingType("All"); setFilterStatus("All"); setFilterType("All"); setPage(1); };
    const activeFilterCount = [filterStatus !== "All", filterType !== "All"].filter(Boolean).length;

    // Stats
    const liveCount = ALL_JOBS.filter(j => j.status === "live").length;
    const closedCount = ALL_JOBS.filter(j => j.status === "closed").length;
    const totalHired = ALL_JOBS.reduce((s, j) => s + j.hired, 0);

    // Pagination pages
    const pageNums = () => {
        if (totalPages <= 6) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
        if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    };

    return (
        <>
            <style>{styles}</style>
            <div className="page" onClick={() => setOpenMenu(null)}>

                {/* Topbar */}
                <div className="topbar">
                    <div className="brand">
                        <div className="brand-logo">N</div>
                        <div className="brand-info">
                            <div className="brand-company">Company</div>
                            <div className="brand-name">Nomad <span style={{ fontSize: 10, color: "#9ca3af" }}>▾</span></div>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button className="notif-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a5 5 0 00-5 5v3l-1.5 2h13L13 9V6a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" /></svg>
                            <div className="notif-dot" />
                        </button>
                        <button className="post-job-btn">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Post a job
                        </button>
                    </div>
                </div>

                <div className="content">
                    {/* Page header */}
                    <div className="page-header">
                        <div>
                            <div className="page-title">Job Listing</div>
                            <div className="page-subtitle">Here is your jobs listing status from July 19 – July 25.</div>
                        </div>
                        <button className="date-range-btn">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M1 6h12M5 1v2M9 1v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                            Jul 19 – Jul 25
                        </button>
                    </div>

                    {/* Summary stats */}
                    <div className="stats-row">
                        <div className="stat-card c-total">
                            <div className="stat-num">{ALL_JOBS.length}</div>
                            <div className="stat-label">Total Jobs</div>
                            <div className="stat-trend up">↑ 8%</div>
                        </div>
                        <div className="stat-card c-live">
                            <div className="stat-num">{liveCount}</div>
                            <div className="stat-label">Live Jobs</div>
                            <div className="stat-trend up">↑ 12%</div>
                        </div>
                        <div className="stat-card c-closed">
                            <div className="stat-num">{closedCount}</div>
                            <div className="stat-label">Closed Jobs</div>
                            <div className="stat-trend down">↓ 3%</div>
                        </div>
                        <div className="stat-card c-hired">
                            <div className="stat-num">{totalHired}</div>
                            <div className="stat-label">Total Hired</div>
                            <div className="stat-trend up">↑ 5%</div>
                        </div>
                    </div>

                    {/* Main table card */}
                    <div className="main-card">
                        {/* Toolbar */}
                        <div className="card-toolbar">
                            <div className="card-title">Job List</div>
                            <div className="toolbar-right">
                                <div className="search-wrap">
                                    <span className="search-icon">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#C4C9D4" strokeWidth="1.5" /><path d="M10 10l2.5 2.5" stroke="#C4C9D4" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                    </span>
                                    <input className="search-input" placeholder="Search jobs…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                                </div>

                                {/* Filter */}
                                <div className="filter-panel-wrap" ref={filterRef}>
                                    <button className={`filter-btn ${filterOpen ? "active" : ""}`} onClick={e => { e.stopPropagation(); setFilterOpen(o => !o); }}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M4 7h6M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                        Filters
                                        {activeFilterCount > 0 && <div className="filter-badge">{activeFilterCount}</div>}
                                    </button>
                                    {filterOpen && (
                                        <div className="filter-dropdown" onClick={e => e.stopPropagation()}>
                                            <div className="filter-section-title">Status</div>
                                            <div className="filter-chips">
                                                {STATUSES.map(s => (
                                                    <div key={s} className={`filter-chip ${pendingStatus === s ? "selected" : ""}`} onClick={() => setPendingStatus(s)}>
                                                        {s === "All" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="filter-section-title">Job Type</div>
                                            <div className="filter-chips">
                                                {JOB_TYPES.map(t => (
                                                    <div key={t} className={`filter-chip ${pendingType === t ? "selected" : ""}`} onClick={() => setPendingType(t)}>{t}</div>
                                                ))}
                                            </div>
                                            <div className="filter-actions">
                                                <button className="filter-clear" onClick={clearFilters}>Clear All</button>
                                                <button className="filter-apply" onClick={applyFilters}>Apply Filters</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bulk actions bar */}
                        {selectedIds.size > 0 && (
                            <div className="select-bar">
                                <span>{selectedIds.size} selected</span>
                                <button className="select-bar-btn">Change Status</button>
                                <button className="select-bar-btn secondary">Export</button>
                                <button className="select-bar-btn" style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fca5a5" }} onClick={() => setSelectedIds(new Set())}>Deselect All</button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="table-scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: 40, paddingRight: 0 }}>
                                            <div className={`cb ${allSelected ? "checked" : ""}`} onClick={toggleAll}>
                                                {allSelected && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                            </div>
                                        </th>
                                        {[
                                            { key: "role", label: "Roles" },
                                            { key: "status", label: "Status" },
                                            { key: "datePosted", label: "Date Posted" },
                                            { key: "dueDate", label: "Due Date" },
                                            { key: "jobType", label: "Job Type" },
                                            { key: "applicants", label: "Applicants" },
                                            { key: "needs", label: "Needs" },
                                        ].map(col => (
                                            <th key={col.key} className={sortCol === col.key ? "sorted" : ""} onClick={() => handleSort(col.key)}>
                                                {col.label} <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                                            </th>
                                        ))}
                                        <th style={{ textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paged.length === 0 ? (
                                        <tr><td colSpan={9}>
                                            <div className="empty-state">
                                                <div className="empty-icon">🔍</div>
                                                <div className="empty-title">No jobs found</div>
                                                <div className="empty-desc">Try adjusting your search or filters</div>
                                            </div>
                                        </td></tr>
                                    ) : paged.map(job => (
                                        <tr key={job.id}>
                                            <td style={{ paddingRight: 0 }}>
                                                <div className={`cb ${selectedIds.has(job.id) ? "checked" : ""}`} onClick={() => toggleSelect(job.id)}>
                                                    {selectedIds.has(job.id) && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                </div>
                                            </td>
                                            <td className="col-role">{job.role}</td>
                                            <td>
                                                <span className={`status-badge ${job.status === "live" ? "status-live" : "status-closed"}`}>
                                                    <span className={`status-dot ${job.status === "live" ? "status-dot-live" : "status-dot-closed"}`} />
                                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ color: "#6b7280" }}>{job.datePosted}</td>
                                            <td style={{ color: "#6b7280" }}>{job.dueDate}</td>
                                            <td>
                                                <span className={`type-badge ${job.jobType === "Fulltime" ? "type-fulltime" :
                                                        job.jobType === "Freelance" ? "type-freelance" : "type-parttime"}`}>
                                                    {job.jobType}
                                                </span>
                                            </td>
                                            <td style={{ fontWeight: 700, color: "#374151" }}>{job.applicants.toLocaleString()}</td>
                                            <td><NeedsCell hired={job.hired} needs={job.needs} /></td>
                                            <td>
                                                <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                                                    <button className="row-action-btn" data-tip="View analytics">
                                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3-4 3 2 3-5 2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                    <button className="row-action-btn" data-tip="Edit job">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    </button>
                                                    <div className="row-menu" onClick={e => e.stopPropagation()}>
                                                        <button className="row-menu-btn" onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)}>⋯</button>
                                                        {openMenu === job.id && (
                                                            <div className="row-dropdown">
                                                                <div className="row-dropdown-item">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                                                                    View Details
                                                                </div>
                                                                <div className="row-dropdown-item">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                                    Edit Job
                                                                </div>
                                                                <div className="row-dropdown-item">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 10l3-4 3 2 3-5 2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                                    Analytics
                                                                </div>
                                                                <div className="row-dropdown-item">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                                                    {job.status === "live" ? "Close Job" : "Reopen Job"}
                                                                </div>
                                                                <div className="row-dropdown-item danger">
                                                                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M10.5 3.5l-.5 7H3L2.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                                    Delete Job
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="pagination-bar">
                            <div className="per-page">
                                View
                                <div className="per-page-select" style={{ cursor: "default" }}>
                                    <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(1); }}
                                        style={{ border: "none", outline: "none", font: "inherit", cursor: "pointer", background: "transparent", fontWeight: 700, color: "#374151" }}>
                                        {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                Applicants per page
                            </div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>{data.length} results</div>
                            <div className="page-controls">
                                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                                {pageNums().map((p, i) =>
                                    p === "..."
                                        ? <div key={`e${i}`} className="page-ellipsis">…</div>
                                        : <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                                )}
                                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}