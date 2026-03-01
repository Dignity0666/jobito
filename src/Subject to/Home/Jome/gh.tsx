import styles from "./gh.module.css";
import { Search, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import Testimonial from "./Testimonial/Testimonial";
import Categories from "./Categories/Categories";
import heroSectionImage from "../../../assets/WhatsApp Image 2026-02-20 at 12.17.19 AM.jpeg";
import JobsSection from "./JobsSection/JobsSection";
import Partners from "./Partners/Partners";
import JobCard from "./JobCard/JobCard";
import HiringBanner from "./HiringBanner/HiringBanner";

export const Gh = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              Discover <br />
              <span className={styles.purpleText}>more than</span> <br />
              <span className={styles.blueText}>
                5000+ Jobs
                <svg className={styles.underline} viewBox="0 0 300 20">
                  <path
                    d="M5 15 Q 40 5, 80 15 T 160 15 T 240 15 T 300 15"
                    stroke="#26A4FF"
                    fill="transparent"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            </h1>

            <p className={styles.description}>
              Great platform for the job seeker that searching for <br />
              new career heights and passionate about their work.
            </p>

            <div className={styles.searchBar}>
              <div className={styles.inputGroup}>
                <Search className={styles.icon} size={20} />
                <input type="text" placeholder="Job title or keyword" />
              </div>

              <div className={styles.divider}></div>

              <div className={styles.inputGroup}>
                <MapPin className={styles.icon} size={20} />
                <select defaultValue="Florence">
                  <option value="Florence">Florence, Italy</option>
                  <option value="London">London, UK</option>
                </select>
              </div>

              <button className={styles.searchBtn}>Search my job</button>
            </div>

            <p className={styles.popular}>
              <strong>Popular:</strong> UI Designer, UX Researcher, Android,
              Admin
            </p>
          </div>
        </div>
        <img
          src={heroSectionImage}
          alt="Hero Section"
          className={styles.heroImage}
        />
      </section>
      <section className={styles.companiesSection}>
        <Partners />
      </section>
      <Categories />
      <HiringBanner />
      <JobsSection />
      <JobCard />
      <Testimonial />
    </>
  );
};
