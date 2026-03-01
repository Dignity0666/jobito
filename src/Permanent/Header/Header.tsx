import { useState } from "react";
import { NavBar } from "../../Subject to/Header/NavBar/NavBar";
import "./Header.css";
import { HeaderActions } from "../../Subject to/Header/HeaderActions/HeaderActions";
import { Logo } from "../../Subject to/Header/Logo/Logo";

type HeaderProps = {
  isAuthenticated?: boolean;
  user?: { name?: string; avatar?: string } | null;
  onLoginClick?: () => void;
  onLogout?: () => void;
  setshowObitoSidebar: React.Dispatch<React.SetStateAction<boolean>>; 
};
export function Header({
  isAuthenticated = false,
  user = null,
  setshowObitoSidebar,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="hdr-root">
      <div className="hdr-inner">
        <Logo setshowObitoSidebar={setshowObitoSidebar} />
        <NavBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <HeaderActions isAuthenticated={isAuthenticated} user={user} />
      </div>
    </header>
  );
}