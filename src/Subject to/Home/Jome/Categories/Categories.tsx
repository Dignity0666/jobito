import "./Categories.css";
import img from "../../../../assets/Img/WhatsApp Image 2026-02-06 at 2.24.58 PM.jpeg";

const categories = [
  { title: "Design", jobs: "235 jobs available", icon: "🎨" },
  { title: "Sales", jobs: "756 jobs available", icon: "📊" },
  { title: "Marketing", jobs: "140 jobs available", icon: "📣", active: true },
];

const Categories = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h2>
          Explore by <span>category</span>
        </h2>
        <a href="#" className="show-all">
          Show all jobs →
        </a>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <div className="icon">{cat.icon}</div>
            <h3>{cat.title}</h3>
            <p>{cat.jobs}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
