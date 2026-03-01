import { useState, useRef } from "react";

type VerifyEmailPageProps = {
  email: string;
  onVerified: () => void; // ✅ إصلاح النوع — بدلاً من React.Dispatch<React.SetStateAction<boolean>>
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({
  email,
  onVerified,
}) => {
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const code = otpDigits.join("");

  // ✅ إدارة خانات OTP
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = Array(6).fill("");
    pasted.split("").forEach((char, i) => { newDigits[i] = char; });
    setOtpDigits(newDigits);
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
  };

  // ✅ التحقق من الكود
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => onVerified(), 2000); // ✅ استخدام onVerified
      } else {
        setError(data.message || "كود غير صحيح");
        setOtpDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch {
      setError("خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // ✅ إعادة الإرسال مع Cooldown 60 ثانية
  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResendMsg(data.message || "تم إرسال كود جديد لبريدك الإلكتروني");

      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setResendMsg("فشل إعادة إرسال الكود");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6" style={{ direction: "rtl" }}>

      {/* Header — نفس شكل welcome-box */}
      <div className="welcome-box">
        <div style={{ fontSize: 48, marginBottom: 8 }}>📧</div>
        <h2>تحقق من بريدك</h2>
        <p>أرسلنا كود التفعيل إلى</p>
        <span style={{ color: "#38bdf8", fontWeight: 600, fontSize: 14 }}>
          {email}
        </span>
      </div>

      {success ? (
        /* ✅ Success State */
        <div className="verify-success-box">
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <p style={{ color: "#38bdf8", fontWeight: 700, margin: "0 0 4px", fontSize: 16 }}>
            تم التفعيل بنجاح!
          </p>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 16px" }}>
            جاري تحويلك الآن...
          </p>
          <div className="verify-progress-track">
            <div className="verify-progress-bar" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="form">

          {/* Error */}
          {error && (
            <div className="verify-error">
              {error}
            </div>
          )}

          {/* OTP 6 خانات */}
          <div>
            <label className="auth-label">كود التفعيل (6 أرقام)</label>
            <div className="otp-row" dir="ltr">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`otp-digit-input ${digit ? "otp-filled" : ""} ${error ? "otp-error" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="auth-btn"
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span className="loader" />
                جاري التحقق...
              </span>
            ) : (
              "تأكيد الحساب"
            )}
          </button>

          {/* Resend */}
          <div className="cenr">
            {resendMsg && (
              <p className="resend-ok-msg">{resendMsg}</p>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `إعادة الإرسال بعد ${resendCooldown}s`
                : resendLoading
                ? "برجاء الانتظار..."
                : "لم يصلك الكود؟ إعادة إرسال"}
            </button>
          </div>

        </form>
      )}

      <style>{`
        /* OTP Row */
        .otp-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
        }

        .otp-digit-input {
          width: 44px;
          height: 52px;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          border-radius: 8px;
          border: 1.5px solid rgba(148, 163, 184, 0.3);
          background: rgba(255, 255, 255, 0.04);
          color: #f1f5f9;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .otp-digit-input:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
        }

        .otp-digit-input.otp-filled {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
          color: #38bdf8;
        }

        .otp-digit-input.otp-error {
          border-color: rgba(239, 68, 68, 0.5) !important;
          background: rgba(239, 68, 68, 0.06) !important;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }

        /* Error banner */
        .verify-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-right: 3px solid #ef4444;
          color: #fca5a5;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
        }

        /* Success box */
        .verify-success-box {
          text-align: center;
          padding: 28px 16px;
          background: rgba(56, 189, 248, 0.06);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 12px;
        }

        /* Progress bar */
        .verify-progress-track {
          height: 3px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 99px;
          overflow: hidden;
        }

        .verify-progress-bar {
          height: 100%;
          background: #38bdf8;
          border-radius: 99px;
          animation: progressFill 2s linear forwards;
        }

        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* Resend success message */
        .resend-ok-msg {
          color: #4ade80;
          font-size: 12px;
          margin: 0 0 6px;
        }
      `}</style>
    </div>
  );
};