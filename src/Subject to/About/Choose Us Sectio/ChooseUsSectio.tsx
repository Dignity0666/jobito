import { BarChart3, Rocket, Shield, Sparkles } from "lucide-react";
import styles from "./ChooseUsSection.module.css";
import { useEffect, useRef, useState } from "react";

export const ChooseUsSection = () => {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observers: any = {};

    Object.keys(sectionRefs.current).forEach((key) => {
      observers[key] = new IntersectionObserver(
        ([entry]) => {
          setIsVisible((prev) => ({ ...prev, [key]: entry.isIntersecting }));
        },
        { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
      );

      if (sectionRefs.current[key]) {
        observers[key].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer: any) =>
        observer.disconnect(),
      );
    };
  }, []);
  const features = [
    {
      title: "Elegant and Modern Design",
      description:
        "The designs we make are designs that are trending. Our team makes sure your website always looks good.",
      icon: <Sparkles className={styles.featureIcon} />,
      color: "#FF6B6B",
    },
    {
      title: "Data is always Safe",
      description:
        "We finally found a host that truly understood the unique secure lens need to know basis found a host that truly know.",
      icon: <Shield className={styles.featureIcon} />,
      color: "#4ECDC4",
    },
    {
      title: "High-End Analyzing",
      description:
        "Share processes and data secure lens need to know basis. Our team assured your website is always safe and secure.",
      icon: <BarChart3 className={styles.featureIcon} />,
      color: "#A78BFA",
      highlighted: true,
    },
    {
      title: "Our Dedicated Support",
      description:
        "We finally found a host that truly understood the unique secure lens need to know basis found a host that truly know.",
      icon: <Rocket className={styles.featureIcon} />,
      color: "#FFA26B",
    },
  ];

  return (
    <section
      className={styles.whyUsSection}
      ref={(el) => (sectionRefs.current.whyUs = el)}
    >
      <div className={styles.container}>
        <div className={styles.headerTop}>
          <span className={styles.subtitle}>Best software</span>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((item, index) => (
            <div
              key={index}
              className={`${styles.featureCard} ${item.highlighted ? styles.highlighted : ""} ${isVisible.whyUs ? styles.visible : ""}`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div
                className={styles.featureIconWrapper}
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div
                  className={styles.featureIconContainer}
                  style={{ color: item.color }}
                >
                  {item.icon}
                </div>
              </div>

              <div className={styles.featureContent}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className={styles.featureHoverEffect}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
