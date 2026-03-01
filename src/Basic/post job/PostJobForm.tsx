import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PostJob.module.css";

/* ─── Types ──────────────────────────────────── */
type Step = 1 | 2 | 3;

interface Benefit {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

/* ─── Icons ──────────────────────────────────── */
const BoldIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>;
const ItalicIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
const ULIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const OLIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>;
const LinkIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const PlusIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const XIcon      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ─── Step indicator ─────────────────────────── */
const STEPS = [
  { n: 1, label: "Job Information" },
  { n: 2, label: "Job Description" },
  { n: 3, label: "Perks & Benefit" },
];

function StepBar({ current }: { current: Step }) {
  return (
    <div className={styles.stepBar}>
      {STEPS.map((s, i) => (
        <div key={s.n} className={styles.stepItem}>
          <div className={`${styles.stepCircle} ${current >= s.n ? styles.stepDone : ""} ${current === s.n ? styles.stepActive : ""}`}>
            {current > s.n
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : s.n}
          </div>
          <div className={styles.stepText}>
            <span className={styles.stepNum}>Step {s.n}/3</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${current > s.n ? styles.stepLineDone : ""}`} />}
        </div>
      ))}
    </div>
  );
}

/* ─── Rich text toolbar ──────────────────────── */
function Toolbar() {
  return (
    <div className={styles.toolbar}>
      {[BoldIcon, ItalicIcon, ULIcon, OLIcon, LinkIcon].map((Icon, i) => (
        <button key={i} type="button" className={styles.toolbarBtn}><Icon /></button>
      ))}
    </div>
  );
}

/* ─── Rich textarea field ────────────────────── */
function RichField({ label, sub, placeholder, max = 500 }: {
  label: string; sub: string; placeholder: string; max?: number;
}) {
  const [val, setVal] = useState("");
  return (
    <div className={styles.richField}>
      <div className={styles.rowLabel}>
        <strong>{label}</strong>
        <span>{sub}</span>
      </div>
      <div className={styles.richBox}>
        <textarea
          placeholder={placeholder}
          maxLength={max}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          rows={4}
        />
        <div className={styles.richFooter}>
          <Toolbar />
          <span className={styles.charCount}>{val.length} / {max}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab variants ───────────────────────────── */
const pageVariants = {
  hidden: { opacity: 0, x: 32 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, x: -32, transition: { duration: 0.2 } },
};

/* ════════════════════════════════════════════════
   STEP 1 — Job Information
════════════════════════════════════════════════ */
const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"];
const CATEGORIES = ["UI/UX Design", "Software Engineering", "Marketing", "Data Science", "Product Management"];
const DEFAULT_SKILLS = ["Graphic Design", "Communication", "Illustrator"];

function Step1({ onNext }: { onNext: () => void }) {
  const [empTypes, setEmpTypes]   = useState<string[]>([]);
  const [salary, setSalary]       = useState([3000, 22000]);
  const [category, setCategory]   = useState("");
  const [skills, setSkills]       = useState<string[]>(DEFAULT_SKILLS);
  const [skillInput, setSkillInput] = useState("");

  const toggleEmp = (t: string) =>
    setEmpTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills((p) => [...p, skillInput.trim()]);
      setSkillInput("");
    }
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <h2>Basic Information</h2>
        <p>This information will be displayed publicly</p>
      </div>

      {/* Job Title */}
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Job Title</strong>
          <span>Job titles must be describe one position</span>
        </div>
        <div className={styles.rowContent}>
          <input type="text" placeholder="e.g. Software Engineer" className={styles.textInput} />
          <small className={styles.hint}>At least 80 characters</small>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Type of Employment */}
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Type of Employment</strong>
          <span>You can select multiple type of employment</span>
        </div>
        <div className={styles.rowContent}>
          {EMPLOYMENT_TYPES.map((t) => (
            <label key={t} className={styles.checkRow}>
              <input type="checkbox" checked={empTypes.includes(t)}
                onChange={() => toggleEmp(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.divider} />

      {/* Salary */}
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Salary</strong>
          <span>Please specify the estimated salary range for the role. You can leave this blank</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.salaryRow}>
            <div className={styles.salaryBox}><span>$</span><span>{salary[0].toLocaleString()}</span></div>
            <span className={styles.salaryTo}>to</span>
            <div className={styles.salaryBox}><span>$</span><span>{salary[1].toLocaleString()}</span></div>
          </div>
          <input type="range" min={1000} max={50000} step={500}
            value={salary[1]}
            onChange={(e) => setSalary([salary[0], +e.target.value])}
            className={styles.rangeSlider} />
        </div>
      </div>
      <div className={styles.divider} />

      {/* Categories */}
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Categories</strong>
          <span>You can select multiple job categories</span>
        </div>
        <div className={styles.rowContent}>
          <label className={styles.fieldLabel}>Select Job Categories</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.selectInput}>
            <option value="">Select Job Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.divider} />

      {/* Required Skills */}
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Required Skills</strong>
          <span>Add required skills for the job</span>
        </div>
        <div className={styles.rowContent}>
          <button type="button" className={styles.addSkillBtn}
            onClick={() => setSkillInput(" ")}
          >
            <PlusIcon /> Add Skills
          </button>
          <div className={styles.skillsRow}>
            {skills.map((s) => (
              <span key={s} className={styles.skillTag}>
                {s}
                <button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))}><XIcon /></button>
              </span>
            ))}
          </div>
          {skillInput !== undefined && (
            <div className={styles.skillInputRow}>
              <input
                type="text"
                placeholder="Type skill..."
                value={skillInput.trim()}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                className={styles.textInput}
              />
              <button type="button" className={styles.primaryBtn} onClick={addSkill}>Add</button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.nextRow}>
        <motion.button className={styles.nextBtn} onClick={onNext}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}>
          Next Step →
        </motion.button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   STEP 2 — Job Description
════════════════════════════════════════════════ */
function Step2({ onNext }: { onNext: () => void }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <h2>Details</h2>
        <p>Add the description of the job, responsibilities, who you are, and nice-to-haves.</p>
      </div>

      <RichField label="Job Descriptions"   sub="Job titles must be describe one position"           placeholder="Enter job description"     max={500} />
      <div className={styles.divider} />
      <RichField label="Responsibilities"   sub="Outline the core responsibilities of the position"  placeholder="Enter job responsibilities" max={500} />
      <div className={styles.divider} />
      <RichField label="Who You Are"        sub="Add your preferred candidates qualifications"        placeholder="Enter qualifications"       max={500} />
      <div className={styles.divider} />
      <RichField label="Nice-To-Haves"      sub="Add nice-to-have skills and qualifications for the role to encourage a more diverse set of candidates to apply" placeholder="Enter nice-to-haves" max={500} />

      <div className={styles.nextRow}>
        <motion.button className={styles.nextBtn} onClick={onNext}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}>
          Next Step →
        </motion.button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   STEP 3 — Perks & Benefits
════════════════════════════════════════════════ */
const DEFAULT_BENEFITS: Benefit[] = [
  { id: "1", icon: "🏥", title: "Full Healthcare",    desc: "We believe in thriving communities and that starts with our team being happy and healthy." },
  { id: "2", icon: "🏖️", title: "Unlimited Vacation", desc: "We believe you should have a flexible schedule that makes space for family, wellness, and fun." },
  { id: "3", icon: "📚", title: "Skill Development",  desc: "We believe in always learning and leveling up our skills. Whether it's a conference or online course." },
];

function Step3({ onDone }: { onDone: () => void }) {
  const [benefits, setBenefits] = useState<Benefit[]>(DEFAULT_BENEFITS);

  const removeBenefit = (id: string) =>
    setBenefits((p) => p.filter((b) => b.id !== id));

  const addBenefit = () =>
    setBenefits((p) => [...p, {
      id: Date.now().toString(),
      icon: "⭐",
      title: "New Benefit",
      desc: "Describe this benefit for your employees.",
    }]);

  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <h2>Basic Information</h2>
        <p>List out your top perks and benefits</p>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>Perks and Benefits</strong>
          <span>Encourage more people to apply by sharing the attractive rewards and benefits you offer your employees</span>
        </div>
        <div className={styles.rowContent}>
          <button type="button" className={styles.addSkillBtn} onClick={addBenefit}>
            <PlusIcon /> Add Benefit
          </button>
          <div className={styles.benefitsGrid}>
            <AnimatePresence>
              {benefits.map((b) => (
                <motion.div key={b.id} className={styles.benefitCard}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  layout>
                  <button type="button" className={styles.benefitRemove}
                    onClick={() => removeBenefit(b.id)}><XIcon /></button>
                  <div className={styles.benefitIcon}>{b.icon}</div>
                  <strong>{b.title}</strong>
                  <p>{b.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className={styles.nextRow}>
        <motion.button className={styles.nextBtn} onClick={onDone}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}>
          Do a Review →
        </motion.button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════ */
export default function PostJob() {
  const [step, setStep] = useState<Step>(1);

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Post a Job
      </button>

      <StepBar current={step} />

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={pageVariants} initial="hidden" animate="show" exit="exit">
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} />}
          {step === 3 && <Step3 onDone={() => alert("Job Posted! 🎉")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}