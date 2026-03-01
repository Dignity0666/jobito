import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f6fa;
    --card: #ffffff;
    --primary: #5b4fcf;
    --primary-soft: #ede9ff;
    --accent: #f72585;
    --text: #18181b;
    --sub: #52525b;
    --muted: #a1a1aa;
    --border: #e4e4e7;
    --shadow: 0 2px 20px rgba(91,79,207,0.07);
    --radius: 20px;
    --tag-bg: #f0f0f8;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    padding: 32px 16px;
  }

  .page {
    max-width: 860px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 20px;
    align-items: start;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }

  .left { display: flex; flex-direction: column; gap: 16px; }
  .right { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

  /* Card base */
  .card {
    background: var(--card);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .card-body { padding: 22px 24px; }

  .card-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 16px;
  }

  .card-title {
    font-size: 15px; font-weight: 700; color: var(--text);
  }

  .edit-btn {
    width: 32px; height: 32px; border-radius: 10px;
    border: 1px solid var(--border); background: var(--card);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 14px;
    transition: all 0.15s;
  }
  .edit-btn:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

  .plus-btn {
    width: 28px; height: 28px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 18px; line-height: 1;
    transition: all 0.15s;
  }
  .plus-btn:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

  /* ===== HERO CARD ===== */
  .hero-card { overflow: hidden; }

  .hero-banner {
    height: 100px;
    background: linear-gradient(120deg, #c9b8ff 0%, #9d8fff 40%, #f0abfc 70%, #fda4af 100%);
    position: relative;
  }

  .hero-banner .share-icon {
    position: absolute; top: 12px; right: 12px;
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255,255,255,0.3); backdrop-filter: blur(4px);
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: white; font-size: 15px;
  }

  .hero-body {
    padding: 0 24px 22px;
    display: flex;
    align-items: flex-end;
    gap: 16px;
    position: relative;
  }

  .avatar-wrap {
    position: relative; margin-top: -32px; flex-shrink: 0;
  }

  .avatar {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid white;
    background: linear-gradient(135deg, #c9b8ff, #9d8fff);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 800; color: white;
    box-shadow: 0 4px 16px rgba(91,79,207,0.25);
    overflow: hidden;
  }

  .avatar img { width: 100%; height: 100%; object-fit: cover; }

  .hero-info { flex: 1; padding-top: 12px; }
  .hero-name { font-size: 20px; font-weight: 800; margin-bottom: 2px; }
  .hero-role { font-size: 13px; color: var(--sub); margin-bottom: 6px; }
  .hero-role span { font-weight: 700; color: var(--primary); }
  .hero-loc { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 5px; }

  .hero-actions {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding-top: 12px;
  }

  .edit-profile-btn {
    padding: 7px 16px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px; font-weight: 600; color: var(--text);
    cursor: pointer; transition: all 0.15s;
  }
  .edit-profile-btn:hover { border-color: var(--primary); color: var(--primary); }

  .open-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 20px;
    background: #dcfce7; border: 1px solid #bbf7d0;
    font-size: 11px; font-weight: 700; color: #15803d;
    cursor: pointer;
  }

  .open-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }

  /* ===== ABOUT ===== */
  .about-text {
    font-size: 13px; line-height: 1.75; color: var(--sub);
  }

  .about-text .expanded { display: block; }
  .about-text .collapsed { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  .show-more {
    margin-top: 8px; font-size: 13px; font-weight: 600;
    color: var(--primary); background: none; border: none;
    cursor: pointer; padding: 0;
  }

  /* ===== EXPERIENCE ===== */
  .exp-item {
    display: flex; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid var(--border);
    animation: fadeUp 0.3s ease both;
  }
  .exp-item:last-child { border-bottom: none; padding-bottom: 0; }
  .exp-item:first-child { padding-top: 0; }

  .exp-logo {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--tag-bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }

  .exp-content { flex: 1; }
  .exp-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .exp-title { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .exp-company { font-size: 12px; color: var(--sub); margin-bottom: 2px; }
  .exp-period { font-size: 11px; color: var(--muted); }
  .exp-loc { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .exp-desc { font-size: 12.5px; color: var(--sub); line-height: 1.65; }

  .show-more-link {
    font-size: 13px; font-weight: 600; color: var(--primary);
    background: none; border: none; cursor: pointer; padding: 12px 0 0;
    display: block; text-align: center; width: 100%;
    border-top: 1px solid var(--border);
  }
  .show-more-link:hover { text-decoration: underline; }

  /* ===== EDUCATION ===== */
  .edu-item {
    display: flex; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .edu-item:last-child { border-bottom: none; padding-bottom: 0; }
  .edu-item:first-child { padding-top: 0; }

  .edu-logo {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0; background: var(--tag-bg);
    border: 1px solid var(--border);
  }

  .edu-school { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .edu-degree { font-size: 12px; color: var(--sub); margin-bottom: 2px; }
  .edu-period { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .edu-desc { font-size: 12.5px; color: var(--sub); line-height: 1.65; }

  /* ===== SKILLS ===== */
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }

  .skill-tag {
    padding: 6px 14px; border-radius: 20px;
    background: var(--tag-bg); border: 1px solid var(--border);
    font-size: 12px; font-weight: 600; color: var(--sub);
    cursor: pointer; transition: all 0.15s;
  }
  .skill-tag:hover { background: var(--primary-soft); color: var(--primary); border-color: var(--primary); }

  /* ===== PORTFOLIO ===== */
  .portfolio-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  }

  .portfolio-item {
    border-radius: 12px; overflow: hidden; aspect-ratio: 4/3;
    cursor: pointer; position: relative;
    background: linear-gradient(135deg, #f0e6ff, #e6eeff);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--border);
  }

  .portfolio-item:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,79,207,0.15); }

  .portfolio-thumb {
    width: 100%; height: 100%; display: flex;
    align-items: center; justify-content: center;
    font-size: 28px;
  }

  .portfolio-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0);
    display: flex; align-items: flex-end; padding: 8px;
    transition: background 0.2s;
  }

  .portfolio-item:hover .portfolio-overlay { background: rgba(91,79,207,0.75); }

  .portfolio-label {
    font-size: 10px; font-weight: 700; color: transparent;
    line-height: 1.3; text-shadow: none;
    transition: color 0.2s;
  }

  .portfolio-item:hover .portfolio-label { color: white; }

  /* ===== RIGHT SIDEBAR ===== */
  .detail-row {
    display: flex; align-items: flex-start; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-row:first-child { padding-top: 0; }

  .detail-icon {
    width: 32px; height: 32px; border-radius: 10px;
    background: var(--tag-bg); display: flex; align-items: center;
    justify-content: center; font-size: 14px; flex-shrink: 0;
  }

  .detail-label { font-size: 11px; color: var(--muted); margin-bottom: 2px; }
  .detail-val { font-size: 13px; font-weight: 600; color: var(--text); }

  .social-row {
    display: flex; align-items: center; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .social-row:last-child { border-bottom: none; padding-bottom: 0; }
  .social-row:first-child { padding-top: 0; }

  .social-icon {
    width: 32px; height: 32px; border-radius: 10px;
    background: var(--tag-bg); display: flex; align-items: center;
    justify-content: center; font-size: 16px; flex-shrink: 0;
  }

  .social-label { font-size: 11px; color: var(--muted); margin-bottom: 1px; }
  .social-link { font-size: 12px; font-weight: 600; color: var(--primary); text-decoration: none; }
  .social-link:hover { text-decoration: underline; }

  .divider { height: 1px; background: var(--border); margin: 0; }

  @media (max-width: 700px) {
    .page { grid-template-columns: 1fr; }
    .right { position: static; }
    .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const experiences = [
  {
    id: 1,
    icon: "🐦",
    company: "Twitter",
    title: "Product Designer",
    type: "Full-Time",
    period: "Jun 2019 - Present (7y 3m)",
    location: "Manchester, UK",
    desc: "Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads.",
    color: "#e7f5fe",
  },
  {
    id: 2,
    icon: "🌀",
    company: "GoDaddy",
    title: "Growth Marketing Designer",
    type: "Full-Time",
    period: "Jun 2011 - May 2019 (8y)",
    location: "Manchester, UK",
    desc: "Developed digital marketing strategies, activation plans, proposals, contests and promotions for client initiatives.",
    color: "#f0fdf4",
  },
];

const educations = [
  {
    id: 1,
    icon: "🎓",
    school: "Harvard University",
    degree: "Postgraduate degree, Applied Psychology",
    period: "2010 – 2012",
    desc: "As an Applied Psychologist in the field of Consumer and Society, I am specialized in creating business opportunities by observing, analysing, researching and changing behaviour.",
    color: "#fff7ed",
  },
  {
    id: 2,
    icon: "🏛️",
    school: "University of Toronto",
    degree: "Bachelor of Arts, Visual Communication",
    period: "2005 – 2009",
    desc: "",
    color: "#f0f9ff",
  },
];

const skills = [
  "Communication",
  "Analytics",
  "Facebook Ads",
  "Content Planning",
  "Community Manager",
];

const portfolios = [
  {
    id: 1,
    icon: "🏥",
    label: "Clinically - clinic & health care website",
    bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
  },
  {
    id: 2,
    icon: "📈",
    label: "Growthy - SaaS Analytics & Sales Website",
    bg: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  },
  {
    id: 3,
    icon: "📋",
    label: "Planna - Project Management App",
    bg: "linear-gradient(135deg,#ede9ff,#ddd6fe)",
  },
  {
    id: 4,
    icon: "🪑",
    label: "Furni - furniture ecommerce",
    bg: "linear-gradient(135deg,#fef9c3,#fde68a)",
  },
];

export default function ProfilePage() {
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [showMoreExp, setShowMoreExp] = useState(false);
  const [showMoreEdu, setShowMoreEdu] = useState(false);

  return (
    <>
      <style>{css}</style>
      <div className="page">
        {/* ===== LEFT ===== */}
        <div className="left">
          {/* Hero */}
          <div className="card hero-card">
            <div className="hero-banner">
              <button className="share-icon">⬆</button>
            </div>
            <div className="hero-body">
              <div className="avatar-wrap">
                <div className="avatar">JG</div>
              </div>
              <div className="hero-info">
                <div className="hero-name">Jake Gyll</div>
                <div className="hero-role">
                  Product Designer at <span>Twitter</span>
                </div>
                <div className="hero-loc">
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Manchester, UK
                </div>
              </div>
              <div className="hero-actions">
                <button className="edit-profile-btn">Edit Profile</button>
                <div className="open-badge">
                  <div className="open-dot" />
                  OPEN FOR OPPORTUNITIES
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">About Me</span>
                <button className="edit-btn">✏️</button>
              </div>
              <div
                className={`about-text ${aboutExpanded ? "expanded" : "collapsed"}`}
              >
                I'm a product designer + filmmaker currently working remotely at
                Twitter from beautiful Manchester, United Kingdom. I'm
                passionate about designing digital products that have a positive
                impact on the world. For 10 years, I've specialized in
                interfaces, experience & interaction design as well as working
                in user research and product strategy for product agencies, big
                tech companies & start-ups.
              </div>
              <button
                className="show-more"
                onClick={() => setAboutExpanded((e) => !e)}
              >
                {aboutExpanded ? "Show less ↑" : "Show more ↓"}
              </button>
            </div>
          </div>

          {/* Experiences */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Experiences</span>
                <button className="plus-btn">+</button>
              </div>
              {experiences.slice(0, showMoreExp ? undefined : 2).map((exp) => (
                <div className="exp-item" key={exp.id}>
                  <div className="exp-logo" style={{ background: exp.color }}>
                    {exp.icon}
                  </div>
                  <div className="exp-content">
                    <div className="exp-top">
                      <div>
                        <div className="exp-title">{exp.title}</div>
                        <div className="exp-company">
                          {exp.company} · {exp.type} · {exp.period}
                        </div>
                        <div className="exp-loc">{exp.location}</div>
                      </div>
                      <button className="edit-btn" style={{ flexShrink: 0 }}>
                        ✏️
                      </button>
                    </div>
                    <div className="exp-desc">{exp.desc}</div>
                  </div>
                </div>
              ))}
              <button
                className="show-more-link"
                onClick={() => setShowMoreExp((s) => !s)}
              >
                {showMoreExp
                  ? "Show less experiences ↑"
                  : "Show 3 more experiences ↓"}
              </button>
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Educations</span>
                <button className="plus-btn">+</button>
              </div>
              {educations.slice(0, showMoreEdu ? undefined : 2).map((edu) => (
                <div className="edu-item" key={edu.id}>
                  <div className="edu-logo" style={{ background: edu.color }}>
                    {edu.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="exp-top">
                      <div>
                        <div className="edu-school">{edu.school}</div>
                        <div className="edu-degree">{edu.degree}</div>
                        <div className="edu-period">{edu.period}</div>
                      </div>
                      <button className="edit-btn" style={{ flexShrink: 0 }}>
                        ✏️
                      </button>
                    </div>
                    {edu.desc && <div className="edu-desc">{edu.desc}</div>}
                  </div>
                </div>
              ))}
              <button
                className="show-more-link"
                onClick={() => setShowMoreEdu((s) => !s)}
              >
                {showMoreEdu
                  ? "Show less educations ↑"
                  : "Show 2 more educations ↓"}
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Skills</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="edit-btn">✏️</button>
                  <button className="plus-btn">+</button>
                </div>
              </div>
              <div className="skills-wrap">
                {skills.map((s) => (
                  <div className="skill-tag" key={s}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Portfolios</span>
                <button className="plus-btn">+</button>
              </div>
              <div className="portfolio-grid">
                {portfolios.map((p) => (
                  <div
                    className="portfolio-item"
                    key={p.id}
                    style={{ background: p.bg }}
                  >
                    <div className="portfolio-thumb">{p.icon}</div>
                    <div className="portfolio-overlay">
                      <div className="portfolio-label">{p.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="right">
          {/* Additional Details */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Additional Details</span>
                <button className="edit-btn">✏️</button>
              </div>
              {[
                { icon: "✉️", label: "Email", val: "jakegyll@email.com" },
                { icon: "📞", label: "Phone", val: "+44 1245 572 135" },
                { icon: "🌐", label: "Languages", val: "English, French" },
              ].map((d) => (
                <div className="detail-row" key={d.label}>
                  <div className="detail-icon">{d.icon}</div>
                  <div>
                    <div className="detail-label">{d.label}</div>
                    <div className="detail-val">{d.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="card">
            <div className="card-body">
              <div className="card-header">
                <span className="card-title">Social Links</span>
                <button className="edit-btn">✏️</button>
              </div>
              {[
                {
                  icon: "📸",
                  label: "Instagram",
                  link: "instagram.com/jakegyll",
                },
                { icon: "🐦", label: "Twitter", link: "twitter.com/jakegyll" },
                { icon: "🌐", label: "Website", link: "www.jakegyll.com" },
              ].map((s) => (
                <div className="social-row" key={s.label}>
                  <div className="social-icon">{s.icon}</div>
                  <div>
                    <div className="social-label">{s.label}</div>
                    <a
                      className="social-link"
                      href={`https://${s.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s.link}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
