import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../context/translation-context";
import { useTheme } from "../../context/ThemeContext";
import styles from "./TermsAndConditions.module.css";

const TermsAndConditions = () => {
  const { t, language } = useTranslation();
  const { isDark } = useTheme();
  const isRTL = language === "ar";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className={`${styles.pageWrapper} ${isDark ? styles.dark : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Decorative Background Elements */}
      <div className={styles.bgBlob1}></div>
      <div className={styles.bgBlob2}></div>

      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>{t("الشروط والأحكام", "Terms and Conditions")}</h1>
          <p className={styles.subtitle}>
            {t(
              "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة جوبيتو.",
              "Please read these terms and conditions carefully before using the Jobito platform."
            )}
          </p>
        </motion.div>

        <motion.div className={styles.contentCard} variants={itemVariants}>
          <section className={styles.section}>
            <h2>{t("1. قبول الشروط", "1. Acceptance of Terms")}</h2>
            <p>
              {t(
                "بدخولك إلى منصة جوبيتو واستخدامها، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يحق لك استخدام خدماتنا.",
                "By accessing and using the Jobito platform, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, you may not use our services."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("2. استخدام المنصة", "2. Use of Platform")}</h2>
            <p>
              {t(
                "يجب استخدام المنصة للأغراض القانونية فقط. يُمنع استخدام المنصة لنشر محتوى مسيء، غير قانوني، أو ينتهك حقوق الآخرين. نحتفظ بالحق في إيقاف أو تقييد وصولك إلى المنصة في حال انتهاك هذه الشروط.",
                "The platform must be used for lawful purposes only. You are prohibited from using the platform to post offensive, illegal, or copyright-infringing content. We reserve the right to suspend or restrict your access to the platform if you violate these terms."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("3. حسابات المستخدمين", "3. User Accounts")}</h2>
            <p>
              {t(
                "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك. يرجى إبلاغنا فورًا بأي استخدام غير مصرح به لحسابك.",
                "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. Please notify us immediately of any unauthorized use of your account."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("4. حقوق الملكية الفكرية", "4. Intellectual Property Rights")}</h2>
            <p>
              {t(
                "جميع المحتويات المتوفرة على المنصة، بما في ذلك النصوص والرسومات والشعارات والبرمجيات، هي ملك لمنصة جوبيتو ومحمية بموجب قوانين حقوق الطبع والنشر.",
                "All content available on the platform, including text, graphics, logos, and software, is the property of the Jobito platform and is protected by copyright laws."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("5. إخلاء المسؤولية", "5. Disclaimer")}</h2>
            <p>
              {t(
                "يتم تقديم خدمات المنصة 'كما هي'. نحن لا نضمن أن المنصة ستكون خالية من الأخطاء أو الانقطاعات. لا نتحمل المسؤولية عن أي خسائر أو أضرار ناتجة عن استخدام المنصة.",
                "The platform's services are provided 'as is'. We do not guarantee that the platform will be error-free or uninterrupted. We are not liable for any losses or damages resulting from the use of the platform."
              )}
            </p>
          </section>

          <div className={styles.footerNote}>
            <p>
              {t("إذا كان لديك أي أسئلة حول الشروط والأحكام، يرجى", "If you have any questions about these terms and conditions, please")}{" "}
              <a href="/contact" className={styles.link}>
                {t("التواصل معنا", "contact us")}
              </a>
              .
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
