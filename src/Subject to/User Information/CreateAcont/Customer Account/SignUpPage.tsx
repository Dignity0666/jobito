import { useState, useEffect } from "react";
import Style from "./SignUpPage.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  LinkIcon,
  LoaderIcon,
  MailIcon,
  SmartphoneIcon,
  UserPlusIcon,
  EyeIcon,
  EyeOffIcon,
  PhoneIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "../../../../context/translation-context";
import { useToast } from "../../../../context/ToastContext";
import { useJobitoAuth } from "../../../../context/LinkContxt";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifiedStatus, setVerifiedStatus] = useState<
    null | "success" | "error"
  >(null);
  const [verifyMethod, setVerifyMethod] = useState<null | "code" | "link" | "phone">(
    null,
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [deletionStatus, setDeletionStatus] = useState<{ scheduled: boolean; daysLeft?: number } | null>(null);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const { login: contextLogin } = useJobitoAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") setVerifiedStatus("success");
    else if (params.get("verified") === "false") setVerifiedStatus("error");
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google signup failed");

        setLoginToken(data.access_token);
        try {
          const statusRes = await fetch(`${API_BASE_URL}/users/me/deletion-status`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.scheduled) {
              setDeletionStatus(statusData);
              setShowDeletionModal(true);
              return; // Wait for user decision, do not login yet
            }
          }
        } catch (e) {
          console.error("Failed to fetch deletion status", e);
        }

        localStorage.setItem("token", data.access_token);
        contextLogin?.(data.access_token);
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/");
      } catch (err: unknown) {
        showToast(err instanceof Error ? t(err.message) : t("حدث خطأ ما", "Something went wrong"), "error");
      }
    },
    onError: () => showToast(t("فشل تسجيل الدخول بجوجل", "Google login failed"), "error"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SignUpPage: handleSubmit called", formData);
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError(t("كلمات المرور غير متطابقة", "Passwords do not match"));
      return;
    }

    try {
      setIsSigningUp(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "student",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccess(true);
      setVerifyMethod("code");
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      setIsVerifying(true);
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      localStorage.setItem("isNewUser", "true");
      setVerifiedStatus("success");
      setSuccess(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendPhoneOtp = async () => {
    if (!formData.phone) {
      showToast(t("الرجاء إدخال رقم الهاتف أولاً", "Please enter phone number first"), "error");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await fetch(`${API_BASE_URL}/auth/send-phone-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ phone: formData.phone, email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("فشل إرسال الرمز", "Failed to send code"));
      showToast(t("تم إرسال رمز التحقق إلى هاتفك!", "Verification code sent to your phone!"), "success");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      setIsVerifying(true);
      const res = await fetch(`${API_BASE_URL}/auth/verify-phone-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420"
        },
        body: JSON.stringify({ phone: formData.phone, email: formData.email, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      localStorage.setItem("isNewUser", "true");
      setVerifiedStatus("success");
      setSuccess(false);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={Style.signupwrapper}>
      <AnimatePresence mode="wait">
        {verifiedStatus === "success" ? (
          <motion.div
            key="success-final"
            className={Style.centeredBox}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={Style.successIcon}>
              <CheckCircleIcon size={64} />
            </div>
            <h2 className={Style.title}>{t("تم تفعيل الحساب!", "Account activated!")}</h2>
            <p className={Style.subtitle}>
              {t("أهلاً بك في Jobito. ملفك الشخصي مستخدم جاهز الآن.", "Welcome to Jobito. Your profile is ready.")}
            </p>
            <button
              className={Style.authbtn}
              onClick={() => navigate("/user-information", { state: { showLogin: true } })}
            >
              {t("الذهاب لتسجيل الدخول", "Go to Login")}
            </button>
          </motion.div>
        ) : success ? (
          <motion.div
            key="verify-steps"
            className={Style.centeredBox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!verifyMethod ? (
              <>
                <div className={Style.iconCircle}>
                  <MailIcon size={32} />
                </div>
                <h2 className={Style.title}>{t("تفعيل الحساب", "Activate Account")}</h2>
                <p className={Style.subtitle}>
                  {t("اختر طريقة التفعيل لحسابك", "Choose activation method")}
                </p>

                <div className={Style.methodGrid}>
                  <button
                    className={Style.methodCard}
                    onClick={() => setVerifyMethod("code")}
                  >
                    <MailIcon size={24} />
                    <div>
                      <strong>{t("رمز عبر البريد", "Code via Email")}</strong>
                      <span>{t("أدخل الرمز المرسل لبريدك", "Enter code sent to your email")}</span>
                    </div>
                  </button>
                </div>
                <button
                  className={Style.backBtn}
                  onClick={() => setSuccess(false)}
                >
                  {t("العودة لإنشاء الحساب", "Back to Register")}
                </button>
              </>
            ) : verifyMethod === "code" ? (
              <div style={{ width: "100%" }}>
                <h2 className={Style.title}>{t("أدخل الرمز", "Enter Code")}</h2>
                <p className={Style.subtitle}>
                  {t("تم إرسال رمز من 6 أرقام إلى بريدك الإلكتروني", "A 6-digit code has been sent to your email")}
                </p>
                <form onSubmit={handleVerifyCode}>
                  <input
                    type="text"
                    className={Style.otpInput}
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  {formError && <div className={Style.errorBox}>{formError}</div>}
                  <button
                    className={Style.authbtn}
                    type="submit"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <LoaderIcon className="loader" />
                    ) : (
                      t("تفعيل الحساب", "Activate Account")
                    )}
                  </button>
                </form>
                <button
                  className={Style.resendBtn}
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE_URL}/auth/resend-code`, {
                        method: "POST",
                        headers: { 
                          "Content-Type": "application/json",
                          "ngrok-skip-browser-warning": "69420"
                        },
                        body: JSON.stringify({ email: formData.email }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || t("فشل إرسال الرمز", "Failed to send code"));
                      showToast(t("تم إعادة إرسال الرمز بنجاح", "Code resent successfully"), "success");
                    } catch (err: any) {
                      showToast(err.message, "error");
                    }
                  }}
                >
                  {t("إعادة إرسال الرمز", "Resend Code")}
                </button>
                <button
                  className={Style.backBtn}
                  onClick={() => { setVerifyMethod(null); setVerificationCode(""); setFormError(""); }}
                >
                  {t("العودة للخيارات", "Back to options")}
                </button>
              </div>
            ) : verifyMethod === "phone" ? (
              <div style={{ width: "100%" }}>
                <div className={Style.iconCircle}>
                  <PhoneIcon size={32} />
                </div>
                <h2 className={Style.title}>{t("التحقق عبر الهاتف", "Phone Verification")}</h2>
                <p className={Style.subtitle}>
                  {t("أدخل رمز التحقق المرسل إلى", "Enter verification code sent to")} <b>{formData.phone}</b>
                </p>
                <form onSubmit={handleVerifyPhoneOtp}>
                  <input
                    type="text"
                    className={Style.otpInput}
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  {formError && <div className={Style.errorBox}>{formError}</div>}
                  <button
                    className={Style.authbtn}
                    type="submit"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <LoaderIcon className="loader" />
                    ) : (
                      t("تفعيل الحساب", "Activate Account")
                    )}
                  </button>
                </form>
                <button
                  className={Style.resendBtn}
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={isSendingOtp}
                >
                  {isSendingOtp ? t("جاري الإرسال...", "Sending...") : t("إعادة إرسال الرمز", "Resend Code")}
                </button>
                <button
                  className={Style.backBtn}
                  onClick={() => { setVerifyMethod(null); setVerificationCode(""); setFormError(""); }}
                >
                  {t("العودة للخيارات", "Back to options")}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div className={Style.waitingLoader}>⏳</div>
                <h2 className={Style.title}>{t("بانتظار الرابط...", "Waiting for link...")}</h2>
                <p className={Style.subtitle}>
                  {t("يرجى الضغط على الرابط المرسل لبريدك الإلكتروني للتفعيل.", "Please click the link sent to your email to activate.")}
                </p>
                <button
                  className={Style.backBtn}
                  onClick={() => setVerifyMethod(null)}
                >
                  {t("استخدم الرمز بدلاً من ذلك", "Use code instead")}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="register-form"
            style={{ width: "100%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={Style.header}>
              <div className={Style.logoIcon}>
                <UserPlusIcon size={32} />
              </div>
              <h2 className={Style.title}>{t("إنشاء حساب جديد", "Create a new account")}</h2>
              <p className={Style.subtitle}>
                {t("ابدأ رحلتك المهنية مع Jobito", "Start your career journey with Jobito")}
              </p>
            </div>

            <form className={Style.form} onSubmit={handleSubmit}>
              {formError && (
                <div className={Style.errorBox}>
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

              <div className={Style.inputGroup}>
                <label>{t("الاسم بالكامل", "Full Name")}</label>
                <input
                  type="text"
                  placeholder={t("أدخل اسمك بالكامل", "Enter your full name")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  dir="auto"
                  required
                />
              </div>

              <div className={Style.row}>
                <div className={Style.inputGroup}>
                  <label>{t("البريد الإلكتروني", "Email")}</label>
                  <input
                    type="email"
                    placeholder={t("name@domain.com")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    dir="auto"
                    required
                  />
                </div>

                <div className={Style.inputGroup}>
                  <label>{t("رقم الهاتف", "Phone Number")}</label>
                  <input
                    type="tel"
                    placeholder={t("+20 1XX XXX XXXX")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className={Style.row}>
                <div className={Style.inputGroup}>
                  <label>{t("كلمة المرور", "Password")}</label>
                  <div className={Style.relativeInput}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      dir="ltr"
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
                <div className={Style.inputGroup}>
                  <label>{t("تأكيد كلمة المرور", "Confirm Password")}</label>
                  <div className={Style.relativeInput}>
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
                      dir="ltr"
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

              <button
                className={Style.authbtn}
                type="submit"
                disabled={isSigningUp}
                onClick={() => console.log("SignUpPage: Create account button clicked", formData)}
              >
                {isSigningUp ? <LoaderIcon className="loader" /> : t("إنشاء حساب", "Create Account")}
              </button>
              <button
                className={Style.googleFloatingBtn}
                type="button"
                onClick={() => googleLogin()}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width="24"
                  height="24"
                />
                <span>{t("متابعة باستخدام Google", "Continue with Google")}</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deletion Modal */}
      {showDeletionModal && deletionStatus && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '40px 32px',
            width: '90%', maxWidth: '440px', textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#ef4444', fontSize: '26px', fontWeight: 800, marginBottom: '14px' }}>
              {t("حسابك مجدول للحذف", "Your account is scheduled for deletion")}
            </h2>
            <p style={{ color: '#334155', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
              {t("حسابك مجدول للحذف. اضغط على 'استكمال الدخول' لإلغاء طلب الحذف والدخول لحسابك.", "Account scheduled for deletion. Click 'Continue Login' to cancel deletion.")}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={async () => {
                  try {
                    const cancelRes = await fetch(`${API_BASE_URL}/users/me/cancel-deletion`, {
                      method: 'PATCH',
                      headers: { Authorization: `Bearer ${loginToken}` },
                    });
                    if (!cancelRes.ok) throw new Error('Cancel failed');
                    alert(t("تم إلغاء طلب حذف الحساب بنجاح!", "Account deletion cancelled successfully!"));
                    setShowDeletionModal(false);
                    if (loginToken) {
                      localStorage.setItem('token', loginToken);
                      contextLogin?.(loginToken);
                      window.dispatchEvent(new Event('auth-changed'));
                      navigate('/');
                    }
                  } catch (e) {
                    console.error(e);
                    alert(t("فشل إلغاء الحذف", "Failed to cancel deletion"));
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
                  border: 'none', borderRadius: '14px', padding: '16px',
                  fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%'
                }}
              >
                {t("استكمال الدخول", "Continue Login")}
              </button>
              <button
                onClick={() => {
                  setShowDeletionModal(false);
                  setLoginToken(null);
                }}
                style={{
                  background: '#f1f5f9', color: '#475569', border: 'none',
                  borderRadius: '14px', padding: '16px', fontSize: '16px',
                  fontWeight: 600, cursor: 'pointer', width: '100%'
                }}
              >
                {t("تراجع (عدم الدخول)", "Go Back")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
