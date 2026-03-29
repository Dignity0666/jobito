import { useState, useEffect } from "react";
import Style from "./SignUpPage.module.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  LinkIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  SmartphoneIcon,
  UserPlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import signupImage from "../../../../assets/signup.png";

interface SignUpPageProps {
  setIsCustomer: (value: boolean) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SignUpPage: React.FC<SignUpPageProps> = ({ setIsCustomer }) => {
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifiedStatus, setVerifiedStatus] = useState<null | "success" | "error">(null);
  const [verifyMethod, setVerifyMethod] = useState<null | "code" | "link">(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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
                {formError && <div className={Style.errorBox}>{formError}</div>}
                
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
                    <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                  </div>
                  <div className={Style.inputGroup}>
                    <label>Confirm</label>
                    <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                  </div>
                </div>

                <button className={Style.authbtn} type="submit" disabled={isSigningUp}>
                  {isSigningUp ? <LoaderIcon className="loader" /> : "Sign Up"}
                </button>
              </form>

              <div className={Style.footer}>
                <span>Are you a company?</span>
                <button onClick={() => setIsCustomer(false)}>Register as Company</button>
              </div>
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
