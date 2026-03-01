import styles from "./About.module.css";
import { HelpSection } from "../../Subject to/About/helpSection/helpSection";
import { HeroSectionAbout } from "../../Subject to/About/HeroSectionAbout/HeroSectionAbout";
import { ServicesSection } from "../../Subject to/About/Services Section/Services Section";
import { BannerSection } from "../../Subject to/About/Banner Section/Banner Section";
import { ChooseUsSection } from "../../Subject to/About/Choose Us Sectio/ChooseUsSectio";

export const About = () => {

  return (
    <section className={styles.aboutPage}>
      <HeroSectionAbout />
      <ServicesSection />
      <BannerSection />
      <ChooseUsSection />
      <HelpSection />
    </section>
  );
};
