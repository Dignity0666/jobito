import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f5f6fa;
    min-height: 100vh;
  }

  .wrapper {
    min-height: 100vh;
    background: #f5f6fa;
    display: flex;
    justify-content: center;
    padding: 40px 20px 80px;
  }

  .container { width: 100%; max-width: 820px; }

  /* Page title */
  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 24px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 36px;
    gap: 0;
  }
  .tab {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    font-family: 'DM Sans', sans-serif;
  }
  .tab:hover { color: #374151; }
  .tab.active { color: #6366f1; }
  .tab.active::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px;
    background: #6366f1;
    border-radius: 2px 2px 0 0;
  }

  /* Section block */
  .section-block {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .section-header-bar {
    padding: 20px 28px 0;
  }
  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2px;
  }
  .section-desc {
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 0;
  }

  /* Two-col row inside sections */
  .two-col-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0;
    padding: 24px 28px;
    border-top: 1px solid #f3f4f6;
    align-items: flex-start;
  }
  .two-col-row:first-of-type { border-top: none; }

  .row-label-col { padding-right: 20px; padding-top: 2px; }
  .row-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 4px; }
  .row-hint { font-size: 11px; color: #9ca3af; line-height: 1.5; }

  /* Inputs */
  .input-field {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    color: #111827;
    font-family: 'DM Sans', sans-serif;
    outline: none;
  }
  .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .input-field::placeholder { color: #d1d5db; }

  .input-group { margin-bottom: 12px; }
  .input-group:last-child { margin-bottom: 0; }
  .input-group-label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 6px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* Tag input */
  .tag-input-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 8px 10px;
    cursor: text;
  }
  .tag-input-wrap:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .tag {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.2);
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    color: #4f46e5;
  }
  .tag-remove {
    background: none;
    border: none;
    cursor: pointer;
    color: #6366f1;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    display: flex;
  }
  .tag-remove:hover { color: #dc2626; }
  .tag-input {
    border: none;
    outline: none;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #374151;
    min-width: 80px;
    flex: 1;
    background: transparent;
    padding: 2px 4px;
  }
  .tag-input::placeholder { color: #d1d5db; }

  /* Select */
  .select-field {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    color: #374151;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
  }
  .select-field:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

  /* Date row */
  .date-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  /* Inline two select */
  .dual-select { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Logo upload area */
  .logo-section {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
  }
  .logo-preview {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 800;
    color: #fff;
    font-family: 'Syne', sans-serif;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  .logo-preview img { width: 100%; height: 100%; object-fit: cover; }
  .logo-preview-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; border-radius: 16px;
    cursor: pointer;
    color: #fff; font-size: 12px; font-weight: 600;
  }
  .logo-preview:hover .logo-preview-overlay { opacity: 1; }

  .logo-dropzone {
    flex: 1;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    background: #fafafa;
  }
  .logo-dropzone:hover { border-color: #6366f1; background: #f5f3ff; }
  .logo-dropzone.dragover { border-color: #6366f1; background: #ede9fe; }
  .dropzone-icon { color: #9ca3af; margin-bottom: 8px; }
  .dropzone-text { font-size: 13px; color: #6b7280; font-weight: 500; }
  .dropzone-text strong { color: #6366f1; cursor: pointer; }
  .dropzone-hint { font-size: 11px; color: #9ca3af; margin-top: 4px; }
  .file-input { display: none; }

  /* Rich text editor */
  .editor-wrap {
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
    overflow: hidden;
  }
  .editor-wrap:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 10px;
    border-bottom: 1px solid #f3f4f6;
    background: #fafafa;
  }
  .toolbar-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border: none; background: none; border-radius: 6px;
    cursor: pointer; color: #6b7280; font-size: 13px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
  }
  .toolbar-btn:hover { background: #f3f4f6; color: #111827; }
  .toolbar-btn.active { background: #ede9fe; color: #6366f1; }
  .toolbar-sep { width: 1px; height: 16px; background: #e5e7eb; margin: 0 3px; }

  .editor-area {
    min-height: 100px;
    padding: 12px 14px;
    font-size: 14px;
    color: #374151;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    line-height: 1.7;
    resize: none;
  }
  .editor-area:empty::before {
    content: attr(data-placeholder);
    color: #d1d5db;
    pointer-events: none;
  }
  .editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 12px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
  }
  .editor-hint { font-size: 11px; color: #9ca3af; }
  .char-counter { font-size: 11px; font-weight: 600; color: #d1d5db; }
  .char-counter.good { color: #6366f1; }
  .char-counter.warn { color: #f59e0b; }
  .char-counter.over { color: #ef4444; }

  /* Save bar */
  .save-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 16px 24px;
    margin-top: 24px;
  }
  .save-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #9ca3af;
  }
  .save-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #e5e7eb;
  }
  .save-dot.changed { background: #f59e0b; }
  .save-dot.saved { background: #10b981; }

  .save-btn {
    padding: 12px 28px;
    background: #6366f1;
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    cursor: pointer;
  }
  .save-btn:hover { background: #4f46e5; }
  .save-btn:disabled { background: #c7d2fe; cursor: not-allowed; }

  .discard-btn {
    padding: 12px 20px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    margin-right: 10px;
  }
  .discard-btn:hover { border-color: #9ca3af; color: #374151; }

  /* Progress indicator */
  .profile-progress {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 18px 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .progress-label { font-size: 13px; font-weight: 600; color: #374151; white-space: nowrap; }
  .progress-bar-wrap {
    flex: 1;
    height: 6px;
    background: #f3f4f6;
    border-radius: 99px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: #6366f1;
    border-radius: 99px;
  }
  .progress-pct {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #6366f1;
    white-space: nowrap;
  }
  .progress-tip { font-size: 12px; color: #9ca3af; white-space: nowrap; }
`;

const TOOLBAR = [
  { id: "bold", label: "B" },
  { id: "italic", label: "I" },
  { id: "underline", label: "U" },
  { id: "sep" },
  { id: "insertUnorderedList", label: "•" },
  { id: "insertOrderedList", label: "1." },
  { id: "sep" },
  { id: "link", label: "🔗" },
];

function RichEditor({ placeholder, maxChars = 500, value, onChange }) {
  const ref = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [active, setActive] = useState({});

  const exec = (cmd) => {
    if (cmd === "link") { const u = prompt("URL:"); if (u) document.execCommand("createLink", false, u); }
    else document.execCommand(cmd, false, null);
    ref.current?.focus();
    updateActive();
  };
  const updateActive = () => setActive({
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    insertOrderedList: document.queryCommandState("insertOrderedList"),
  });
  const handleInput = () => {
    const txt = ref.current?.innerText || "";
    setCharCount(txt.length);
    onChange && onChange(ref.current?.innerHTML || "");
    updateActive();
  };
  const cc = charCount > maxChars ? "over" : charCount > maxChars * 0.85 ? "warn" : charCount > 10 ? "good" : "";

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        {TOOLBAR.map((t, i) => t.id === "sep"
          ? <div key={i} className="toolbar-sep" />
          : <button key={t.id} className={`toolbar-btn ${active[t.id] ? "active" : ""}`}
              onMouseDown={e => { e.preventDefault(); exec(t.id); }}>{t.label}</button>
        )}
      </div>
      <div
        ref={ref}
        className="editor-area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyUp={updateActive}
        onMouseUp={updateActive}
      />
      <div className="editor-footer">
        <span className="editor-hint">Maximum {maxChars} characters</span>
        <span className={`char-counter ${cc}`}>{charCount} / {maxChars}</span>
      </div>
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState("");
  const handleKey = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length) onRemove(tags[tags.length - 1]);
  };
  return (
    <div className="tag-input-wrap" onClick={e => e.currentTarget.querySelector("input")?.focus()}>
      {tags.map(t => (
        <span key={t} className="tag">
          {t}
          <button className="tag-remove" onClick={() => onRemove(t)}>×</button>
        </span>
      ))}
      <input
        className="tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={tags.length ? "" : placeholder}
      />
    </div>
  );
}

const TABS = ["Overview", "Social Links", "Team"];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const INDUSTRIES = ["Technology","Finance","Healthcare","Education","Marketing","Retail","Media","Legal","Manufacturing","Other"];
const EMP_RANGES = ["1 - 10","11 - 50","51 - 200","201 - 500","501 - 1000","1000+"];

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [hasChanges, setHasChanges] = useState(true);
  const [saved, setSaved] = useState(false);
  const [dragover, setDragover] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    companyName: "Nomad",
    website: "https://www.nomad.com",
    locations: ["England", "Japan", "Australia"],
    employees: "1 - 50",
    industry: "Technology",
    foundedDay: "31",
    foundedMonth: "July",
    foundedYear: "2021",
    techStack: ["HTML5", "CSS 3", "Javascript"],
    description: "",
  });

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setHasChanges(true); setSaved(false); };

  const handleLogoFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
    setHasChanges(true);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleLogoFile(file);
  };

  const handleSave = () => { setSaved(true); setHasChanges(false); };

  // Calculate completion %
  const fields = [form.companyName, form.website, form.locations.length, form.employees, form.industry, form.foundedYear, form.techStack.length, form.description];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 50 }, (_, i) => String(2024 - i));

  return (
    <>
      <style>{styles}</style>
      <div className="wrapper">
        <div className="container">

          <h1 className="page-title">Settings</h1>

          {/* Tabs */}
          <div className="tabs">
            {TABS.map(t => (
              <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <>
              {/* Profile completeness */}
              <div className="profile-progress">
                <span className="progress-label">Profile completeness</span>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="progress-pct">{pct}%</span>
                <span className="progress-tip">{pct < 100 ? "Fill all fields to attract more applicants" : "Profile complete!"}</span>
              </div>

              {/* Basic Information */}
              <div className="section-block">
                <div className="section-header-bar" style={{ padding: "20px 28px 20px" }}>
                  <div className="section-label">Basic Information</div>
                  <div className="section-desc">This is company information that you can update anytime.</div>
                </div>

                {/* Company Logo */}
                <div className="two-col-row" style={{ borderTop: "1px solid #f3f4f6" }}>
                  <div className="row-label-col">
                    <div className="row-label">Company Logo</div>
                    <div className="row-hint">This image will be shown publicly as company logo.</div>
                  </div>
                  <div className="logo-section">
                    <div className="logo-preview">
                      {logoUrl ? <img src={logoUrl} alt="logo" /> : "N"}
                      <div className="logo-preview-overlay" onClick={() => fileRef.current?.click()}>Change</div>
                    </div>
                    <div
                      className={`logo-dropzone ${dragover ? "dragover" : ""}`}
                      onDragOver={e => { e.preventDefault(); setDragover(true); }}
                      onDragLeave={() => setDragover(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                    >
                      <div className="dropzone-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="2" y="2" width="24" height="24" rx="8" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4 2"/>
                          <path d="M14 10v8M10 14h8" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="dropzone-text"><strong>Click to replace</strong> or drag and drop</div>
                      <div className="dropzone-hint">SVG, PNG, JPG or GIF (max. 400 × 400px)</div>
                    </div>
                    <input ref={fileRef} type="file" className="file-input" accept="image/*"
                      onChange={e => handleLogoFile(e.target.files[0])} />
                  </div>
                </div>

                {/* Company Details */}
                <div className="two-col-row">
                  <div className="row-label-col">
                    <div className="row-label">Company Details</div>
                    <div className="row-hint">Introduce your company core info quickly to users by fill up company details.</div>
                  </div>
                  <div>
                    <div className="input-group">
                      <label className="input-group-label">Company Name</label>
                      <input className="input-field" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Acme Inc." />
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Website</label>
                      <input className="input-field" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://yourcompany.com" />
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Location</label>
                      <TagInput
                        tags={form.locations}
                        onAdd={v => set("locations", [...form.locations, v])}
                        onRemove={v => set("locations", form.locations.filter(x => x !== v))}
                        placeholder="Add country / city..."
                      />
                    </div>
                    <div className="input-group">
                      <div className="dual-select">
                        <div>
                          <label className="input-group-label">Employee</label>
                          <select className="select-field" value={form.employees} onChange={e => set("employees", e.target.value)}>
                            {EMP_RANGES.map(r => <option key={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="input-group-label">Industry</label>
                          <select className="select-field" value={form.industry} onChange={e => set("industry", e.target.value)}>
                            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Date Founded</label>
                      <div className="date-row">
                        <select className="select-field" value={form.foundedDay} onChange={e => set("foundedDay", e.target.value)}>
                          {days.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <select className="select-field" value={form.foundedMonth} onChange={e => set("foundedMonth", e.target.value)}>
                          {MONTHS.map(m => <option key={m}>{m}</option>)}
                        </select>
                        <select className="select-field" value={form.foundedYear} onChange={e => set("foundedYear", e.target.value)}>
                          {years.map(y => <option key={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-group-label">Tech Stack</label>
                      <TagInput
                        tags={form.techStack}
                        onAdd={v => set("techStack", [...form.techStack, v])}
                        onRemove={v => set("techStack", form.techStack.filter(x => x !== v))}
                        placeholder="Add technology..."
                      />
                    </div>
                  </div>
                </div>

                {/* About Company */}
                <div className="two-col-row">
                  <div className="row-label-col">
                    <div className="row-label">About Company</div>
                    <div className="row-hint">Brief description for your company. URLs are hyperlinked.</div>
                  </div>
                  <RichEditor
                    placeholder="Describe your company — mission, culture, what makes it great..."
                    maxChars={500}
                    onChange={v => set("description", v)}
                  />
                </div>
              </div>

              {/* Save bar */}
              <div className="save-bar">
                <div className="save-status">
                  <div className={`save-dot ${saved ? "saved" : hasChanges ? "changed" : ""}`} />
                  <span>{saved ? "All changes saved" : hasChanges ? "You have unsaved changes" : "No changes"}</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {hasChanges && (
                    <button className="discard-btn" onClick={() => { setHasChanges(false); setSaved(false); }}>Discard</button>
                  )}
                  <button className="save-btn" disabled={!hasChanges} onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Social Links" && (
            <div className="section-block">
              <div className="section-header-bar" style={{ padding: "20px 28px 20px" }}>
                <div className="section-label">Social Links</div>
                <div className="section-desc">Add your company's social media profiles.</div>
              </div>
              {[["LinkedIn", "https://linkedin.com/company/"], ["Twitter / X", "https://x.com/"], ["Instagram", "https://instagram.com/"], ["Facebook", "https://facebook.com/"], ["GitHub", "https://github.com/"]].map(([name, ph]) => (
                <div key={name} className="two-col-row" style={{ borderTop: "1px solid #f3f4f6" }}>
                  <div className="row-label-col"><div className="row-label">{name}</div></div>
                  <input className="input-field" placeholder={ph} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Team" && (
            <div className="section-block">
              <div style={{ padding: "60px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Team management coming soon</div>
                <div style={{ fontSize: 13, color: "#9ca3af" }}>Invite teammates and manage roles here.</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}