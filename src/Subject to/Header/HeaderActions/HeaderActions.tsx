import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type HeaderActionsProps = {
  isAuthenticated: boolean;
  user?: { name?: string; avatar?: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
};

export function HeaderActions({
  isAuthenticated,
  user,
  onLoginClick,
  onLogout,
}: HeaderActionsProps) {
  const navigate = useNavigate();
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
    <div className="hdr-right">
      {isAuthenticated ? (
        <div className="hdr-avatar-wrap" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/ProfileSettings" className="hdr-avatar" title={user?.name || "Profile Settings"}>
            {user?.avatar && !avatarError ? (
              <img
                src={user.avatar}
                alt={user.name || "avatar"}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span>{initials}</span>
            )}
          </Link>
          <button className="hdr-logout-icon-btn" onClick={handleLogoutClick} title="Logout">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            navigate("/user-information");
          }}
        >
          <i className="fa-solid fa-user"></i>
        </button>
      )}
    </div>
  );
}
