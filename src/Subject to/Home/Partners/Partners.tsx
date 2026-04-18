import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Partners.module.css";
import { useTranslation } from "../../../context/translation-context";

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

// Egyptian companies as featured partners
const EGYPTIAN_PARTNERS: Partner[] = [
  { id: -1, name: "فودافون مصر", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/239px-Vodafone_icon.svg.png" },
  { id: -2, name: "اتصالات مصر", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Etisalat_logo.svg/2560px-Etisalat_logo.svg.png" },
  { id: -3, name: "البنك الأهلي المصري", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/National_Bank_of_Egypt.svg/1200px-National_Bank_of_Egypt.svg.png" },
  { id: -4, name: "أورانج مصر", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2048px-Orange_logo.svg.png" },
  { id: -5, name: "طلبات", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Talabat_logo.svg/2560px-Talabat_logo.svg.png" },
  { id: -6, name: "سويفل", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Swvl_logo.png/800px-Swvl_logo.png" },
  { id: -7, name: "فوري", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Fawry_logo.png/1200px-Fawry_logo.png" },
  { id: -8, name: "WE", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Telecom_Egypt_We_logo.svg/2560px-Telecom_Egypt_We_logo.svg.png" },
];

export default function Partners() {
  const { t } = useTranslation();
  const [partners, setPartners] = useState<Partner[]>(EGYPTIAN_PARTNERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/companies?limit=20`);
        if (!response.ok) throw new Error("Failed to fetch partners");
        const result = await response.json();
        
        const data: BackendCompany[] = Array.isArray(result) ? result : (result.data || []);

        const mappedPartners = data.map((c) => ({
          id: Number(c.companyId),
          name: c.name,
          logo: c.logoUrl 
            ? (c.logoUrl.startsWith("http") ? c.logoUrl : `${API_BASE_URL}${c.logoUrl}`)
            : undefined,
        }));

        // Combine DB results with Egyptian partners
        const combined = [...mappedPartners, ...EGYPTIAN_PARTNERS.slice(0, Math.max(0, 10 - mappedPartners.length))];
        setPartners(combined);

      } catch (err) {
        console.error("Error loading partners:", err);
        setPartners(EGYPTIAN_PARTNERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const ReviewCard = ({ logo, name }: { logo?: string; name: string }) => (
    <figure className={`${styles.reviewCard} ${!logo ? styles.nameOnly : ""}`} title={t(name)}>
      {logo ? (
        <img src={logo} alt={t(name)} className={styles.partnerLogo} />
      ) : (
        <span className={styles.partnerName}>{t(name)}</span>
      )}
    </figure>
  );

  // We always duplicate for seamless infinite scroll
  const row = [...partners, ...partners];

  if (isLoading && partners.length === 0) {
    return (
      <div className={styles.testimonial}>
        <div className={styles.loading}>{t("جاري تحميل الشركاء...")}</div>
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
        {t("نثق بهم ويثقون بنا")}
      </motion.h2>

      <motion.div 
        className={styles.marqueeContainer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Row 1: scrolls left */}
        <div className={styles.marquee}>
          <div className={styles.marqueeInner}>
            {row.map((partner, idx) => (
              <ReviewCard
                key={`row1-${partner.id}-${idx}`}
                logo={partner.logo}
                name={partner.name}
              />
            ))}
          </div>
        </div>

        {/* Row 2: scrolls right (reverse) */}
        <div className={`${styles.marquee} ${styles.marqueeReverse}`}>
          <div className={`${styles.marqueeInner} ${styles.marqueeInnerReverse}`}>
            {row.map((partner, idx) => (
              <ReviewCard
                key={`row2-${partner.id}-${idx}`}
                logo={partner.logo}
                name={partner.name}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
