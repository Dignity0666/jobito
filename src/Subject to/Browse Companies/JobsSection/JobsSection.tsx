import React from "react";
import "./JobsSection.css";

const featuredJobs = [
  {
    title: "Email Marketing",
    company: "Revolut · Madrid, Spain",
    tags: ["Marketing", "Design"],
  },
  {
    title: "Brand Designer",
    company: "Dropbox · San Francisco, US",
    tags: ["Design", "Business"],
  },
  {
    title: "Email Marketing",
    company: "Pitch · Berlin, Germany",
    tags: ["Marketing"],
  },
  {
    title: "Visual Designer",
    company: "Blinklist · Granada, Spain",
    tags: ["Design"],
  },
  {
    title: "Product Designer",
    company: "ClassPass · Manchester, UK",
    tags: ["Marketing", "Design"],
  },
  {
    title: "Lead Designer",
    company: "Canva · Ontario, Canada",
    tags: ["Design", "Business"],
  },
  {
    title: "Brand Strategist",
    company: "GoDaddy · Marseille, France",
    tags: ["Marketing"],
  },
  {
    title: "Data Analyst",
    company: "Twitter · San Diego, US",
    tags: ["Technology"],
  },
];

const latestJobs = [
  {
    title: "Social Media Assistant",
    company: "Nomad · Paris, France",
  },
  {
    title: "Social Media Assistant",
    company: "Netlify · Paris, France",
  },
  {
    title: "Brand Designer",
    company: "Dropbox · San Francisco, USA",
  },
  {
    title: "Brand Designer",
    company: "Maze · San Francisco, USA",
  },
  {
    title: "Interactive Developer",
    company: "Terraform · Hamburg, Germany",
  },
  {
    title: "Interactive Developer",
    company: "Udacity · Hamburg, Germany",
  },
  {
    title: "HR Manager",
    company: "Packer · Lucern, Switzerland",
  },
  {
    title: "HR Manager",
    company: "Webflow · Lucern, Switzerland",
  },
];

const EJobsSection = () => {
  return (
    <>
      <div className="section-header">
        <h2>
          Similiar <span> Jobs </span>
        </h2>
        <a href="#">Show all jobs →</a>
      </div>
      <div className="latest-grid">
        {latestJobs.map((job, index) => (
          <div key={index} className="latest-card">
            <div className="logo small">Logo</div>
            <div>
              <h4>{job.title}</h4>
              <p>{job.company}</p>
              <div className="tags">
                <span className="tag fulltime">Full Time</span>
                <span className="tag marketing">Marketing</span>
                <span className="tag design">Design</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EJobsSection;
