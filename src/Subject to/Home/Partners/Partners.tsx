import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Partners.module.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

type Partner = {
  id: number;
  name: string;
  logo?: string;
};

interface BackendCompany {
  companyId: number;
  name: string;
  description?: string;
  logoUrl?: string;
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firstRowRef = useRef(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/companies`);
        if (!response.ok) throw new Error("Failed to fetch partners");
        const data: BackendCompany[] = await response.json();

        const mappedPartners = data.map((c) => ({
          id: c.companyId,
          name: c.name,
          logo: c.logoUrl 
            ? (c.logoUrl.startsWith("http") ? c.logoUrl : `${API_BASE_URL}${c.logoUrl}`)
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=128`,
        }));

        setPartners(mappedPartners);
      } catch (err) {
        console.error("Error loading partners:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const ReviewCard = ({ logo, name }: { logo: string; name: string }) => (
    <figure className={styles.reviewCard} title={name}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
      >
        <img src={logo} alt={name} className={styles.partnerLogo} />
        <span className={styles.partnerName}>{name}</span>
      </div>
    </figure>
  );

  // Only duplicate for marquee if we have enough items
  const shouldAnimate = partners.length > 5;
  const displayPartners = shouldAnimate ? [...partners, ...partners] : partners;

  if (isLoading && partners.length === 0) {
    return (
      <div className={styles.testimonial}>
        <div className={styles.loading}>جاري التحميل...</div>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.testimonial}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        شركاؤنا
      </motion.h2>

      <motion.div 
        style={{ position: "relative", width: "100%" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div
          ref={firstRowRef}
          className={`${styles.marquee} ${!shouldAnimate ? styles.pause : ""}`}
        >
          {displayPartners.map((partner, idx) => (
            <ReviewCard
              key={`${partner.id}-${idx}`}
              logo={partner.logo!}
              name={partner.name}
            />
          ))}
        </div>
        <div className={styles.gradientLeft}></div>
        <div className={styles.gradientRight}></div>
      </motion.div>
    </motion.div>
  );
}
