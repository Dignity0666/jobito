import { useState } from "react";
import { LoaderIcon, MessageCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import "./CompanyRegister.css";
import signupImage from "../../../../assets/signup.png";
import { VerifyEmailPage } from "../Customer Account/VerifyEmailPage/VerifyEmailPage";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface CompanyRegisterProps {
  setIsCustomer: (value: boolean) => void;
}

export const CompanyRegister: React.FC<CompanyRegisterProps> = ({
  setIsCustomer,
}) => {
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setFormError(message);
    } finally {
      setIsCreating(false);
    }
  };

  // ✨ Variants للأنيميشن
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="company-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="company-left">
        {success ? (
          <VerifyEmailPage
            email={formData.companyEmail}
            onVerified={() => navigate("/user-Information")}
          />
        ) : (
          <>
            <motion.div className="welcome-box" variants={itemVariants}>
              <MessageCircleIcon className="welcome-icon" />
              <h2>Company Registration</h2>
              <p>Register your company to start hiring</p>
            </motion.div>

            <motion.div className="form-wrapper" variants={itemVariants}>
              <form className="form" onSubmit={handleSubmit}>
                {formError && (
                  <motion.div
                    className="errorMsg"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}
                  >
                    {formError}
                  </motion.div>
                )}
                <motion.div className="three-columns" variants={itemVariants}>
                  <Input
                    label="Company Name"
                    value={formData.companyName}
                    onChange={(v) => setFormData({ ...formData, companyName: v })}
                  />
                  <Input
                    label="Tax Number"
                    value={formData.taxNumber}
                    onChange={(v) => setFormData({ ...formData, taxNumber: v })}
                  />
                  <Input
                    label="Company Phone"
                    value={formData.companyPhone}
                    onChange={(v) => setFormData({ ...formData, companyPhone: v })}
                  />
                </motion.div>

                <motion.div className="three-columns" variants={itemVariants}>
                  <Input
                    label="Company Address"
                    value={formData.companyAddress}
                    onChange={(v) =>
                      setFormData({ ...formData, companyAddress: v })
                    }
                  />
                  <Input
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={(v) => setFormData({ ...formData, licenseNumber: v })}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Company Email"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(v) => setFormData({ ...formData, companyEmail: v })}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(v) => setFormData({ ...formData, password: v })}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(v) =>
                      setFormData({ ...formData, confirmPassword: v })
                    }
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="submit-btn"
                  disabled={isCreating}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCreating ? (
                    <LoaderIcon className="loader" />
                  ) : (
                    "Create Company"
                  )}
                </motion.button>

                <motion.div className="switch-box" variants={itemVariants}>
                  <button type="button" onClick={() => setIsCustomer(true)}>
                    انشاء حساب
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </>
        )}
      </div>

      <motion.div
        className="company-right"
        variants={itemVariants}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.6 } }}
      >
        <img
          src={signupImage}
          alt="Company Illustration"
          className="company-image"
        />
      </motion.div>
    </motion.div>
  );
};

interface InputProps {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  type = "text",
  onChange,
}) => (
  <div>
    <label className="auth-label">{label}</label>
    <div className="input-wrapper">
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  </div>
);
