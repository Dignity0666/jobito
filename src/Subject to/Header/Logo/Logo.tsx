import { Link } from "react-router-dom";
import LogoIMG from "../../../assets/412ec68f361b4f49b52fb8d584c317ccf197a403.png";

export const Logo: React.FC<{
  setshowObitoSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setshowObitoSidebar }) => {
  return (
    <>
      <button onClick={() => setshowObitoSidebar(true)}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <Link to="/" className="hdr-logo">
        <img src={LogoIMG} alt="Jobito" className="hdr-logo-img" />
      </Link>
    </>
  );
};
