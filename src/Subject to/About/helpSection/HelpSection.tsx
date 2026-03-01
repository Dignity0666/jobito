import styles from "./HelpSection.module.css";
import image from "../../../assets/Img/Gemini_Generated_Image_lk4biqlk4biqlk4b.png";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const HelpSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className={styles.helpSection} ref={sectionRef}>
      <div className={styles.helpContainer}>
        <div
          className={`${styles.helpContent} ${isVisible ? styles.visible : ""}`}
        >
          <div className={styles.helpTextSide}>
            <div className={styles.helpBadge}>
              <CheckCircle size={18} />
              <span>Expert Team</span>
            </div>

            <h2>
              We're Here <span>To Help</span>
            </h2>

            <p>
              At Freedom HR we become an invaluable resource within your
              business, teaming up as your HR expert and freeing you to
              concentrate on other areas of your business. We offer a scalable
              and cost-effective solution and become your friend and trusted
              advisor.
            </p>

            <div className={styles.helpStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>500+</span>
                <span className={styles.statLabel}>Clients Served</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>98%</span>
                <span className={styles.statLabel}>Satisfaction</span>
              </div>
            </div>

            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                <img src={image} alt="Farah Mody" />
              </div>
              <div className={styles.authorDetails}>
                <strong>Farah Mody</strong>
                <span>Director</span>
              </div>
            </div>
          </div>

          <div className={styles.helpImageSide}>
            <div className={styles.floatingBlob}>
              <div className={styles.blobShape}>
                <img src={image} alt="Director" />
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.expNumber}>10+</span>
                <span>Years of Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
