import { useRef, useState, useEffect } from "react";
import Styles from "./Testimonial.module.css";

type TestimonialProps = {
  img: string;
  name: string;
  username: string;
  body: string;
};

export default function Testimonial() {
  const firstRowRef = useRef(null);
  const secondRowRef = useRef(null);
  const [reviews, setReviews] = useState<TestimonialProps[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/testimonials/featured")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((t: any) => ({
          img: t.user?.img || "/default-avatar.png",
          name: t.user?.full_name || "Anonymous",
          username: t.user?.email || "",
          body: t.body,
        }));
        setReviews(mapped);
      })
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, []);

  const ReviewCard = ({ img, name, username, body }: TestimonialProps) => (
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
        <img src={img} alt={name} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <figcaption>{name}</figcaption>
          <p>{username}</p>
        </div>
      </div>
      <blockquote>{body}</blockquote>
    </figure>
  );

  if (reviews.length === 0) return null;

  const firstRow = [...reviews, ...reviews];
  const secondRow = [...reviews, ...reviews];

  return (
    <div className={Styles.testimonial}>
      <h2>Hear From My Clients</h2>

      <div style={{ position: "relative", width: "100%" }}>
        <div ref={firstRowRef} className={`${Styles.marquee} ${Styles.pause}`}>
          {firstRow.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>

        <div
          ref={secondRowRef}
          className={`${Styles.marquee} ${Styles.reverse} ${Styles.pause}`}
          style={{ marginTop: "1rem" }}
        >
          {secondRow.map((review, idx) => (
            <ReviewCard key={idx} {...review} />
          ))}
        </div>
      </div>
    </div>
  );
}
