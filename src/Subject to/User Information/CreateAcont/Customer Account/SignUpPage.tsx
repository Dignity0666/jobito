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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import signupImage from "../../../../assets/signup.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifiedStatus, setVerifiedStatus] = useState<null | "success" | "error">(null);
  const [verifyMethod, setVerifyMethod] = useState<null | "code" | "link">(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") setVerifiedStatus("success");
    else if (params.get("verified") === "false") setVerifiedStatus("error");
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Exchange access_token for id_token via Google's userinfo + our backend
        const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google signup failed");

        localStorage.setItem("token", data.access_token);
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/");
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    onError: () => alert("Google login failed"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      setIsSigningUp(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccess(true);
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
      const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
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
      {/* Floating Google Auth Button */}
      <button 
        className={Style.googleFloatingBtn}
        onClick={() => googleLogin()}
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="24" height="24" />
        <span>Continue with Google</span>
      </button>

      <motion.div 
        className={Style.signupleft}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          {verifiedStatus === "success" ? (
            <motion.div key="success-final" className={Style.centeredBox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className={Style.successIcon}><CheckCircleIcon size={64} /></div>
              <h2 className={Style.title}>Account Activated!</h2>
              <p className={Style.subtitle}>Welcome to Jobito. Your student profile is ready.</p>
              <button className={Style.authbtn} onClick={() => navigate("/user-information")}>Go to Login</button>
            </motion.div>
          ) : success ? (
            <motion.div key="verify-steps" className={Style.centeredBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!verifyMethod ? (
                <>
                  <div className={Style.iconCircle}><MailIcon size={32} /></div>
                  <h2 className={Style.title}>Verify Your Email</h2>
                  <p className={Style.subtitle}>Choose how you want to verify <b>{formData.email}</b></p>
                  
                  <div className={Style.methodGrid}>
                    <button className={Style.methodCard} onClick={() => setVerifyMethod("link")}>
                      <LinkIcon size={24} />
                      <div>
                        <strong>Email Link</strong>
                        <span>Click the link in your inbox</span>
                      </div>
                    </button>
                    <button className={Style.methodCard} onClick={() => setVerifyMethod("code")}>
                      <SmartphoneIcon size={24} />
                      <div>
                        <strong>6-Digit Code</strong>
                        <span>Enter the code manually</span>
                      </div>
                    </button>
                  </div>
                  <button className={Style.backBtn} onClick={() => setSuccess(false)}>Back to Registration</button>
                </>
              ) : verifyMethod === "code" ? (
                <div style={{ width: "100%" }}>
                  <h2 className={Style.title}>Enter Code</h2>
                  <p className={Style.subtitle}>6-digit code sent to your email</p>
                  <form onSubmit={handleVerifyCode}>
                    <input 
                      type="text" 
                      className={Style.otpInput} 
                      maxLength={6} 
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button className={Style.authbtn} type="submit" disabled={isVerifying}>
                      {isVerifying ? <LoaderIcon className="loader" /> : "Verify Account"}
                    </button>
                  </form>
                  <button className={Style.backBtn} onClick={() => setVerifyMethod(null)}>Back to Options</button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div className={Style.waitingLoader}>⏳</div>
                  <h2 className={Style.title}>Waiting for Link...</h2>
                  <p className={Style.subtitle}>Please click the link in your email to activate.</p>
                  <button className={Style.backBtn} onClick={() => setVerifyMethod(null)}>Use Code instead</button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="register-form" style={{ width: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={Style.header}>
                <div className={Style.logoIcon}><UserPlusIcon size={32} /></div>
                <h2 className={Style.title}>Create Student Account</h2>
                <p className={Style.subtitle}>Start your career journey with Jobito</p>
              </div>

              <form className={Style.form} onSubmit={handleSubmit}>
                {formError && (
                  <div className={Style.errorBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {formError}
                  </div>
                )}
                
                <div className={Style.inputGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className={Style.inputGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="name@domain.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>

                <div className={Style.row}>
                  <div className={Style.inputGroup}>
                    <label>Password</label>
                    <div className={Style.relativeInput}>
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#94a3b8', padding: 0 }}>
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Confirm</label>
                    <div className={Style.relativeInput}>
                      <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#94a3b8', padding: 0 }}>
                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button className={Style.authbtn} type="submit" disabled={isSigningUp}>
                  {isSigningUp ? <LoaderIcon className="loader" /> : "Sign Up"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className={Style.signuplight}>
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={signupImage} 
          alt="Signup Illustration" 
        />
      </div>
    </div>
  );
};

export default SignUpPage;
