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
    <footer className="footer" dir="ltr">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand, Description & Social Media */}
          <div className="footer-brand-section">
            <h2 className="footer-logo">Jobito</h2>
            <p className="footer-description">
              جوبيتو (Jobito) هي منصتك المتكاملة لاكتشاف أفضل فرص العمل والتواصل مع كبرى الشركات الرائدة. نحن هنا لتمكين طموحك المهني ومساعدتك في بناء المستقبل الذي تستحقه.
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
                { 
                  label: "Instagram", 
                  icon: <FaInstagram size={18} />, 
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
            <h3 className="footer-heading">للمرشحين</h3>
            <ul className="footer-links">
              <li>تصفح الوظائف</li>
              <li>دليل الشركات</li>
              <li>إنشاء سيرة ذاتية</li>
              <li>نصائح مهنية</li>
              <li>حاسبة الرواتب</li>
            </ul>
          </div>

          {/* Column 3: For Employers / لأصحاب العمل */}
          <div className="footer-column">
            <h3 className="footer-heading">لأصحاب العمل</h3>
            <ul className="footer-links">
              <li>نشر وظيفة جديدة</li>
              <li>البحث عن مرشحين</li>
              <li>باقات التوظيف</li>
              <li>إدارة المتقدمين</li>
            </ul>
          </div>

          {/* Column 4: Support & Legal / المنصة والدعم */}
          <div className="footer-column">
            <h3 className="footer-heading">عن المنصة والمساعدة</h3>
            <ul className="footer-links">
              <li>من نحن</li>
              <li>تواصل معنا</li>
              <li>الأسئلة الشائعة</li>
              <li>الشروط والأحكام</li>
              <li>سياسة الخصوصية</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p className="copyright">© 2026 Jobito. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
