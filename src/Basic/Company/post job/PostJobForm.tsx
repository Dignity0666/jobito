import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PostJob.module.css";
import { useJobitoAuth } from "../../../context/AuthContext";

type Step = 1 | 2 | 3;

interface Benefit {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

interface JobFormData {
  title: string;
  jobTypes: string[];
  salary: number;
  categoryId?: number;
  categoryName?: string;
  address: string;
  description: string[];
  responsibilities: string[];
  whoYouAre: string[];
  niceToHaves: string[];
  skills: string[];
  benefits: Benefit[];
  slotsAvailable: number;
  expiresAt: string;
  classification: "تقني" | "غير تقني" | "صنيعي" | "";
}

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const XIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const STEPS = [
  { n: 1, label: "معلومات الوظيفة" },
  { n: 2, label: "وصف الوظيفة" },
  { n: 3, label: "المزايا والفوائد" },
];

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function StepBar({
  current,
  onStepClick,
}: {
  current: Step;
  onStepClick: (s: Step) => void;
}) {
  return (
    <div className={styles.stepBar}>
      {STEPS.map((s, i) => (
        <div key={s.n} className={styles.stepItem}>
          <div
            className={`${styles.stepCircle} ${current >= s.n ? styles.stepDone : ""} ${current === s.n ? styles.stepActive : ""}`}
            onClick={() => current > s.n && onStepClick(s.n as Step)}
          >
            {current > s.n ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : s.n === 1 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            ) : s.n === 2 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            )}
          </div>
          <div className={styles.stepText}>
            <span className={styles.stepNum}>الخطوة {s.n}/3</span>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`${styles.stepLine} ${current > s.n ? styles.stepLineDone : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// No static fallback - categories must come from the API to ensure correct IDs

const JOB_TYPE_MAP: Record<string, string> = {
  "دوام كامل": "full-time",
  "دوام جزئي": "part-time",
  "عمل حر (Freelance)": "freelance",
  "تدريب (Internship)": "internship",
  "عمل لمرة واحدة": "one-time",
  "عن بعد (Remote)": "remote",
};

const EMPLOYMENT_TYPES = Object.keys(JOB_TYPE_MAP);

function Step1({
  data,
  updateData,
  onNext,
}: {
  data: JobFormData;
  updateData: (d: Partial<JobFormData>) => void;
  onNext: () => void;
}) {
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);

  const toggleEmp = (t: string) => {
    if (data.jobTypes.includes(t)) {
      updateData({ jobTypes: data.jobTypes.filter((x) => x !== t) });
    } else {
      updateData({ jobTypes: [...data.jobTypes, t] });
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      updateData({ skills: [...data.skills, skillInput.trim()] });
      setSkillInput("");
      setShowSkillInput(false); // Hide input after adding
    }
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <h2>المعلومات الأساسية</h2>
        <p>هذه المعلومات ستظهر للعامة</p>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>عنوان الوظيفة</strong>
          <span>يجب أن يصف العنوان وظيفة واحدة فقط</span>
        </div>
        <div className={styles.rowContent}>
          <input
            type="text"
            placeholder="مثال: مهندس برمجيات"
            className={styles.textInput}
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
          />
          <div className={styles.hint}>على الأقل 80 حرفاً</div>
        </div>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>نوع التوظيف</strong>
          <span>يمكنك اختيار أكثر من نوع</span>
        </div>
        <div className={styles.rowContent}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <label key={t} className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={data.jobTypes.includes(t)}
                  onChange={() => toggleEmp(t)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>الراتب (بالجنيه)</strong>
          <span>يرجى تحديد الراتب المتوقع.</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.salaryRow}>
            <div className={styles.salaryBox} style={{ width: "200px" }}>
              <span>£</span>
              <input
                type="number"
                value={data.salary}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  updateData({ salary: val });
                }}
                className={styles.salaryInputInner}
                placeholder="مثال: 10000"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>العدد المطلوب</strong>
          <span>حدد عدد المقاعد المتاحة لهذا المتصب</span>
        </div>
        <div className={styles.rowContent}>
          <input
            type="number"
            min="1"
            className={styles.textInput}
            value={data.slotsAvailable}
            onChange={(e) =>
              updateData({ slotsAvailable: parseInt(e.target.value) || 1 })
            }
          />
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>التصنيف</strong>
          <span>حدد تصنيف الوظيفة</span>
        </div>
        <div className={styles.rowContent}>
          <div style={{ display: "flex", gap: "20px" }}>
            {["تقني", "غير تقني", "صنيعي"].map((cls) => (
              <label key={cls} className={styles.checkRow}>
                <input
                  type="radio"
                  name="classification"
                  checked={data.classification === cls}
                  onChange={() => updateData({ classification: cls as any })}
                />
                {cls}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>البحث في الأقسام</strong>
          <span>يمكنك اختيار فئة الوظيفة المناسبة</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.categorySelectionBox}>
            <label className={styles.categorySelectionLabel}>اختر فئة الوظيفة</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="مثال: هندسة، تسويق، تصميم..."
              value={data.categoryName || ""}
              onChange={(e) => updateData({ categoryName: e.target.value })}
              required
            />
          </div>
        </div>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>المهارات المطلوبة</strong>
          <span>أضف المهارات اللازمة للوظيفة</span>
        </div>
        <div className={styles.rowContent}>
          <div className={styles.skillInputRow}>
            {!showSkillInput ? (
              <button
                type="button"
                className={styles.addSkillBtn}
                onClick={() => setShowSkillInput(true)}
              >
                <PlusIcon /> أضف مهارات
              </button>
            ) : (
              <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                <input
                  type="text"
                  placeholder="اكتب المهارة واضغط Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className={styles.textInput}
                  autoFocus
                />
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={addSkill}
                >
                  إضافة
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  style={{ backgroundColor: "#e5e7eb", color: "#333" }}
                  onClick={() => setShowSkillInput(false)}
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
          <div className={styles.skillsRow}>
            {data.skills.map((s) => (
              <span key={s} className={styles.skillTag}>
                {s}
                <button
                  type="button"
                  onClick={() =>
                    updateData({ skills: data.skills.filter((x) => x !== s) })
                  }
                >
                  <XIcon />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.divider} />

      <div className={styles.fieldRow}>
        <div className={styles.rowLabel}>
          <strong>تاريخ انتهاء التقديم</strong>
          <span>متى سيغلق باب التقديم؟</span>
        </div>
        <div className={styles.rowContent}>
          <input
            type="date"
            className={styles.textInput}
            value={data.expiresAt}
            onChange={(e) => updateData({ expiresAt: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.nextRow}>
        <motion.button
          className={styles.nextBtn}
          onClick={onNext}
          disabled={!data.title}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}
        >
          الخطوة التالية 
        </motion.button>
      </div>
    </div>
  );
}

function CheckmarkList({
  items,
  onChange,
  placeholder = "مثال: المشاركة المجتمعية لضمان...",
}: {
  items: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const addItem = () => onChange([...items, ""]);
  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.length > 0 ? newItems : [""]);
  };
  const updateItem = (index: number, val: string) => {
    const newItems = [...items];
    newItems[index] = val;
    onChange(newItems);
  };

  return (
    <div className={styles.respList}>
      {items.map((item, index) => (
        <div key={index} className={styles.respItemWrap}>
          <div className={styles.respCheck}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#56CDAD" strokeWidth="2" />
              <path
                d="M8 12L11 15L16 9"
                stroke="#56CDAD"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <input
            type="text"
            className={styles.respInput}
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={placeholder}
          />
          {items.length > 1 && (
            <button
              type="button"
              className={styles.respRemove}
              onClick={() => removeItem(index)}
            >
              <XIcon />
            </button>
          )}
        </div>
      ))}
      <button type="button" className={styles.respAddBtn} onClick={addItem}>
        <PlusIcon /> إضافة نقطة أخرى
      </button>
    </div>
  );
}

function Step2({
  data,
  updateData,
  onNext,
  onPrev,
}: {
  data: JobFormData;
  updateData: (d: Partial<JobFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const listFields = [
    "description",
    "responsibilities",
    "whoYouAre",
    "niceToHaves",
  ] as const;
  const filledCount = listFields.filter((f) =>
    data[f].some((r) => r.trim()),
  ).length;

  const totalFields = 4;

  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerWithBack}>
          <h2>التفاصيل</h2>
        </div>
        <p>
          أضف وصف الوظيفة، المسؤوليات، المؤهلات المطلوبة، والمميزات الإضافية.
        </p>
      </div>

      <div className={styles.completionRow}>
        {listFields.map((fid) => {
          const isFilled = data[fid].some((r) => r.trim());
          return (
            <div
              key={fid}
              className={`${styles.completionDot} ${isFilled ? styles.filled : ""}`}
            />
          );
        })}
        <span className={styles.completionLabel}>
          تم ملء <strong>{filledCount}</strong> من أصل {totalFields} أقسام
        </span>
      </div>

      <div className={styles.divider} />

      <div className={styles.fieldsGrid}>
        <div className={styles.richFieldStep2}>
          <div className={styles.rowLabel}>
            <strong>الوصف</strong>
            <span>قدم ملخصاً للدور الوظيفي</span>
          </div>
          <CheckmarkList
            items={data.description}
            placeholder="مثال: نحن نبحث عن مصمم مبدع..."
            onChange={(val) => updateData({ description: val })}
          />
        </div>

        <div className={styles.richFieldStep2}>
          <div className={styles.rowLabel}>
            <strong>المسؤوليات</strong>
            <span>حدد المسؤوليات الأساسية لهذا المنصب</span>
          </div>
          <CheckmarkList
            items={data.responsibilities}
            onChange={(val) => updateData({ responsibilities: val })}
          />
        </div>

        <div className={styles.richFieldStep2}>
          <div className={styles.rowLabel}>
            <strong>المؤهلات المطلوبة</strong>
            <span>أضف المؤهلات التي تفضلها في المرشحين</span>
          </div>
          <CheckmarkList
            items={data.whoYouAre}
            placeholder="مثال: أنت مسوق نمو وتعرف كيف..."
            onChange={(val) => updateData({ whoYouAre: val })}
          />
        </div>

        <div className={styles.richFieldStep2}>
          <div className={styles.rowLabel}>
            <strong>مزايا إضافية (Nice-To-Haves)</strong>
            <span>شجع مجموعة متنوعة من المرشحين على التقديم</span>
          </div>
          <CheckmarkList
            items={data.niceToHaves}
            placeholder="مثال: طلاقة في اللغة الإنجليزية، إدارة المشاريع..."
            onChange={(val) => updateData({ niceToHaves: val })}
          />
        </div>
      </div>

      <div className={styles.footerNav}>
        <button className={styles.backBtnInline} onClick={onPrev}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 11L5 7l4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          السابق
        </button>
        <span className={styles.stepIndicator}>الخطوة 2 من 3</span>
        <motion.button
          className={styles.nextBtn}
          onClick={onNext}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}
        >
          الخطوة التالية 
        </motion.button>
      </div>
    </div>
  );
}

const DEFAULT_BENEFITS: Benefit[] = [
  {
    id: "1",
    icon: "🏥",
    title: "رعاية صحية كاملة",
    desc: "نحن نؤمن بازدهار المجتمعات وهذا يبدأ بكون فريقنا سعيداً وبصحة جيدة.",
  },
  {
    id: "2",
    icon: "🏖️",
    title: "إجازات غير محدودة",
    desc: "نحن نؤمن بأنه يجب أن يكون لديك جدول مرن يفسح المجال للعائلة والرفاهية والمرح.",
  },
  {
    id: "3",
    icon: "🧠",
    title: "تطوير المهارات",
    desc: "نحن نؤمن دائماً بالتعلم ورفع مستوى مهاراتنا، سواء كان ذلك من خلال مؤتمر أو دورة تدريبية.",
  },
];

function Step3({
  data,
  updateData,
  onDone,
  isSubmitting,
}: {
  data: JobFormData;
  updateData: (d: Partial<JobFormData>) => void;
  onDone: () => void;
  isSubmitting: boolean;
}) {
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBTitle, setNewBTitle] = useState("");
  const [newBDesc, setNewBDesc] = useState("");

  const confirmAddBenefit = () => {
    if (!newBTitle) return;
    const newBenefit: Benefit = {
      id: Date.now().toString(),
      icon: "⭐",
      title: newBTitle,
      desc: newBDesc,
    };
    updateData({ benefits: [...data.benefits, newBenefit] });
    setNewBTitle("");
    setNewBDesc("");
    setShowAddForm(false);
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.sectionHeader}>
        <h2>المزايا والفوائد</h2>
        <p>هذه الوظيفة تأتي مع العديد من المزايا والفوائد</p>
      </div>
      <div className={styles.divider} style={{ marginBottom: "24px" }} />

      <div
        className={styles.fieldRow}
        style={{ gridTemplateColumns: "1fr", padding: 0 }}
      >
        <div className={styles.benefitsGrid}>
          <AnimatePresence>
            {data.benefits.map((b) => (
              <motion.div
                key={b.id}
                className={styles.benefitCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <strong>{b.title}</strong>
                <p>{b.desc}</p>
                <button
                  className={styles.benefitRemove}
                  onClick={() =>
                    updateData({
                      benefits: data.benefits.filter((x) => x.id !== b.id),
                    })
                  }
                >
                  <XIcon />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {!showAddForm ? (
            <button
              className={styles.addBenefitCard}
              onClick={() => setShowAddForm(true)}
            >
              <PlusIcon /> إضافة ميزة
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.benefitCard}
              style={{
                border: "2px dashed #4640de",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="عنوان الميزة"
                value={newBTitle}
                onChange={(e) => setNewBTitle(e.target.value)}
                className={styles.textInput}
                style={{ padding: "6px" }}
              />
              <textarea
                placeholder="وصف الميزة"
                value={newBDesc}
                onChange={(e) => setNewBDesc(e.target.value)}
                className={styles.textArea}
                style={{ padding: "6px", fontSize: "13px" }}
                rows={3}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={confirmAddBenefit}
                  className={styles.primaryBtn}
                  style={{ flex: 1, padding: "6px" }}
                >
                  إضافة
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={styles.primaryBtn}
                  style={{
                    flex: 1,
                    padding: "6px",
                    backgroundColor: "#e5e7eb",
                    color: "#333",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className={styles.nextRow}>
        <motion.button
          className={styles.nextBtn}
          onClick={onDone}
          disabled={isSubmitting}
          whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(70,64,222,0.35)" }}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? "جاري الحفظ..." : (location.state as any)?.editJob ? "تحديث الوظيفة" : "انشر الوظيفة الآن 🎉"}
        </motion.button>
      </div>
    </div>
  );
}

export default function PostJob() {
  const location = useLocation() as { state: { editJob?: any } | null };
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { role, isAuthenticated, apiFetch } = useJobitoAuth();
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    jobTypes: [],
    salary: 10000,
    address: "Remote",
    description: [""],
    responsibilities: [""],
    whoYouAre: [""],
    niceToHaves: [""],
    skills: ["التصميم الجرافيكي", "التواصل", "اللغة الإنجليزية"],
    benefits: DEFAULT_BENEFITS,
    slotsAvailable: 1,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    categoryName: "",
    classification: "",
  });


  // Categories are now handled via text input and backend resolution
  useEffect(() => {
    if (location.state?.editJob) {
      try {
        const job = location.state.editJob;

        // Parsing logic for combined description
        const sections: Record<string, string[]> = {
          "وصف الوظيفة": [],
          "Job Description": [],
          "المؤهلات المطلوبة": [],
          "Required": [],
          "مزايا إضافية": [],
          "Nice-To-Haves": [],
          "المسؤوليات": [],
          "Responsibilities": [],
          "المهارات": [],
          "Skills": [],
          "التصنيف": [],
        };

        let currentSection = "";
        const lines = (job.description || "").split("\n");

        lines.forEach((line: string) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return;

          const headerMatch = trimmedLine.match(/^\*\*(.*?):\*\*$/);
          if (headerMatch) {
            currentSection = headerMatch[1].trim();
          } else {
            const content = trimmedLine.replace(/^•\s*/, "").trim();
            if (currentSection === "المهارات" || currentSection === "Skills") {
              const skills = content.split(",").map((s) => s.trim()).filter(Boolean);
              sections["Skills"] = [...new Set([...(sections["Skills"] || []), ...skills])];
            } else if (sections[currentSection]) {
              sections[currentSection].push(content);
            }
          }
        });

        const safeDate = (dateStr?: string) => {
          if (!dateStr) return "";
          try {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
          } catch {
            return "";
          }
        };

        setFormData({
          title: job.title || "",
          jobTypes: job.jobType
            ? [
                Object.keys(JOB_TYPE_MAP).find(
                  (k) => JOB_TYPE_MAP[k] === job.jobType.toLowerCase()
                ) || job.jobType,
              ]
            : [],
          salary: job.salaryMin || job.salary || 0,
          address: job.address || "Remote",
          description: (sections["وصف الوظيفة"].length ? sections["وصف الوظيفة"] : sections["Job Description"]).length
            ? (sections["وصف الوظيفة"].length ? sections["وصف الوظيفة"] : sections["Job Description"])
            : [""],
          responsibilities: (sections["المسؤوليات"].length ? sections["المسؤوليات"] : sections["Responsibilities"]).length
            ? (sections["المسؤوليات"].length ? sections["المسؤوليات"] : sections["Responsibilities"])
            : [""],
          whoYouAre: (sections["المؤهلات المطلوبة"].length ? sections["المؤهلات المطلوبة"] : sections["Required"]).length 
            ? (sections["المؤهلات المطلوبة"].length ? sections["المؤهلات المطلوبة"] : sections["Required"]) 
            : [""],
          niceToHaves: (sections["مزايا إضافية"].length ? sections["مزايا إضافية"] : sections["Nice-To-Haves"]).length
            ? (sections["مزايا إضافية"].length ? sections["مزايا إضافية"] : sections["Nice-To-Haves"])
            : [""],
          skills: sections["Skills"]?.length ? sections["Skills"] : [],
          benefits: job.benefits || job.company?.benefits || DEFAULT_BENEFITS,
          slotsAvailable: job.slotsAvailable || 1,
          categoryId: job.categoryId,
          categoryName: job.category?.name || "",
          expiresAt: safeDate(job.expiresAt),
          classification: (sections["التصنيف"]?.[0] || "") as any,
        });
      } catch (err) {
        console.error("Error hydrating form for edit mode:", err);
      }
    }
  }, [location.state]);

  const updateData = (newData: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  /** Get a valid auth token or throw a descriptive error */
  const getAuthToken = useCallback((): string => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error(
        "أنت غير مسجل دخول. يرجى تسجيل الدخول أولاً لنشر وظيفة.",
      );
    }
    // Role check — ensure user is a company
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "company") {
        throw new Error(
          "يمكن لحسابات الشركات فقط نشر الوظائف. أنت مسجل دخول كحساب '" +
            payload.role +
            "'.",
        );
      }
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        (e.message.includes("company") || e.message.includes("not logged"))
      ) {
        throw e;
      }
      throw new Error("رمز التحقق غير صالح. يرجى تسجيل الدخول مرة أخرى.");
    }
    return token;
  }, []);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      getAuthToken();

      const combinedDescription = `**وصف الوظيفة:**
${formData.description
  .filter((r) => r.trim())
  .map((r) => `• ${r}`)
  .join("\n")}

**المؤهلات المطلوبة:**
${formData.whoYouAre
  .filter((r) => r.trim())
  .map((r) => `• ${r}`)
  .join("\n")}

**مزايا إضافية:**
${formData.niceToHaves
  .filter((r) => r.trim())
  .map((r) => `• ${r}`)
  .join("\n")}

**المسؤوليات:**
${formData.responsibilities
  .filter((r) => r.trim())
  .map((r) => `• ${r}`)
  .join("\n")}

**المهارات:**
${formData.skills.join(", ")}

**التصنيف:**
${formData.classification}`;

      // Map frontend types to backend enums
      const frontendType = formData.jobTypes[0] || "دوام جزئي";
      const backendJobType = JOB_TYPE_MAP[frontendType] || "part-time";

      const payload = {
        title: formData.title,
        description: combinedDescription,
        salaryMin: formData.salary,
        salaryMax: formData.salary,
        salary: formData.salary, // fallback for legacy
        address: formData.address,
        jobType: backendJobType,
        classification: formData.classification,
        slotsAvailable: formData.slotsAvailable,
        categoryId: formData.categoryId,
        categoryName: formData.categoryName,
        expiresAt: formData.expiresAt || undefined,
        benefits: formData.benefits,
      };

      const isEdit = !!location.state?.editJob;
      const jobId = location.state?.editJob?.jobId;

      const response = await apiFetch(
        `${API_BASE_URL}/jobs${isEdit ? `/${jobId}` : ""}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        alert(
          isEdit ? "تم تحديث الوظيفة بنجاح!" : "تم نشر الوظيفة بنجاح!",
        );
        navigate("/JobListing");
      } else {
        const err = await response.json();
        if (response.status === 401) {
          throw new Error("انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.");
        } else if (response.status === 403) {
          throw new Error(
            "ليس لديك إذن بنشر الوظائف. يمكن لحسابات الشركات فقط النشر.",
          );
        }
        throw new Error(err.message || "فشل في نشر الوظيفة");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      alert("Error: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guard: Show message if not authenticated or not a company
  if (!isAuthenticated) {
    return (
      <div className={styles.page} dir="rtl">
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{ fontSize: "24px", marginBottom: "12px", color: "#1a1a2e" }}
          >
            🔒 تسجيل الدخول مطلوب
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            يجب عليك تسجيل الدخول لتتمكن من نشر وظيفة.
          </p>
          <a
            href="/login"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              backgroundColor: "#4640de",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            تنسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  if (role !== "company") {
    return (
      <div className={styles.page} dir="rtl">
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{ fontSize: "24px", marginBottom: "12px", color: "#1a1a2e" }}
          >
            🏢 حساب شركة مطلوب
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>
            يمكن لحسابات الشركات فقط نشر الوظائف. أنت مسجل دخول حالياً كحساب <strong>{role}</strong>.
          </p>
          <p style={{ color: "#999", fontSize: "14px" }}>
            يرجى تسجيل حساب شركة أو التبديل إليه لنشر الوظائف.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} dir="rtl">
      <StepBar current={step} onStepClick={(s) => setStep(s)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <Step1
              data={formData}
              updateData={updateData}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              data={formData}
              updateData={updateData}
              onNext={() => setStep(3)}
              onPrev={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              data={formData}
              updateData={updateData}
              onDone={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
