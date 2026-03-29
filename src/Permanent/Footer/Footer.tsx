import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import type { FC } from "react";
import "./Footer.css";

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <h2 className="footer-logo">Jobito</h2>
            </div>

            <p className="footer-description">
              نحن نساعدك في العثور على وظيفة أحلامك وتطوير مهاراتك المهنية من خلال منصتنا المتكاملة.
            </p>

            {/* Social Media */}
            <div className="social-links">
              {[
                { 
                  label: "WhatsApp", 
                  icon: <FaWhatsapp size={24} />, 
                  href: "https://wa.me/201009913865" 
                },
                { 
                  label: "LinkedIn", 
                  icon: <FaLinkedinIn size={24} />, 
                  href: "https://www.linkedin.com/jobs/" 
                },
                { 
                  label: "Facebook", 
                  icon: <FaFacebookF size={24} />, 
                  href: "" 
                },
                { 
                  label: "Instagram", 
                  icon: <FaInstagram size={24} />, 
                  href: "#" 
                },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.href.startsWith("https") ? "_blank" : undefined}
                  rel={link.href.startsWith("https") ? "noopener noreferrer" : undefined}
                  aria-label={link.label}
                  className="social-icon"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Our Company */}
          <div className="footer-column">
            <h3 className="footer-heading">شركتنا</h3>
            <ul className="footer-links">
              <li>خدماتنا</li>
              <li>مشاريعنا</li>
              <li>دورات تدريبية</li>
              <li>فعاليات</li>
            </ul>
          </div>

          {/* Courses & Training */}
          <div className="footer-column">
            <h3 className="footer-heading">الدورات والتدريب</h3>
            <ul className="footer-links">
              <li>واجهة المستخدم (Front-end)</li>
              <li>الخلفية البرمجية (Back-end)</li>
              <li>تطبيقات الموبايل</li>
              <li>تطوير شامل (Full Stack)</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 jobito. جميع الحقوق محفوظة</p>
          <div className="footer-legal-links">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">شروط الخدمة</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

