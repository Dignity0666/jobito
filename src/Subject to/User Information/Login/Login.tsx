import {
  MailIcon,
  LockIcon,
  LoaderIcon,
  MessageCircleIcon,
} from "lucide-react";
import image from "../../../assets/login.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Style from "./Login.module.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import MyLoginPage from "../MyLoginPage/MyLoginPage";
import { useJobitoAuth } from "../../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface LoginPageProps {
  setShowLogin: (value: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setShowLogin }) => {
  const navigate = useNavigate();
  const { googleClientId } = useJobitoAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetMethod, setResetMethod] = useState<"google" | "email" | null>(null);
  const [resetStep, setResetStep] = useState(1); // 1: Verify, 2: New Password
  
  const [resetEmail, setResetEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // ✅ handleGoogleLogin جوا الـ component عشان يوصل لـ setShowLogin و navigate
  const handleGoogleLogin = async (response: CredentialResponse) => {
    if (!response.credential) return;

    if (isResetMode && resetMethod === "google" && resetStep === 1) {
      setGoogleToken(response.credential);
      setResetStep(2);
      return;
    }

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
      setShowLogin(false);
      navigate("/");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      setIsSendingCode(true);
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");
      alert("Verification code sent to your email!");
      setResetStep(2); // Step 2 for email is code entry + new password
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setIsResetting(true);
      let res;
      if (resetMethod === "google") {
        res = await fetch(`${API_BASE_URL}/auth/reset-password-google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ googleToken, new_password: newPassword }),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail, code: otpCode, new_password: newPassword }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      alert("Password reset success! Please login with your new password.");
      setIsResetMode(false);
      setResetStep(1);
      setResetMethod(null);
      setGoogleToken("");
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoggingIn(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("auth-changed"));
      setShowLogin(false);
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const resetState = () => {
    setIsResetMode(false);
    setResetMethod(null);
    setResetStep(1);
    setGoogleToken("");
    setOtpCode("");
    setResetEmail("");
  };

  return (
    <div className={Style.LoginPage}>
      <div className={Style.LoginPageLeft}>
        <div className={Style.textcenter}>
          <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-600 mb-2">
            {isResetMode ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-slate-400">
            {isResetMode
              ? "Choose a method to reset your password"
              : "Login to access your account"}
          </p>
        </div>

        {!isResetMode ? (
          <form className={Style.LoginPagefrom} onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className={Style.authlabel}>Email</label>
              <div className={Style.relative}>
                <MailIcon className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@gmail.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={Style.authlabel}>Password</label>
              <div className={Style.relative}>
                <LockIcon className="auth-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="auth-input"
                />
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              className={Style.authbtn}
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <LoaderIcon className="w-full h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          <div className={Style.LoginPagefrom}>
            {!resetMethod && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setResetMethod("google")}
                  className="w-full py-3 px-4 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-slate-700 font-medium">Verify via Google</span>
                </button>
                <button
                  onClick={() => setResetMethod("email")}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <MailIcon size={20} />
                  <span className="font-medium">Verify via Email Code</span>
                </button>
                <button
                  onClick={resetState}
                  className="mt-2 text-slate-500 hover:text-slate-700 text-sm"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            {resetMethod === "google" && (
              <div className="text-center">
                {resetStep === 1 ? (
                  <>
                    <p className="mb-4 text-slate-500">Step 1: Sign in with Google to verify it's you</p>
                    <div className={Style.GoogleOAuthProvide}>
                      {googleClientId && (
                        <GoogleOAuthProvider clientId={googleClientId}>
                          <MyLoginPage onGoogleLogin={handleGoogleLogin} />
                        </GoogleOAuthProvider>
                      )}
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <p className="mb-4 text-green-600 text-sm font-medium">✓ Identity verified! Enter your new password.</p>
                    <div>
                      <label className={Style.authlabel}>New Password</label>
                      <div className={Style.relative}>
                        <LockIcon className="auth-input-icon" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          required
                          className="auth-input"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className={Style.authlabel}>Confirm Password</label>
                      <div className={Style.relative}>
                        <LockIcon className="auth-input-icon" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          className="auth-input"
                        />
                      </div>
                    </div>
                    <button
                      className={Style.authbtn}
                      type="submit"
                      disabled={isResetting}
                      style={{ marginTop: '20px' }}
                    >
                      {isResetting ? (
                        <LoaderIcon className="w-full h-5 animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                )}
                <button
                  onClick={() => {
                    setResetMethod(null);
                    setResetStep(1);
                  }}
                  className="mt-6 text-slate-500 hover:text-slate-700 text-sm"
                >
                  ← Change Method
                </button>
              </div>
            )}

            {resetMethod === "email" && (
              <div className="w-full">
                {resetStep === 1 ? (
                  <form onSubmit={handleRequestOtp}>
                    <p className="mb-4 text-slate-500 text-sm">Enter your email to receive a 6-digit verification code.</p>
                    <div className={Style.relative}>
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="auth-input"
                      />
                    </div>
                    <button
                      className={Style.authbtn}
                      type="submit"
                      disabled={isSendingCode}
                      style={{ marginTop: '15px' }}
                    >
                      {isSendingCode ? (
                        <LoaderIcon className="w-full h-5 animate-spin" />
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <p className="mb-4 text-slate-500 text-sm">We've sent a code to {resetEmail}</p>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className={Style.authlabel}>Verification Code</label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="6-digit code"
                          required
                          maxLength={6}
                          className="auth-input text-center tracking-widest text-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className={Style.authlabel}>New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          required
                          className="auth-input"
                        />
                      </div>
                      <div>
                        <label className={Style.authlabel}>Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          required
                          className="auth-input"
                        />
                      </div>
                    </div>
                    <button
                      className={Style.authbtn}
                      type="submit"
                      disabled={isResetting}
                      style={{ marginTop: '20px' }}
                    >
                      {isResetting ? (
                        <LoaderIcon className="w-full h-5 animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                )}
                <button
                  onClick={() => {
                    setResetMethod(null);
                    setResetStep(1);
                  }}
                  className="w-full mt-4 text-slate-500 hover:text-slate-700 text-sm"
                >
                  ← Change Method
                </button>
              </div>
            )}
          </div>
        )}

        {!isResetMode && (
          <>
            <div className={Style.GoogleOAuthProvide}>
              {googleClientId && (
                <GoogleOAuthProvider clientId={googleClientId}>
                  <MyLoginPage onGoogleLogin={handleGoogleLogin} />
                </GoogleOAuthProvider>
              )}
            </div>

            <div className="text-center mt-4">
              <span className="text-slate-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setShowLogin(false)}
                >
                  Sign Up
                </button>
              </span>
            </div>
          </>
        )}
      </div>

      <div className="hidden md:w-1/2 md:flex items-center justify-center p-9">
        <img
          src={image}
          alt="People using mobile devices"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default LoginPage;
