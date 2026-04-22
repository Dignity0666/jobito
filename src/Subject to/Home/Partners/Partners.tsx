import { useState } from "react";
import Marquee from "react-fast-marquee";
import { useTranslation } from "../../../context/translation-context";
import styles from "./Partners.module.css";

type Partner = {
  id: number;
  name: string;
  logo?: string;
};

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
  const [partners] = useState<Partner[]>(EGYPTIAN_PARTNERS);

  // Company names are proper nouns — do NOT translate them
  // This prevents animation clash when the translation service updates
  const ReviewCard = ({ logo, name }: { logo?: string; name: string }) => (
    <figure className={`${styles.reviewCard} ${!logo ? styles.nameOnly : ""}`} title={name}>
      {logo ? (
        <img src={logo} alt={name} className={styles.partnerLogo} />
      ) : (
        <span className={styles.partnerName}>{name}</span>
      )}
    </figure>
  );

  return (
    <div className={styles.testimonial}>
      <h2>
        {t("نثق بهم ويثقون بنا")}
      </h2>

      <div className={styles.marqueeContainer}>
        {/* Row 1: scrolls left */}
        <Marquee
          pauseOnHover={true}
          speed={40}
          gradient={false}
          direction="left"
          className={styles.marqueeBand}
        >
          {partners.map((partner, idx) => (
            <ReviewCard
              key={`row1-${partner.id}-${idx}`}
              logo={partner.logo}
              name={partner.name}
            />
          ))}
        </Marquee>

        {/* Row 2: scrolls right (reverse) */}
        <Marquee
          pauseOnHover={true}
          speed={40}
          gradient={false}
          direction="right"
          className={styles.marqueeBand}
        >
          {/* Reversing the array slightly varies the second row if preferred, 
              but using the same mapping is absolutely fine. */}
          {partners.map((partner, idx) => (
            <ReviewCard
              key={`row2-${partner.id}-${idx}`}
              logo={partner.logo}
              name={partner.name}
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
