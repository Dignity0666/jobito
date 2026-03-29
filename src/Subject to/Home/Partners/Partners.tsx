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
        const response = await fetch(`${API_BASE_URL}/companies?limit=20`);
        if (!response.ok) throw new Error("Failed to fetch partners");
        const result = await response.json();
        
        // Handle NestJS response format: { data: BackendCompany[], ... }
        const data: BackendCompany[] = Array.isArray(result) ? result : (result.data || []);

        const mappedPartners = data.map((c) => ({
          id: Number(c.companyId),
          name: c.name,
          logo: c.logoUrl 
            ? (c.logoUrl.startsWith("http") ? c.logoUrl : `${API_BASE_URL}${c.logoUrl}`)
            : null, // Set to null if no logo to trigger fallback
        }));

        // Default "Featured" Partners
        const featured: Partner[] = [
          { id: -1, name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
          { id: -2, name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png" },
          { id: -3, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" },
          { id: -4, name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png" },
          { id: -5, name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
          { id: -6, name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" },
        ];

        // Combine DB results with featured partners for a fuller list
        const combined = [...mappedPartners, ...featured.slice(0, Math.max(0, 8 - mappedPartners.length))];
        setPartners(combined);

      } catch (err) {
        console.error("Error loading partners:", err);
        // Fallback to featured on error
        setPartners([
          { id: -1, name: "Google", logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
          { id: -2, name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png" },
          { id: -3, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const ReviewCard = ({ logo, name }: { logo?: string; name: string }) => (
    <figure className={`${styles.reviewCard} ${!logo ? styles.nameOnly : ""}`} title={name}>
      {logo ? (
        <img src={logo} alt={name} className={styles.partnerLogo} />
      ) : (
        <span className={styles.partnerName}>{name}</span>
      )}
    </figure>
  );

  // Marquee needs at least a few items to look good
  const shouldAnimate = partners.length > 3;
  // Duplicate for seamless scroll
  const displayPartners = shouldAnimate ? [...partners, ...partners, ...partners] : partners;

  if (isLoading && partners.length === 0) {
    return (
      <div className={styles.testimonial}>
        <div className={styles.loading}>جاري تحميل الشركاء...</div>
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
        نوثق بهم ويثقون بنا
      </motion.h2>

      <motion.div 
        className={styles.marqueeContainer}
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
              logo={partner.logo}
              name={partner.name}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
