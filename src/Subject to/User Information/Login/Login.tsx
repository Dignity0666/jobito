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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

interface LoginPageProps {
  setShowLogin: (value: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setShowLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ✅ handleGoogleLogin جوا الـ component عشان يوصل لـ setShowLogin و navigate
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
      setShowLogin(false);
      navigate("/ProfileSettings");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
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

  return (
    <div className={Style.LoginPage}>
      <div className={Style.LoginPageLeft}>
        <div className={Style.textcenter}>
          <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-600 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400">Login to access your account</p>
        </div>

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

        <GoogleOAuthProvider
          clientId={
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "979468185418-k8tedaaked370gm1iftpbpsgl5vq9ruo.apps.googleusercontent.com"
          }
        >
          <MyLoginPage onGoogleLogin={handleGoogleLogin} />
        </GoogleOAuthProvider>

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
