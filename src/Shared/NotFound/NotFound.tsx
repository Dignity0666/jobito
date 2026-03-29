import React from "react";
import styles from "./NotFound.module.css";

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* 404 Graphic Graphic built with CSS/SVG */}
      <div className={styles.graphicWrapper}>
        <div className={styles.confetti}></div>
        <div className={styles.windowLeft}>
          <div className={styles.windowHeader}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <div className={styles.windowBody}>
            <span className={styles.number}>4</span>
          </div>
          <div className={styles.jaggedEdgeRight}></div>
        </div>

        <div className={styles.middleZero}>0</div>

        <div className={styles.windowRight}>
          <div className={styles.windowHeader}></div>
          <div className={styles.windowBody}>
            <span className={styles.number}>4</span>
          </div>
          <div className={styles.jaggedEdgeLeft}></div>
        </div>
      </div>

      <div className={styles.textContainer}>
        <h1 className={styles.title}>Ooops!</h1>
        <h2 className={styles.subtitle}>Looks like you're in the wrong place.</h2>
        <p className={styles.description}>
          We can't find the page you're looking for...{" "}
          <a href="/" className={styles.homeLink}>
            ➔ Take me home
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
