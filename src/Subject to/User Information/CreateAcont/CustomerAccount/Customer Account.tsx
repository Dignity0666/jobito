import { useState, useEffect } from "react";
import {
  LoaderIcon,
  CheckCircleIcon,
  LinkIcon,
  SmartphoneIcon,
  Building2Icon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CompanyRegister.module.css";
import signupImage from "../../../../assets/signup.png";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const CompanyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyPhone: "",
    taxNumber: "",
    commercialRegister: "",
    licenseNumber: "",
    companyEmail: "",
    companyAddress: "",
    nationalId: "",
    rememberMe: false,
    password: "",
    confirmPassword: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifiedStatus, setVerifiedStatus] = useState<
    null | "success" | "error"
  >(null);
  const [verifyMethod, setVerifyMethod] = useState<null | "code" | "link">(
    null,
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") setVerifiedStatus("success");
    else if (params.get("verified") === "false") setVerifiedStatus("error");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      setIsCreating(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.companyName,
          email: formData.companyEmail,
          password: formData.password,
          role: "company",
          phone: formData.companyPhone,
          address: formData.companyAddress,
          cr_document_url: formData.commercialRegister || formData.taxNumber,
          license_number: formData.licenseNumber,
          national_id: formData.nationalId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "فشل التسجيل");
      setSuccess(true);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      setIsVerifying(true);
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.companyEmail,
          code: verificationCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل التفعيل");
      setVerifiedStatus("success");
      setSuccess(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.signupwrapper}>
      <motion.div
        className={styles.signupleft}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          {verifiedStatus === "success" ? (
            <motion.div
              key="success-final"
              className={styles.centeredBox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className={styles.successIcon}>
                <CheckCircleIcon size={64} />
              </div>
              <h2 className={styles.title}>تم تفعيل الشركة!</h2>
              <p className={styles.subtitle}>
                ملف عملك جاهز الآن. ابدأ بنشر الوظائف اليوم.
              </p>
              <button
                className={styles.authbtn}
                onClick={() => navigate("/user-information")}
              >
                الذهاب لتسجيل الدخول
              </button>
            </motion.div>
          ) : success ? (
            <motion.div
              key="verify-steps"
              className={styles.centeredBox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {!verifyMethod ? (
                <>
                  <div className={styles.iconCircle}>
                    <Building2Icon size={32} />
                  </div>
                  <h2 className={styles.title}>تفعيل حساب العمل</h2>
                  <p className={styles.subtitle}>
                    تأكيد <b>{formData.companyEmail}</b>
                  </p>

                  <div className={styles.methodGrid}>
                    <button
                      className={styles.methodCard}
                      onClick={() => setVerifyMethod("link")}
                    >
                      <LinkIcon size={24} />
                      <div>
                        <strong>اضغط على الرابط</strong>
                        <span>رابط تفعيل خاص في صندوق الوارد الخاص بك</span>
                      </div>
                    </button>
                    <button
                      className={styles.methodCard}
                      onClick={() => setVerifyMethod("code")}
                    >
                      <SmartphoneIcon size={24} />
                      <div>
                        <strong>أدخل الكود</strong>
                        <span>كود تفعيل يدوي من 6 أرقام</span>
                      </div>
                    </button>
                  </div>
                  <button
                    className={styles.backBtn}
                    onClick={() => setSuccess(false)}
                  >
                    العودة للتسجيل
                  </button>
                </>
              ) : verifyMethod === "code" ? (
                <div style={{ width: "100%" }}>
                  <h2 className={styles.title}>أدخل كود العمل</h2>
                  <p className={styles.subtitle}>
                    تحقق من بريد الشركة الإلكتروني للحصول على الكود
                  </p>
                  <form onSubmit={handleVerifyCode}>
                    <input
                      type="text"
                      className={styles.otpInput}
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button
                      className={styles.authbtn}
                      type="submit"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <LoaderIcon className="loader" />
                      ) : (
                        "تفعيل العمل"
                      )}
                    </button>
                  </form>
                  <button
                    className={styles.backBtn}
                    onClick={() => setVerifyMethod(null)}
                  >
                    العودة للخيارات
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div className={styles.waitingLoader}>⏳</div>
                  <h2 className={styles.title}>جاري تفعيل العمل...</h2>
                  <p className={styles.subtitle}>
                    يرجى الضغط على رابط التفعيل في صندوق الوارد.
                  </p>
                  <button
                    className={styles.backBtn}
                    onClick={() => setVerifyMethod(null)}
                  >
                    استخدم الكود بدلاً من ذلك
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              style={{ width: "100%", translate: "0 -50px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.header}>
                <div className={styles.titleWrapper}>
                  <div className={styles.logoIcon}>
                    <Building2Icon size={32} />
                  </div>
                  <h2 className={styles.title}>تسجيل الشركة</h2>
                </div>
                <p className={styles.subtitle}>
                  أنشئ حساب عمل لتوظيف أفضل المواهب على Jobito
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                {formError && (
                  <div className={styles.errorBox}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {formError}
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>اسم الشركة</label>
                    <input
                      type="text"
                      placeholder="مثال: شركة أكيمي"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>  
                      الرقم الضريبي
                      </label>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={formData.taxNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, taxNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>هاتف الشركة</label>
                    <input
                      type="text"
                      placeholder="+20 (123) 456-7890"
                      value={formData.companyPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>عنوان الشركة</label>
                    <input
                      type="text"
                      placeholder="المدينة، الدولة"
                      value={formData.companyAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyAddress: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>البريد الإلكتروني للشركة</label>
                    <input
                      type="email"
                      placeholder="hr@acme-inc.com"
                      value={formData.companyEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyEmail: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>السجل التجاري</label>
                    <input
                      type="text"
                      placeholder="LN-8899221"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          licenseNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={styles.fullWidthRow}>
                    <div className={styles.inputGroup}>
                      <label>كلمة المرور</label>
                      <div className={styles.relativeInput}>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#94a3b8",
                            padding: 0,
                          }}
                        >
                          {showPassword ? (
                            <EyeOffIcon size={18} />
                          ) : (
                            <EyeIcon size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className={styles.inputGroup}>
                      <label>تأكيد كلمة المرور</label>
                      <div className={styles.relativeInput}>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{
                            position: "absolute",
                            right: "14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#94a3b8",
                            padding: 0,
                          }}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon size={18} />
                          ) : (
                            <EyeIcon size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.fullWidthRow}
                    style={{ alignItems: "flex-end" }}
                  >
                    <div className={styles.inputGroup}>
                      <label>الرقم القومي للمسؤول</label>
                      <input
                        type="text"
                        placeholder="مثال: 29901011234567"
                        value={formData.nationalId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nationalId: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  className={styles.authbtn}
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <LoaderIcon className="loader" />
                  ) : (
                    "إنشاء ملف حساب العمل"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className={styles.signuplight}>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={signupImage}
          alt="Business Signup Illustration"
        />
      </div>
    </div>
  );
};
