import React from "react";
import "./StripeSection.css";
import image from "../../../assets/Img/StripeSection/image.png";
import pathtoyourlargeimage from "../../../assets/Img/StripeSection/image.png";
import pathtosmallimage1 from "../../../assets/Img/StripeSection/image1.png";
import pathtosmallimage2 from "../../../assets/Img/StripeSection/image2.png";

const StripeSection: React.FC = () => {
  return (
    <div className="stripe-container">
      <div className="content-side">
        <div className="content-wrapper">
          <div className="logo-wrapper">
            <img src={image} alt="Stripe Logo" className="stripe-logo" />
          </div>
          <div className="header-link">
            <h2>Stripe</h2>
            <a href="#" className="read-more">
              Read more about Stripe <span>→</span>
            </a>
          </div>
        </div>
        <p className="description">
          Stripe is a technology company that builds economic infrastructure for
          the internet. Businesses of every size—from new startups to public
          companies—use our software to accept payments and manage their
          businesses online.
        </p>
      </div>

      <div className="image-side">
        <div className="main-image">
          <img src={pathtoyourlargeimage} alt="Team meeting" />
        </div>
        <div className="side-images">
          <img src={pathtosmallimage1} alt="Discussion" />
          <img src={pathtosmallimage2} alt="Working on dashboard" />
        </div>
      </div>
    </div>
  );
};

export default StripeSection;
