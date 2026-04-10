import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HeaderActions.module.css";
import { useTranslation } from "../../../context/translation-context";

type HeaderActionsProps = {
  isAuthenticated: boolean;
  user?: { name?: string; avatar?: string; avatarUrl?: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
};

const getAvatarUrl = (path: string | undefined | null) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export function HeaderActions({
  isAuthenticated,
  user,
  onLogout,
}: HeaderActionsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [avatarError, setAvatarError] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
    if (onLogout) onLogout();
  };

  return (
    <>
      <div className={styles.right}>
        {isAuthenticated ? (
          <div className={styles.avatarWrap}>
            <Link
              to="/ProfileSettings"
              className={styles.avatar}
              title={user?.name || t("nav.profile")}
            >
              { (user?.avatarUrl || user?.avatar) && !avatarError ? (
                <img
                  src={getAvatarUrl(user.avatarUrl || user.avatar) || ""}
                  alt={user.name || "avatar"}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span>{initials}</span>
              )}
            </Link>
            <button
              className={styles.logoutBtn}
              onClick={handleLogoutClick}
              title={t("nav.logout")}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        ) : (
          <button
            className={styles.loginBtn}
            onClick={() => {
              navigate("/user-information");
            }}
            title={t("nav.login")}
          >
            <i className="fa-solid fa-user"></i>
          </button>
        )}
      </div>
    </>
  );
}
