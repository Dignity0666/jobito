import React from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/404_illustration_premium_1775420271131.png";
import { useTranslation } from "../../context/translation-context";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "20px",
        fontFamily: '"Inter", "Roboto", -apple-system, sans-serif',
        textAlign: "center",
      }}
    >
      {/* 404 Illustration */}
        <div style={{ maxWidth: '400px', marginBottom: '40px' }}>
                 <img 
                    src={illustration} 
                    alt="404 Error" 
                    style={{ width: '100%', height: 'auto' }} 
                />
            </div>

      {/* Main Header */}
      <h1
        style={{
          fontSize: "4.5rem",
          fontWeight: "800",
          margin: "0 0 10px 0",
          color: "#1a1a1a",
          letterSpacing: "-1px",
        }}
      >
        {t("Ooops!")}
      </h1>

      {/* Subheader */}
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          margin: "0 0 15px 0",
          color: "#2d2d2d",
        }}
      >
        {t("Looks like you're in the wrong place.")}
      </h2>

      {/* Secondary Text */}
      <p
        style={{
          fontSize: "1rem",
          color: "#888888",
          marginBottom: "40px",
          fontWeight: "500",
        }}
      >
        {t("We can't find the page you're looking for...")}
      </p>

      {/* Action Link */}
      <div
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "1.1rem",
          fontWeight: "700",
          color: "#000000",
          textDecoration: "none",
          paddingBottom: "8px",
          borderBottom: "2px solid #000000",
          transition: "opacity 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <span style={{ fontSize: "1.4rem" }}>&rarr;</span>
        <span>{t("Take me home")}</span>
      </div>
    </div>
  );
};

export default NotFound;
