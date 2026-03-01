import React, { useState } from "react";
import "./Help.css";

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Applying for a job");
    const [feedback, setFeedback] = useState({});

    const categories = [
        "Getting Started",
        "My Profile",
        "Applying for a job",
        "Job Search Tips",
        "Job Alerts"
    ];

    const articles = [
        {
            id: 1,
            title: "What is My Applications?",
            content: "My Applications is a way for you to track jobs as you move through the application process. Depending on the job you applied to, you may also receive notifications indicating that an application has been actioned by an employer.",
            category: "Applying for a job"
        },
        {
            id: 2,
            title: "How to access my applications history",
            content: "To access applications history, go to your My Applications page on your dashboard profile. You must be signed in to your Jobito account to view this page.",
            category: "Applying for a job"
        },
        {
            id: 3,
            title: "Not seeing jobs you applied in your my application list?",
            content: "Please note that we are unable to track materials submitted for jobs you apply to via an employer's site. As a result, these applications are not recorded in the My Applications section of your Jobito account. We suggest keeping a personal record of all positions you have applied to externally.",
            category: "Applying for a job"
        }
    ];

    const handleFeedback = (articleId, value) => {
        setFeedback(prev => ({
            ...prev,
            [articleId]: value
        }));
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="help-center">
            {/* Header with search */}
            <header className="help-header">
                <div className="header-content">
                    <h1>Help Center</h1>
                    <div className="search-container">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Type your question or search keyword"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="search-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19 19L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Search
                            </button>
                        </div>
                        <div className="sort-dropdown">
                            <label>Sort by:</label>
                            <select>
                                <option>Most relevant</option>
                                <option>Most recent</option>
                                <option>Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="main-content">
                {/* Sidebar with categories */}
                <aside className="categories-sidebar">
                    <h2>Categories</h2>
                    <nav>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-link ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Articles section */}
                <main className="articles-section">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                            <article key={article.id} className="help-article">
                                <h2>{article.title}</h2>
                                <p className="article-content">{article.content}</p>

                                <div className="article-feedback">
                                    <span className="feedback-label">Was this article helpful?</span>
                                    <div className="feedback-buttons">
                                        <button
                                            className={`feedback-btn yes ${feedback[article.id] === 'yes' ? 'active' : ''}`}
                                            onClick={() => handleFeedback(article.id, 'yes')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 8L7 10L11 6M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Yes
                                        </button>
                                        <button
                                            className={`feedback-btn no ${feedback[article.id] === 'no' ? 'active' : ''}`}
                                            onClick={() => handleFeedback(article.id, 'no')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 10L6 6M10 6L6 10M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            No
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No articles found matching your search.</p>
                        </div>
                    )}

                    {/* Contact section */}
                    <div className="contact-section">
                        <h3>Didn't find what you were looking for?</h3>
                        <button className="contact-button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6L10 11L18 6M4 16H16C17.1046 16 18 15.1046 18 14V6C18 4.89543 17.1046 4 16 4H4C2.89543 4 2 4.89543 2 6V14C2 15.1046 2.89543 16 4 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Contact our customer service
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HelpCenter;