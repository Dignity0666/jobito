import ahly from "../assets/SVG/al-ahly-egypt.svg";
import bmw from "../assets/SVG/bmw-7.svg";
import air from "../assets/SVG/egypt-air.svg";
import mcdonalds from "../assets/SVG/mcdonalds-1.svg";
import edited from "../assets/SVG/edited-image-1771542976626.svg";

export interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    title: "Frontend Developer",
    company: "Tech Solutions Ltd.",
    period: "2021 - 2023",
    responsibilities: [
      "Developed responsive web interfaces using React, TailwindCSS, and TypeScript for multiple client projects.",
      "Optimized website performance, improving page load speed by 40%.",
      "Collaborated with designers and backend developers to implement new features.",
      "Maintained component libraries to ensure consistency across projects.",
    ],
  },
  {
    title: "Backend Developer",
    company: "AutoDrive Co.",
    period: "2023 - 2024",
    responsibilities: [
      "Designed and implemented RESTful APIs to support vehicle telemetry and cloud integration.",
      "Ensured data security and compliance with automotive safety standards (ISO 26262).",
      "Developed automated workflows for real-time diagnostics and remote vehicle control.",
      "Integrated third-party services for payments, notifications, and analytics.",
    ],
  },
  {
    title: "Freelance Fullstack Developer",
    company: "Self-Employed",
    period: "2025 - Present",
    responsibilities: [
      "Built and deployed client projects using React, Next.js, Node.js, and MongoDB.",
      "Designed interactive dashboards and admin panels for SMEs and startups.",
      "Implemented authentication, role-based access, and secure payment integrations.",
      "Continuously upgrading technical skills and exploring modern web technologies.",
    ],
  },
];

export interface Review {
  name: string;
  username: string;
  body: string;
  img: string;
}
export interface Partner {
  logo: string;
}

export const reviews: Review[] = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://robohash.org/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://robohash.org/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://robohash.org/john",
  },
  {
    name: "Alice",
    username: "@alice",
    body: "This is hands down the best thing I've experienced. Highly recommend!",
    img: "https://robohash.org/alice",
  },
  {
    name: "Bob",
    username: "@bob",
    body: "Incredible work! The attention to detail is phenomenal.",
    img: "https://robohash.org/bob",
  },
  {
    name: "Charlie",
    username: "@charlie",
    body: "This exceeded all my expectations. Absolutely stunning!",
    img: "https://robohash.org/charlie",
  },
  {
    name: "Dave",
    username: "@dave",
    body: "Simply breathtaking. The best decision I've made in a while.",
    img: "https://robohash.org/dave",
  },
  {
    name: "Eve",
    username: "@eve",
    body: "So glad I found this. It has changed the game for me.",
    img: "https://robohash.org/eve",
  },
];

export const Partners: Partner[] = [
  {
    logo: ahly,
  },
  {
    logo: bmw,
  },
  {
    logo: air,
  },
  {
    logo: mcdonalds,
  },
  {
    logo: edited,
  },
  {
    logo: ahly,
  },
  {
    logo: ahly,
  },
  {
    logo: ahly,
  },
  {
    logo: ahly,
  },
];
