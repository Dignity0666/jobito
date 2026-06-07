import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import type { FC } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { useTranslation } from "../../context/translation-context";

const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand, Description & Social Media */}
          <div className="footer-brand-section">
            <h2 className="footer-logo">Jobito</h2>
            <p className="footer-description">
              {t("Jobito هي منصتك المتكاملة لاكتشاف أفضل فرص العمل والتواصل مع كبرى الشركات الرائدة. نحن هنا لتمكين طموحك المهني ومساعدتك في بناء المستقبل الذي تستحقه.")}
            </p>
            <div className="social-links">
              {[
                { 
                  label: "WhatsApp", 
                  icon: <FaWhatsapp size={18} />, 
                  href: "https://wa.me/201009913865" 
                },
                { 
                  label: "LinkedIn", 
                  icon: <FaLinkedinIn size={18} />, 
                  href: "https://www.linkedin.com/jobs/" 
                },
                { 
                  label: "Facebook", 
                  icon: <FaFacebookF size={18} />, 
                  href: "#" 
                },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  className="social-icon"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: For Candidates / للمرشحين */}
          <div className="footer-column">
            <h3 className="footer-heading">{t("للمرشحين")}</h3>
            <ul className="footer-links">
              <li><Link to="/ai-chat" style={{color: 'inherit', textDecoration: 'none'}}>{t("نصائح مهنية")}</Link></li>
              <li><Link to="/Find Jobs" style={{color: 'inherit', textDecoration: 'none'}}>{t("تصفح الوظائف")}</Link></li>
              <li><Link to="/Browse Companies" style={{color: 'inherit', textDecoration: 'none'}}>{t("دليل الشركات")}</Link></li>
            </ul>
          </div>

          {/* Column 3: For Employers / لأصحاب العمل */}
          <div className="footer-column">
            <h3 className="footer-heading">{t("لأصحاب العمل")}</h3>
            <ul className="footer-links">
              <li><Link to="/user-information" state={{ showLogin: false, isCustomer: false }} style={{color: 'inherit', textDecoration: 'none'}}>{t("نشر وظيفة جديدة")}</Link></li>
              <li><Link to="/Find Jobs?category=Tradesman" style={{color: 'inherit', textDecoration: 'none'}}>{t("البحث عن مقدمي الخدمة")}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">{t("عن المنصة والمساعدة")}</h3>
            <ul className="footer-links">
              <li><Link to="/about" style={{color: 'inherit', textDecoration: 'none'}}>{t("من نحن")}</Link></li>
              <li><Link to="/contact" style={{color: 'inherit', textDecoration: 'none'}}>{t("تواصل معنا")}</Link></li>
              <li><Link to="/ai-chat" style={{color: 'inherit', textDecoration: 'none'}}>{t("الأسئلة الشائعة")}</Link></li>
              <li>{t("الشروط والأحكام")}</li>
              <li><Link to="/privacy-policy" style={{color: 'inherit', textDecoration: 'none'}}>{t("سياسة الخصوصية")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 Jobito. {t("جميع الحقوق محفوظة.")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
