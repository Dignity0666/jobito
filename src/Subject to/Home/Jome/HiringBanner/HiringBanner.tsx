import React from 'react';
import img1 from "../../../../assets/WhatsApp Image 2026-02-20 at 12.19.07 AM.jpeg";
import img2 from "../../../../assets/WhatsApp Image 2026-02-20 at 12.19.09 AM.jpeg";
import img3 from "../../../../assets/WhatsApp Image 2026-02-20 at 12.16.48 AM (1).jpeg";
const  HiringBanner: React.FC = () => {
  return (
    <div className=" w-[900px] max-w-7xl mx-auto px-4 mb-12">
      <div className="relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        
        {/* Left Side: Illustration & Text */}
        <div className="flex items-center gap-8 z-10">
          {/* Man Illustration (Placeholder) */}
          <div className="hidden lg:block w-24 h-24 relative">
            <div className="absolute inset-0 opacity-50 "></div>
            <img 
              src={img1} 
              alt="Hiring" 
              className="relative z-10 w-full h-full object-contain"
            />
          </div>

          <div>
            <span className="text-gray-400 font-bold tracking-widest text-xs uppercase">We Are</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#05264e] mt-1 mb-2">HIRING</h2>
            <p className="text-gray-500 text-lg">
              Let's <span className="font-bold text-gray-800">Work Together</span> <br className="hidden md:block" />
              & <span className="text-gray-400">Explore Opportunities</span>
            </p>
          </div>
        </div>

        {/* Right Side: Button & Team Illustration */}
        <div className="flex flex-col md:flex-row items-center gap-8 z-10">
          <button className="bg-[#3c65f5] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Apply Now
          </button>

          {/* Team Illustration Placeholder */}
          <div className="hidden sm:flex items-end gap-2 h-20">
             <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src={img2} alt="team" className="w-full h-full object-contain" />
             </div>
             <div className="w-12 h-16 rounded-lg flex items-center justify-center">
                <img src={img3} alt="team" className="w-full h-full object-contain" />
             </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-20">
           <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default HiringBanner;