// App.js
import React from 'react';
import "./MyApplications.css"
function MyApplications() {
  const applications = [
    { id: 1, company: 'Nomad', role: 'Social Media Assistant', date: '24 July 2021', status: 'In Review' },
    { id: 2, company: 'Udacity', role: 'Social Media Assistant', date: '20 July 2021', status: 'Shortlisted' },
    { id: 3, company: 'Packer', role: 'Social Media Assistant', date: '16 July 2021', status: 'Offered' },
    { id: 4, company: 'Divvy', role: 'Social Media Assistant', date: '14 July 2021', status: 'Interviewing' },
    { id: 5, company: 'DigitalOcean', role: 'Social Media Assistant', date: '10 July 2021', status: 'Unsuitable' }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'In Review': return 'status-review';
      case 'Shortlisted': return 'status-shortlisted';
      case 'Offered': return 'status-offered';
      case 'Interviewing': return 'status-interviewing';
      case 'Unsuitable': return 'status-unsuitable';
      default: return '';
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header Section */}
        <div className="header">
          <h1>Keep it up, Jake</h1>
          <p className="subtitle">Here is job applications status from July 19 - July 25.</p>
        </div>

        {/* New Feature Banner */}
        <div className="feature-banner">
          <span className="feature-icon">✨</span>
          <span className="feature-text">
            <strong>New Feature</strong> You can request a follow-up 7 days after applying for a job if the application status is in review. Only one follow-up is allowed per job.
          </span>
        </div>

        {/* Applications Table */}
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th>Roles</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.company}</td>
                  <td>{app.role}</td>
                  <td>{app.date}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search" />
          </div>
          <div className="filter-box">
            <span className="filter-icon">⚙️</span>
            <span>Filter</span>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="page-info">
            Page: 1 of 5
          </div>
          <div className="total-pages">
            Total Pages: 33
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyApplications;