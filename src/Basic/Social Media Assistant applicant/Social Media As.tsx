import { useState, useRef } from "react";

const AVATAR_COLORS = [
    ["#6366f1", "#818cf8"], ["#10b981", "#34d399"], ["#f59e0b", "#fbbf24"],
    ["#ef4444", "#f87171"], ["#8b5cf6", "#a78bfa"], ["#06b6d4", "#22d3ee"],
    ["#ec4899", "#f472b6"], ["#84cc16", "#a3e635"], ["#f97316", "#fb923c"],
];

const INITIAL_COLS = [
    {
        id: "review", label: "In Review", color: "#f59e0b", bg: "#fffbeb",
        applicants: [
            { id: 1, name: "Jake Gyll", score: 4.0, date: "13 July, 2021", color: 0 },
            { id: 2, name: "Jenny Wilson", score: 0.0, date: "13 July, 2021", color: 1 },
            { id: 3, name: "Jacob Jones", score: 0.0, date: "13 July, 2021", color: 2 },
            { id: 4, name: "Wade Warren", score: 0.0, date: "13 July, 2021", color: 8 },
        ],
    },
    {
        id: "shortlisted", label: "Shortlisted", color: "#6366f1", bg: "#f5f3ff",
        applicants: [
            { id: 5, name: "Jane Cooper", score: 0.0, date: "13 July, 2021", color: 3 },
            { id: 6, name: "Courtney Henry", score: 0.0, date: "13 July, 2021", color: 4 },
        ],
    },
    {
        id: "interview", label: "Interview", color: "#06b6d4", bg: "#ecfeff",
        applicants: [
            { id: 7, name: "Floyd Miles", score: 0.0, date: "13 July, 2021", color: 5 },
            { id: 8, name: "Devon Lane", score: 0.0, date: "13 July, 2021", color: 6 },
            { id: 9, name: "Marvin McKin...", score: 0.0, date: "13 July, 2021", color: 7 },
        ],
    },
    {
        id: "hired", label: "Hired", color: "#10b981", bg: "#ecfdf5",
        applicants: [
            { id: 10, name: "Annette Black", score: 0.0, date: "13 July, 2021", color: 0 },
            { id: 11, name: "Brooklyn Sim...", score: 0.0, date: "13 July, 2021", color: 1 },
            { id: 12, name: "Ronald Richa...", score: 0.0, date: "13 July, 2021", color: 2 },
        ],
    },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'DM Sans',sans-serif; background:#f5f6fa; min-height:100vh; }

  .page { min-height:100vh; background:#f5f6fa; display:flex; flex-direction:column; }

  /* Topbar */
  .topbar { display:flex; align-items:center; justify-content:space-between; background:#fff; border-bottom:1px solid #e8eaf0; padding:0 28px; height:56px; flex-shrink:0; position:sticky; top:0; z-index:100; }
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

  /* Subheader */
  .subheader { background:#fff; border-bottom:1px solid #e8eaf0; padding:16px 28px; }
  .job-back { display:flex; align-items:center; gap:6px; color:#6b7280; font-size:13px; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; margin-bottom:8px; padding:0; }
  .job-back:hover { color:#111827; }
  .subheader-row { display:flex; align-items:center; justify-content:space-between; }
  .job-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#111827; margin-bottom:4px; }
  .job-meta { display:flex; align-items:center; gap:6px; font-size:13px; color:#6b7280; }
  .job-meta-dot { color:#d1d5db; }
  .hired-badge { color:#6366f1; font-weight:700; }
  .more-action-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; background:#fff; border:1.5px solid #e5e7eb; border-radius:10px; color:#374151; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; white-space:nowrap; }
  .more-action-btn:hover { border-color:#6366f1; color:#6366f1; }

  /* Tabs */
  .tabs { background:#fff; border-bottom:2px solid #e5e7eb; padding:0 28px; display:flex; }
  .tab { padding:12px 18px; font-size:13px; font-weight:600; color:#9ca3af; background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; position:relative; }
  .tab:hover { color:#374151; }
  .tab.active { color:#6366f1; }
  .tab.active::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:#6366f1; border-radius:2px 2px 0 0; }

  /* Toolbar */
  .toolbar { display:flex; align-items:center; justify-content:space-between; padding:16px 28px; }
  .total-label { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111827; }
  .total-label span { color:#6366f1; }
  .toolbar-right { display:flex; align-items:center; gap:10px; }
  .search-wrap { position:relative; display:flex; align-items:center; }
  .search-icon { position:absolute; left:11px; color:#c4c9d4; pointer-events:none; }
  .search-input { padding:9px 14px 9px 34px; border:1.5px solid #e5e7eb; border-radius:10px; outline:none; font-size:13px; color:#374151; font-family:'DM Sans',sans-serif; background:#fff; width:220px; }
  .search-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,0.08); }
  .search-input::placeholder { color:#d1d5db; }
  .filter-btn { display:flex; align-items:center; gap:6px; padding:9px 14px; background:#fff; border:1.5px solid #e5e7eb; border-radius:10px; color:#374151; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .filter-btn:hover { border-color:#6366f1; color:#6366f1; }
  .view-toggle { display:flex; border:1.5px solid #e5e7eb; border-radius:10px; overflow:hidden; }
  .view-btn { padding:8px 16px; font-size:13px; font-weight:600; color:#9ca3af; background:#fff; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; }
  .view-btn:hover { background:#f9fafb; }
  .view-btn.active { background:#6366f1; color:#fff; }

  /* ── Kanban board ── */
  .kanban-wrap { flex:1; padding:0 28px 28px; overflow-x:auto; }
  .kanban { display:grid; grid-template-columns:repeat(4,minmax(240px,1fr)); gap:16px; align-items:flex-start; }

  .col-wrap { background:#fafafa; border:1px solid #ebebf0; border-radius:16px; min-height:300px; display:flex; flex-direction:column; }
  .col-wrap.drag-over { border-color:#6366f1; background:#f5f3ff; }

  .col-header { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #ebebf0; }
  .col-header-left { display:flex; align-items:center; gap:8px; }
  .col-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
  .col-label { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#374151; }
  .col-count { padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700; }
  .col-menu { width:24px; height:24px; border:none; background:none; cursor:pointer; color:#c4c9d4; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:14px; }
  .col-menu:hover { background:#f3f4f6; color:#374151; }

  .col-body { padding:12px; display:flex; flex-direction:column; gap:10px; flex:1; }

  /* Applicant card */
  .app-card {
    background:#fff; border:1px solid #ebebf0; border-radius:12px; padding:14px;
    cursor:grab; position:relative;
  }
  .app-card:hover { border-color:#c7d2fe; box-shadow:0 2px 10px rgba(99,102,241,0.08); }
  .app-card.dragging { opacity:0.5; }
  .app-card-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
  .app-avatar { width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:13px; color:#fff; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,0.1); }
  .app-name-wrap { flex:1; min-width:0; }
  .app-name { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .app-link { font-size:11px; color:#6366f1; font-weight:600; cursor:pointer; }
  .app-link:hover { text-decoration:underline; }
  .app-card-footer { display:flex; align-items:center; justify-content:space-between; border-top:1px solid #f3f4f6; padding-top:10px; }
  .app-meta { font-size:11px; color:#9ca3af; }
  .app-meta-val { font-size:11px; font-weight:600; color:#374151; margin-top:1px; }
  .app-score { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:700; color:#374151; }
  .star { color:#f59e0b; }
  .star.empty { color:#e5e7eb; }

  /* Move button */
  .move-btn {
    position:absolute; top:10px; right:10px; width:22px; height:22px;
    border-radius:6px; border:1px solid #e5e7eb; background:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center; color:#c4c9d4;
    opacity:0;
  }
  .app-card:hover .move-btn { opacity:1; }
  .move-btn:hover { border-color:#6366f1; color:#6366f1; }

  /* Add card button */
  .add-card-btn {
    width:100%; padding:10px; border:1.5px dashed #e5e7eb; border-radius:10px;
    background:transparent; color:#9ca3af; font-size:12px; font-weight:600;
    font-family:'DM Sans',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;
    margin-top:4px;
  }
  .add-card-btn:hover { border-color:#6366f1; color:#6366f1; background:#f5f3ff; }

  /* ── Table view ── */
  .table-wrap { padding:0 28px 28px; overflow-x:auto; }
  .data-table { width:100%; border-collapse:collapse; background:#fff; border-radius:16px; overflow:hidden; border:1px solid #ebebf0; }
  .data-table th { padding:12px 16px; font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; background:#fafafa; border-bottom:1px solid #ebebf0; text-align:left; }
  .data-table td { padding:14px 16px; font-size:13px; color:#374151; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
  .data-table tr:last-child td { border-bottom:none; }
  .data-table tr:hover td { background:#fafbff; }
  .table-avatar { width:32px; height:32px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:11px; color:#fff; }
  .table-name { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#111827; }
  .stage-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:99px; font-size:11px; font-weight:700; }
  .score-stars { display:flex; gap:2px; }

  /* Profile modal */
  .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.2); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .modal { background:#fff; border-radius:20px; width:100%; max-width:480px; box-shadow:0 24px 60px rgba(0,0,0,0.15); overflow:hidden; }
  .modal-head { padding:22px 24px 18px; border-bottom:1px solid #f3f4f6; display:flex; align-items:center; justify-content:space-between; }
  .modal-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#111827; }
  .modal-close { width:30px; height:30px; border:1px solid #e5e7eb; border-radius:8px; background:#fff; cursor:pointer; font-size:16px; color:#9ca3af; display:flex; align-items:center; justify-content:center; }
  .modal-close:hover { color:#374151; }
  .modal-body { padding:22px 24px; }
  .modal-profile { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
  .modal-avatar { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:22px; color:#fff; }
  .modal-info-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#111827; margin-bottom:3px; }
  .modal-info-role { font-size:13px; color:#9ca3af; }
  .modal-section-title { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; }
  .modal-detail-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f3f4f6; font-size:13px; }
  .modal-detail-row:last-child { border-bottom:none; }
  .modal-detail-label { color:#9ca3af; }
  .modal-detail-val { font-weight:600; color:#374151; }
  .modal-actions { display:flex; gap:8px; margin-top:16px; }
  .modal-action-btn { flex:1; padding:10px; border-radius:10px; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif; cursor:pointer; }
  .btn-primary { background:#6366f1; border:none; color:#fff; }
  .btn-primary:hover { background:#4f46e5; }
  .btn-secondary { background:#fff; border:1.5px solid #e5e7eb; color:#374151; }
  .btn-secondary:hover { border-color:#6366f1; color:#6366f1; }
  .btn-danger { background:#fff; border:1.5px solid #fca5a5; color:#ef4444; }
  .btn-danger:hover { background:#fef2f2; }

  /* Stage move select */
  .stage-select { padding:8px 14px; border:1.5px solid #e5e7eb; border-radius:9px; outline:none; font-size:13px; font-family:'DM Sans',sans-serif; color:#374151; appearance:none; background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4l3 3 3-3' stroke='%239CA3AF' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center; padding-right:28px; cursor:pointer; }
  .stage-select:focus { border-color:#6366f1; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function Avatar({ name, colorIdx, size = 38 }) {
    const colors = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
    return (
        <div style={{ width: size, height: size, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${colors[0]},${colors[1]})`, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: size * 0.35, color: "#fff", flexShrink: 0 }}>
            {initials}
        </div>
    );
}

function StarRating({ score }) {
    return (
        <div className="score-stars">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= Math.round(score) ? "#f59e0b" : "#e5e7eb"}>
                    <path d="M6 1l1.2 3.6H11L8 6.8l1.2 3.7L6 8.4 2.8 10.5 4 6.8 1 4.6h3.8L6 1z" />
                </svg>
            ))}
        </div>
    );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function Applicants() {
    const [cols, setCols] = useState(INITIAL_COLS);
    const [view, setView] = useState("pipeline");
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("Applicants");
    const [profileModal, setProfileModal] = useState(null);
    const [dragState, setDragState] = useState({ cardId: null, fromColId: null });
    const [dragOverCol, setDragOverCol] = useState(null);
    const [scores, setScores] = useState({});

    const allApplicants = cols.flatMap(c => c.applicants.map(a => ({ ...a, stage: c.id, stageLabel: c.label, stageColor: c.color })));
    const totalApplicants = allApplicants.length;

    const filtered = search
        ? allApplicants.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
        : allApplicants;

    // ── Drag & Drop ──
    const onDragStart = (cardId, fromColId) => setDragState({ cardId, fromColId });
    const onDragOverCol = (colId) => setDragOverCol(colId);
    const onDropCol = (toColId) => {
        const { cardId, fromColId } = dragState;
        if (!cardId || fromColId === toColId) { setDragOverCol(null); return; }
        setCols(prev => {
            const next = prev.map(c => ({ ...c, applicants: [...c.applicants] }));
            const fromCol = next.find(c => c.id === fromColId);
            const toCol = next.find(c => c.id === toColId);
            const card = fromCol.applicants.find(a => a.id === cardId);
            if (!card) return prev;
            fromCol.applicants = fromCol.applicants.filter(a => a.id !== cardId);
            toCol.applicants.push(card);
            return next;
        });
        setDragState({ cardId: null, fromColId: null });
        setDragOverCol(null);
    };

    const moveApplicant = (cardId, fromColId, toColId) => {
        if (fromColId === toColId) return;
        setCols(prev => {
            const next = prev.map(c => ({ ...c, applicants: [...c.applicants] }));
            const from = next.find(c => c.id === fromColId);
            const to = next.find(c => c.id === toColId);
            const card = from.applicants.find(a => a.id === cardId);
            if (!card) return prev;
            from.applicants = from.applicants.filter(a => a.id !== cardId);
            to.applicants.push(card);
            return next;
        });
        if (profileModal?.id === cardId) setProfileModal(null);
    };

    const setScore = (id, score) => setScores(s => ({ ...s, [id]: score }));

    return (
        <>
            <style>{styles}</style>
            <div className="page">

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

                {/* Subheader */}
                <div className="subheader">
                    <button className="job-back">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Back
                    </button>
                    <div className="subheader-row">
                        <div>
                            <div className="job-title">Social Media Assistant</div>
                            <div className="job-meta">
                                <span>Design</span><span className="job-meta-dot">•</span>
                                <span>Full-Time</span><span className="job-meta-dot">•</span>
                                <span>4 / <span className="hired-badge">11 Hired</span></span>
                            </div>
                        </div>
                        <button className="more-action-btn">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M9 5l-2 2-2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            More Action
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    {["Applicants", "Job Details", "Settings"].map(t => (
                        <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="total-label">Total Applicants : <span>{totalApplicants}</span></div>
                    <div className="toolbar-right">
                        <div className="search-wrap">
                            <span className="search-icon">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#C4C9D4" strokeWidth="1.5" /><path d="M10 10l2.5 2.5" stroke="#C4C9D4" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </span>
                            <input className="search-input" placeholder="Search Applicants" value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <button className="filter-btn">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M4 7h6M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            Filter
                        </button>
                        <div className="view-toggle">
                            <button className={`view-btn ${view === "pipeline" ? "active" : ""}`} onClick={() => setView("pipeline")}>Pipeline View</button>
                            <button className={`view-btn ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>Table View</button>
                        </div>
                    </div>
                </div>

                {/* ── Pipeline View ── */}
                {view === "pipeline" && (
                    <div className="kanban-wrap">
                        <div className="kanban">
                            {cols.map(col => {
                                const colApps = search
                                    ? col.applicants.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
                                    : col.applicants;
                                return (
                                    <div
                                        key={col.id}
                                        className={`col-wrap ${dragOverCol === col.id ? "drag-over" : ""}`}
                                        onDragOver={e => { e.preventDefault(); onDragOverCol(col.id); }}
                                        onDrop={() => onDropCol(col.id)}
                                        onDragLeave={() => dragOverCol === col.id && setDragOverCol(null)}
                                    >
                                        <div className="col-header">
                                            <div className="col-header-left">
                                                <div className="col-dot" style={{ background: col.color }} />
                                                <div className="col-label">{col.label}</div>
                                                <div className="col-count" style={{ background: col.bg, color: col.color }}>{colApps.length}</div>
                                            </div>
                                            <button className="col-menu">⋯</button>
                                        </div>
                                        <div className="col-body">
                                            {colApps.map(app => (
                                                <div
                                                    key={app.id}
                                                    className="app-card"
                                                    draggable
                                                    onDragStart={() => onDragStart(app.id, col.id)}
                                                    onDragEnd={() => setDragState({ cardId: null, fromColId: null })}
                                                >
                                                    <button className="move-btn" title="Move">
                                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                                                    </button>
                                                    <div className="app-card-top">
                                                        <Avatar name={app.name} colorIdx={app.color} size={38} />
                                                        <div className="app-name-wrap">
                                                            <div className="app-name">{app.name}</div>
                                                            <div className="app-link" onClick={() => setProfileModal({ ...app, stage: col.id, stageLabel: col.label, stageColor: col.color })}>View Profile</div>
                                                        </div>
                                                    </div>
                                                    <div className="app-card-footer">
                                                        <div>
                                                            <div className="app-meta">Applied on</div>
                                                            <div className="app-meta-val">{app.date}</div>
                                                        </div>
                                                        <div>
                                                            <div className="app-meta">Score</div>
                                                            <div className="app-score">
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill={scores[app.id] > 0 ? "#f59e0b" : "#e5e7eb"}><path d="M6 1l1.2 3.6H11L8 6.8l1.2 3.7L6 8.4 2.8 10.5 4 6.8 1 4.6h3.8L6 1z" /></svg>
                                                                {(scores[app.id] || app.score).toFixed(1)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="add-card-btn">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                                                Add Applicant
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Table View ── */}
                {view === "table" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Stage</th>
                                    <th>Applied On</th>
                                    <th>Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(app => (
                                    <tr key={app.id}>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <Avatar name={app.name} colorIdx={app.color} size={32} />
                                                <div>
                                                    <div className="table-name">{app.name}</div>
                                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Applicant</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="stage-pill" style={{ background: cols.find(c => c.id === app.stage)?.bg, color: app.stageColor }}>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: app.stageColor, display: "inline-block" }} />
                                                {app.stageLabel}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13, color: "#6b7280" }}>{app.date}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <StarRating score={scores[app.id] || app.score} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{(scores[app.id] || app.score).toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button style={{ padding: "5px 12px", background: "#f5f3ff", border: "none", borderRadius: 7, color: "#6366f1", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                                                    onClick={() => setProfileModal({ ...app })}>View</button>
                                                <select className="stage-select" value={app.stage}
                                                    onChange={e => moveApplicant(app.id, app.stage, e.target.value)}>
                                                    {cols.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>No applicants match your search</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Profile Modal ── */}
            {profileModal && (
                <div className="modal-backdrop" onClick={() => setProfileModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-head">
                            <div className="modal-title">Applicant Profile</div>
                            <button className="modal-close" onClick={() => setProfileModal(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-profile">
                                <Avatar name={profileModal.name} colorIdx={profileModal.color} size={64} />
                                <div>
                                    <div className="modal-info-name">{profileModal.name}</div>
                                    <div className="modal-info-role">Applying for Social Media Assistant</div>
                                </div>
                            </div>

                            <div className="modal-section-title">Application Details</div>
                            {[
                                { label: "Applied On", value: profileModal.date },
                                { label: "Current Stage", value: profileModal.stageLabel },
                                { label: "Score", value: `${(scores[profileModal.id] || profileModal.score).toFixed(1)} / 5.0` },
                            ].map(r => (
                                <div key={r.label} className="modal-detail-row">
                                    <span className="modal-detail-label">{r.label}</span>
                                    <span className="modal-detail-val">{r.value}</span>
                                </div>
                            ))}

                            <div style={{ marginTop: 16 }}>
                                <div className="modal-section-title" style={{ marginBottom: 8 }}>Rate Applicant</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setScore(profileModal.id, s)}
                                            style={{ width: 34, height: 34, border: "1.5px solid", borderColor: s <= (scores[profileModal.id] || 0) ? "#f59e0b" : "#e5e7eb", borderRadius: 8, background: s <= (scores[profileModal.id] || 0) ? "#fffbeb" : "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 16 }}>
                                <div className="modal-section-title" style={{ marginBottom: 8 }}>Move to Stage</div>
                                <select className="stage-select" style={{ width: "100%" }} value={profileModal.stage}
                                    onChange={e => { moveApplicant(profileModal.id, profileModal.stage, e.target.value); setProfileModal(null); }}>
                                    {cols.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button className="modal-action-btn btn-primary">Send Email</button>
                                <button className="modal-action-btn btn-secondary">Download CV</button>
                                <button className="modal-action-btn btn-danger">Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}