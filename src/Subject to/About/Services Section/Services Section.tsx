import {
  Users,
  Building2,
  Briefcase,
  Target,
  HeadphonesIcon,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";
import styles from "./Services Section.module.css";
import { motion } from "framer-motion";

// ✅ Header variants
const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ✅ Grid container — stagger على الكاردات
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

// ✅ كل كارت بيطلع من تحت
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const ServicesSection = () => {
  const services = [
    {
      title: "Workplace Efficiency",
      description:
        "We provide workplace coaching across all levels of the business, helping individuals reach their potential and achieve workplace success.",
      icon: <Users className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Organisational and Structural Redesign",
      description:
        "We support businesses with reshaping and realigning their business model and structure to adapt to the rapidly changing world we live in.",
      icon: <Building2 className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Career Enhancement Services",
      description:
        "Career transitioning can be a daunting experience. We can help you gain confidence and find your potential, landing you the job you desire.",
      icon: <Briefcase className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Talent Acquisition & Onboarding",
      description:
        "Our team of specialists are dedicated to finding you professionals with the right skills and attitude that will help take your business to the next level.",
      icon: <Target className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "General HR Support",
      description:
        "We provide a range of generalist HR and people administration support. Whether it's over the phone, via email or in person, we've got the knowledge.",
      icon: <HeadphonesIcon className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Managing Performance",
      description:
        "When your organisation gets performance management right, your people will work together cohesively to reach your companies objectives.",
      icon: <TrendingUp className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    {
      title: "Strategic Planning",
      description:
        "We help you develop and implement strategic HR initiatives that align with your business goals and drive sustainable growth.",
      icon: <Zap className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      title: "Employee Engagement",
      description:
        "Create a thriving workplace culture with our employee engagement programs designed to boost productivity and retention.",
      icon: <Star className={styles.serviceIcon} />,
      gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    },
  ];

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>

        {/* ✅ Section Header — بيظهر لما يدخل الشاشة */}
        <motion.div
          className={styles.sectionHeader}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2>
            Services <span>We Offer</span>
          </h2>
          <p>Freedom HR provides custom HR solutions for your business...</p>
        </motion.div>

        {/* ✅ Cards Grid — stagger واحدة ورا التانية */}
        <motion.div
          className={styles.servicesGrid}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.serviceCard}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.25, ease: "easeOut" },
              }}
            >
              <div className={styles.serviceCardInner}>

                {/* Front */}
                <div className={styles.serviceFront}>
                  <motion.div
                    className={styles.serviceIconWrapper}
                    style={{ background: service.gradient }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3>{service.title}</h3>
                  <p>{service.description.substring(0, 80)}...</p>
                  <span className={styles.serviceHoverHint}>Hover to learn more</span>
                </div>

                {/* Back */}
                <div
                  className={styles.serviceBack}
                  style={{ background: service.gradient }}
                >
                  <div className={styles.serviceBackContent}>
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <motion.button
                      className={styles.serviceBackButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read More
                    </motion.button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};