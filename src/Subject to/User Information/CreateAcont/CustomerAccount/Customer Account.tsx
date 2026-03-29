import { useState, useEffect } from "react";
import { 
  LoaderIcon, 
  MessageCircleIcon, 
  CheckCircleIcon, 
  MailIcon, 
  LinkIcon, 
  SmartphoneIcon,
  Building2Icon,
  PhoneIcon,
  MapPinIcon,
  FileTextIcon,
  ShieldCheckIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CompanyRegister.module.css";
import signupImage from "../../../../assets/signup.png";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface CompanyRegisterProps {
  setIsCustomer: (value: boolean) => void;
}

export const CompanyRegister: React.FC<CompanyRegisterProps> = ({ setIsCustomer }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyPhone: "",
    taxNumber: "",
    commercialRegister: "",
    licenseNumber: "",
    companyEmail: "",
    companyAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [verifiedStatus, setVerifiedStatus] = useState<null | "success" | "error">(null);
  const [verifyMethod, setVerifyMethod] = useState<null | "code" | "link">(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
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
        body: JSON.stringify({ email: formData.companyEmail, code: verificationCode }),
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
    <div className={styles.signupwrapper}>
      <motion.div 
        className={styles.signupleft}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          {verifiedStatus === "success" ? (
            <motion.div key="success-final" className={styles.centeredBox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className={styles.successIcon}><CheckCircleIcon size={64} /></div>
              <h2 className={styles.title}>Company Activated!</h2>
              <p className={styles.subtitle}>Your business profile is ready. Start posting jobs today.</p>
              <button className={styles.authbtn} onClick={() => navigate("/user-information")}>Go to Login</button>
            </motion.div>
          ) : success ? (
            <motion.div key="verify-steps" className={styles.centeredBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!verifyMethod ? (
                <>
                  <div className={styles.iconCircle}><Building2Icon size={32} /></div>
                  <h2 className={styles.title}>Verify Business Account</h2>
                  <p className={styles.subtitle}>Confirming <b>{formData.companyEmail}</b></p>
                  
                  <div className={styles.methodGrid}>
                    <button className={styles.methodCard} onClick={() => setVerifyMethod("link")}>
                      <LinkIcon size={24} />
                      <div>
                        <strong>Click Link</strong>
                        <span>Special activation link in your inbox</span>
                      </div>
                    </button>
                    <button className={styles.methodCard} onClick={() => setVerifyMethod("code")}>
                      <SmartphoneIcon size={24} />
                      <div>
                        <strong>Enter Code</strong>
                        <span>6-digit manual verification code</span>
                      </div>
                    </button>
                  </div>
                  <button className={styles.backBtn} onClick={() => setSuccess(false)}>Back to Registration</button>
                </>
              ) : verifyMethod === "code" ? (
                <div style={{ width: "100%" }}>
                  <h2 className={styles.title}>Enter Business Code</h2>
                  <p className={styles.subtitle}>Check your company email for a code</p>
                  <form onSubmit={handleVerifyCode}>
                    <input 
                      type="text" 
                      className={styles.otpInput} 
                      maxLength={6} 
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <button className={styles.authbtn} type="submit" disabled={isVerifying}>
                      {isVerifying ? <LoaderIcon className="loader" /> : "Verify Business"}
                    </button>
                  </form>
                  <button className={styles.backBtn} onClick={() => setVerifyMethod(null)}>Back to Options</button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div className={styles.waitingLoader}>⏳</div>
                  <h2 className={styles.title}>Verifying Business...</h2>
                  <p className={styles.subtitle}>Please click the activation link in your inbox.</p>
                  <button className={styles.backBtn} onClick={() => setVerifyMethod(null)}>Use Code instead</button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="register-form" style={{ width: "100%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={styles.header}>
                <div className={styles.logoIcon}><Building2Icon size={32} /></div>
                <h2 className={styles.title}>Business Registration</h2>
                <p className={styles.subtitle}>Hire top talent for your growing company</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                {formError && <div className={styles.errorBox}>{formError}</div>}
                
                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Company Name</label>
                    <div className={styles.relativeInput}>
                      <Building2Icon size={18} className={styles.inputIcon} />
                      <input type="text" placeholder="Acme Inc." value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Tax Number / CR</label>
                    <div className={styles.relativeInput}>
                      <FileTextIcon size={18} className={styles.inputIcon} />
                      <input type="text" placeholder="123456789" value={formData.taxNumber} onChange={(e) => setFormData({...formData, taxNumber: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Phone Number</label>
                    <div className={styles.relativeInput}>
                      <PhoneIcon size={18} className={styles.inputIcon} />
                      <input type="text" placeholder="+123..." value={formData.companyPhone} onChange={(e) => setFormData({...formData, companyPhone: e.target.value})} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Headquarters</label>
                    <div className={styles.relativeInput}>
                      <MapPinIcon size={18} className={styles.inputIcon} />
                      <input type="text" placeholder="City, Country" value={formData.companyAddress} onChange={(e) => setFormData({...formData, companyAddress: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Business Email</label>
                  <div className={styles.relativeInput}>
                    <MailIcon size={18} className={styles.inputIcon} />
                    <input type="email" placeholder="hr@acme.com" value={formData.companyEmail} onChange={(e) => setFormData({...formData, companyEmail: e.target.value})} required />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Password</label>
                    <div className={styles.relativeInput}>
                      <ShieldCheckIcon size={18} className={styles.inputIcon} />
                      <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Confirm</label>
                    <div className={styles.relativeInput}>
                      <ShieldCheckIcon size={18} className={styles.inputIcon} />
                      <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <button className={styles.authbtn} type="submit" disabled={isCreating}>
                  {isCreating ? <LoaderIcon className="loader" /> : "Create Business Profile"}
                </button>
              </form>

              <div className={styles.footer}>
                <span>Are you a student?</span>
                <button onClick={() => setIsCustomer(true)}>Register as Student</button>
              </div>
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
