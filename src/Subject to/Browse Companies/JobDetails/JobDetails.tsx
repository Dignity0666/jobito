import React from "react";
import "./JobDetails.css";

const JobDetails: React.FC = () => {
  return (
    <div className="job-container">
      <section className="about-section">
        <h2>About this role</h2>

        <div className="progress-box">
          <p>
            <strong>5 applied</strong> of 10 capacity
          </p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>

        <div className="job-info">
          <div className="info-row">
            <span>Apply Before</span>
            <span className="bold">July 31, 2021</span>
          </div>

          <div className="info-row">
            <span>Job Posted On</span>
            <span className="bold">July 1, 2021</span>
          </div>

          <div className="info-row">
            <span>Job Type</span>
            <span className="bold">Full-Time</span>
          </div>

          <div className="info-row">
            <span>Salary</span>
            <span className="bold">$75k-$85k USD</span>
          </div>
        </div>
      </section>

      <hr />

      {/* Categories */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="tags">
          <div className="tag marketing">Marketing</div>
          <div className="tag design">Design</div>
        </div>
      </section>

      <section className="skills">
        <h2>Required Skills</h2>
        <div className="skills-list">
          <span>Project Management</span>
          <span>Copywriting</span>
          <span>Social Media Marketing</span>
          <span>English</span>
          <span>Copy Editing</span>
        </div>
      </section>
    </div>
  );
};

export default JobDetails;
