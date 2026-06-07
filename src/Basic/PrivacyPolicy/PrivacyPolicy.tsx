import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../context/translation-context";
import { useTheme } from "../../context/ThemeContext";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = () => {
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
          <h1 className={styles.title}>{t("سياسة الخصوصية", "Privacy Policy")}</h1>
          <p className={styles.subtitle}>
            {t(
              "نحن نهتم بخصوصيتك ونلتزم بحماية بياناتك الشخصية.",
              "We care about your privacy and are committed to protecting your personal data."
            )}
          </p>
        </motion.div>

        <motion.div className={styles.contentCard} variants={itemVariants}>
          <section className={styles.section}>
            <h2>{t("1. جمع المعلومات", "1. Information Collection")}</h2>
            <p>
              {t(
                "نحن نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل في المنصة، مثل الاسم، البريد الإلكتروني، ورقم الهاتف. بالإضافة إلى ذلك، نقوم بجمع معلومات حول استخدامك للمنصة لتحسين تجربتك.",
                "We collect the information you provide to us directly when registering on the platform, such as name, email, and phone number. In addition, we collect information about your use of the platform to improve your experience."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("2. استخدام المعلومات", "2. Use of Information")}</h2>
            <p>
              {t(
                "تُستخدم المعلومات التي نجمعها لتقديم خدماتنا وتحسينها، لتخصيص تجربتك، للتواصل معك بخصوص تحديثات الخدمة، ولضمان أمان حسابك. نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية دون موافقتك.",
                "The information we collect is used to provide and improve our services, customize your experience, communicate with you regarding service updates, and ensure your account security. We do not sell or share your personal information with third parties for marketing purposes without your consent."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("3. أمان البيانات", "3. Data Security")}</h2>
            <p>
              {t(
                "نحن نتخذ إجراءات أمنية صارمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. نستخدم تقنيات تشفير متقدمة لضمان بقاء معلوماتك آمنة.",
                "We take strict security measures to protect your data from unauthorized access, modification, disclosure, or destruction. We use advanced encryption technologies to ensure your information remains secure."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("4. حقوقك", "4. Your Rights")}</h2>
            <p>
              {t(
                "لديك الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها، وتحديثها، أو طلب حذفها. يمكنك إدارة تفضيلات الخصوصية الخاصة بك من خلال إعدادات حسابك في أي وقت.",
                "You have the right to access, update, or request deletion of your personal information that we hold. You can manage your privacy preferences through your account settings at any time."
              )}
            </p>
          </section>

          <section className={styles.section}>
            <h2>{t("5. التغييرات على هذه السياسة", "5. Changes to This Policy")}</h2>
            <p>
              {t(
                "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإعلامك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ 'آخر تحديث' في الأعلى.",
                "We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last updated' date at the top."
              )}
            </p>
          </section>

          <div className={styles.footerNote}>
            <p>
              {t("إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى", "If you have any questions about this privacy policy, please")}{" "}
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

export default PrivacyPolicy;
