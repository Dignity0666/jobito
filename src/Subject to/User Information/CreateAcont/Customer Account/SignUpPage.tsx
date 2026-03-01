import { useState } from "react";
import Style from "./SignUpPage.module.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { motion } from "framer-motion";
import {
  LoaderIcon,
  LockIcon,
  MailIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import signupImage from "../../../../assets/signup.png";
import { VerifyEmailPage } from "./VerifyEmailPage/VerifyEmailPage";
import MyLoginPage from "../../MyLoginPage/MyLoginPage";

interface SignUpPageProps {
  setIsCustomer: (value: boolean) => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const SignUpPage: React.FC<SignUpPageProps> = ({
  setIsCustomer,
}) => {
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ CredentialResponse متعرفة دلوقتي
  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (!response.credential) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/ProfileSettings");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setFormError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    try {
      setIsSigningUp(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setFormError(message);
    } finally {
      setIsSigningUp(false);
    }
  };

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
      className={Style.signupwrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={Style.signupleft}>
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          {success ? (
            <VerifyEmailPage
              email={formData.email}
              onVerified={() => navigate("/login")}
            />
          ) : (
            <>
              <div className={Style.textcenter}>
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h2>Create Account</h2>
                <p>Sign up for a new account</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                {/* ✅ className صح دلوقتي */}
                {formError && (
                  <motion.div
                    className={Style.errorMsg}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formError}
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <label className={Style.authlabel}>Full Name</label>
                  <div className={Style.relative}>
                    <UserIcon className="input-icon" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className={Style.authlabel}>Email</label>
                  <div className={Style.relative}>
                    <MailIcon className="input-icon" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  className={Style.threeclumns}
                  variants={itemVariants}
                >
                  <div>
                    <label className={Style.authlabel}>Password</label>
                    <div className={Style.relative}>
                      <LockIcon className="input-icon" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (formError) setFormError("");
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={Style.authlabel}>Confirm Password</label>
                    <div className={Style.relative}>
                      <LockIcon className="input-icon" />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData({ ...formData, confirmPassword: e.target.value });
                          if (formError) setFormError("");
                        }}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.button
                  className={Style.authbtn}
                  type="submit"
                  disabled={isSigningUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSigningUp ? (
                    <LoaderIcon className="loader" />
                  ) : (
                    "Create Account"
                  )}
                </motion.button>

                {/* ✅ GoogleOAuthProvider برا الـ form أو في آخره — صح */}
                <GoogleOAuthProvider
                  clientId={
                    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
                    "979468185418-k8tedaaked370gm1iftpbpsgl5vq9ruo.apps.googleusercontent.com"
                  }
                >
                  <MyLoginPage onGoogleLogin={handleGoogleLogin} />
                </GoogleOAuthProvider>
              </form>

              <motion.div className={Style.cenr} variants={itemVariants}>
                <button
                  onClick={() => setIsCustomer(false)}
                  className={Style.switchbtn}
                >
                  Switch to a company account
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div
        className="sign-up-right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <img
          src={signupImage}
          alt="Sign Up Illustration"
          className={Style.signupimage}
        />
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;