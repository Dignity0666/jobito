import { useRef } from "react";
import { Partners } from "../../../../Data/index";
import Styles from "./Partners.module.css";

type TestimonialProps = {
  logo: string;
};

export default function Testimonial() {
  const firstRowRef = useRef(null);

  const ReviewCard = ({ logo }: TestimonialProps) => (
    <figure
      className={Styles.reviewCard}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
      >
        <img src={logo} alt="Partner" />
      </div>
    </figure>
  );

  const firstRow = [...Partners, ...Partners];
  return (
    <div className={Styles.testimonial}>
      <h2>Hear From My Partners</h2>

      <div style={{ position: "relative", width: "100%" }}>
        <div ref={firstRowRef} className={`${Styles.marquee} ${Styles.pause}`}>
          {firstRow.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>
        <div className={Styles.gradientLeft}></div>
        <div className={Styles.gradientRight}></div>
      </div>
    </div>
  );
}
