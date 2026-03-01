import React from 'react';

// 1. تعريف شكل البيانات (Type Safety)
interface Job {
  id: number;
  company: string;
  location: string;
  title: string;
  type: string;
  posted: string;
  salary: number;
  tags: string[];
  logo: string;
}

// 2. البيانات (Mock Data) بناءً على الصورة
const jobs: Job[] = [
  { id: 1, company: "Ashford", location: "France", title: "Lead Quality Control QA", type: "Full Time", posted: "4 months ago", salary: 500, tags: ["App", "Figma", "Java"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=AF" },
  { id: 2, company: "Percepta", location: "Germany", title: "React Native Web Developer", type: "Part Time", posted: "4 months ago", salary: 800, tags: ["App", "Figma", "PSD"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=PR" },
  { id: 3, company: "Tesla", location: "Denmark", title: "Senior System Engineer", type: "Temporary", posted: "4 months ago", salary: 500, tags: ["App", "Figma", "Java"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=TS" },
  { id: 4, company: "Bing Search", location: "New York, USA", title: "Full Stack Engineer", type: "Internship", posted: "5 months ago", salary: 800, tags: ["Figma"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=BS" },
  { id: 5, company: "Exela Movers", location: "Australia", title: "UI / UX Designer fulltime", type: "Part Time", posted: "5 months ago", salary: 500, tags: ["App", "Figma", "Java"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=EX" },
  { id: 6, company: "Amazon", location: "London", title: "Frontend Developer", type: "Full Time", posted: "5 months ago", salary: 800, tags: ["App", "Figma", "PSD"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=AZ" },
  { id: 7, company: "Aceable, Inc.", location: "London", title: "Java Software Engineer", type: "Part Time", posted: "5 months ago", salary: 500, tags: ["App", "Figma", "Java"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=AC" },
  { id: 8, company: "Baseball Saving", location: "Australia", title: "Full Stack Engineer", type: "Full Time", posted: "5 months ago", salary: 800, tags: ["Figma"], logo: "https://api.dicebear.com/7.x/initials/svg?seed=BB" },
];

// 3. مكون البطاقة المنفصل
const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
          <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{job.company}</h3>
          <p className="text-gray-400 text-xs flex items-center gap-1">
             <span className="opacity-70">📍</span> {job.location}
          </p>
        </div>
      </div>
      <span className="text-green-500 text-sm">⚡</span>
    </div>

    <h2 className="text-[17px] font-bold text-[#05264e] mb-3 leading-tight h-12 line-clamp-2">
      {job.title}
    </h2>
    
    <div className="flex gap-3 text-[11px] text-gray-400 mb-4 font-medium">
      <span className="flex items-center gap-1">💼 {job.type}</span>
      <span className="flex items-center gap-1">🕒 {job.posted}</span>
    </div>

    <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.
    </p>

    <div className="flex flex-wrap gap-2 mb-6">
      {job.tags.map(tag => (
        <span key={tag} className="bg-[#f2f6fd] text-[#66789c] px-3 py-1 rounded-md text-[11px] font-semibold hover:bg-blue-100 cursor-pointer">
          {tag}
        </span>
      ))}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
      <p className="text-[#05264e] font-extrabold text-lg">
        ${job.salary}<span className="text-gray-400 font-normal text-xs">/Hour</span>
      </p>
      <button className="bg-[#e0e6f7] text-[#3c65f5] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#3c65f5] hover:text-white transition-all">
        Apply Now
      </button>
    </div>
  </div>
);

// 4. المكون الرئيسي للملف
export default function JobsDashboard() {
  return (
    <div className="bg-[#f8faff] min-h-screen py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#05264e] mb-4">Jobs of the day</h1>
          <p className="text-gray-500 text-lg">Search and connect with the right candidates faster</p>
        </div>


        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

      </div>
    </div>
  );
}