import { Link } from "react-router-dom";
import LogoIMG from "../../../assets/logok.png";
import styles from "./Logo.module.css";

export const Logo = () => {
  return (
    <>
      <Link to="/" className={styles.logo}>
        <img src={LogoIMG} alt="Jobito" className={styles.img} />
      </Link>
    </>
  );
};
