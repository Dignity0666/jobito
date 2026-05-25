import React, { useState, useEffect } from "react";
import { useTranslation } from "../../../context/translation-context";
import { useJobitoAuth } from "../../../context/LinkContxt";
import { useToast } from "../../../context/ToastContext";
import styles from "./ReportJobModal.module.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface ReportJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | string;
  jobTitle: string;
  postOwnerId: string;
  postOwnerName: string;
}

export const ReportJobModal: React.FC<ReportJobModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  postOwnerId,
  postOwnerName,
}) => {
  const { t } = useTranslation();
  const { apiFetch, user } = useJobitoAuth();
  const { showToast } = useToast();

  const [reasonText, setReasonText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonText.trim()) {
      showToast(t("يرجى كتابة سبب الإبلاغ"), "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiFetch(`${API_BASE_URL}/content/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterUserId: user?.userId || user?.id,
          postOwnerId: postOwnerId,
          postOwnerName: postOwnerName,
          contentType: "job",
          contentId: String(jobId),
          reason: "other",
          customReason: reasonText,
          contentText: jobTitle
        }),
      });

      if (res.ok) {
        showToast(t("تم إرسال بلاغك بنجاح. سنقوم بمراجعته."), "success");
        setReasonText("");
        onClose();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || t("فشل إرسال البلاغ"), "error");
      }
    } catch (err) {
      showToast(t("حدث خطأ في الاتصال"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2>{t("إبلاغ عن")} {jobTitle}</h2>
          <p>{t("يرجى توضيح سبب الإبلاغ لمساعدتنا في تحسين جودة المحتوى.")}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.reportForm}>
          <div className={styles.formGroup}>
            <label>{t("تفاصيل الشكوى")}</label>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder={t("اكتب تفاصيل الشكوى هنا...")}
              required
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {t("إلغاء")}
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? t("جاري الإرسال...") : t("إرسال البلاغ")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
