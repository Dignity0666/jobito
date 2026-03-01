import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home",             path: "/" },
  { label: "Find Jobs",        path: "/Find Jobs" },
  { label: "Browse Companies", path: "/Browse Companies" },
  { label: "About",            path: "/about" },
  { label: "Contact",          path: "/contact" },
];

type NavBarProps = {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NavBar({ mobileOpen, setMobileOpen }: NavBarProps) {
  const location = useLocation();

  return (
    <>
      {/* ── Hamburger (mobile) ── */}
      <button
        className="hdr-burger"
        onClick={() => setMobileOpen((p) => !p)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ── Nav links (desktop) ── */}
      <nav className="hdr-nav">
        {navLinks.map((link, i) => {
          const active = location.pathname === link.path;
          return (
            <div className="hdr-nav-item" key={link.path}>
              {i > 0 && <span className="hdr-sep" aria-hidden />}
              <Link
                to={link.path}
                className={`hdr-link ${active ? "hdr-link--active" : ""}`}
              >
                {link.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* ── Mobile nav ── */}
      {mobileOpen && (
        <nav className="hdr-mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hdr-mobile-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}