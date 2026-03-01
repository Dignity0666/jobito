import React from "react";

export const JobsLandingPage = () => {
  return (
    <div className="min-h-screen text-gray-800">
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div className="h-[380px] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl" />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-sm text-white mb-6">Companies we helped grow</p>
        <div className="flex flex-wrap gap-10 items-center opacity-70 text-white">
          <div>Vodafone</div>
          <div>Intel</div>
          <div>Tesla</div>
          <div>AMD</div>
          <div>Talkit</div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-white">Explore by category</h2>
          <button className="text-blue-600 text-sm">View all →</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Design",
            "Sales",
            "Marketing",
            "Finance",
            "Technology",
            "Engineering",
            "Business",
            "Human Resource",
          ].map((cat) => (
            <div
              key={cat}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-lg mb-4" />
              <h3 className="font-semibold mb-1">{cat}</h3>
              <p className="text-sm text-gray-400">Jobs available</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-blue-600 text-white rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Start posting jobs today
            </h3>
            <p className="text-blue-100 mb-6">
              Start posting jobs for only $10.
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg">
              Sign up for free
            </button>
          </div>
          <div className="h-[200px] bg-white/20 rounded-xl" />
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-10 text-white">Featured jobs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg" />
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                  Full Time
                </span>
              </div>
              <h3 className="font-semibold mb-1">Job Title</h3>
              <p className="text-sm text-gray-400 mb-4">Company • Location</p>
              <div className="flex gap-2 text-xs">
                <span className="bg-gray-100 px-2 py-1 rounded">Design</span>
                <span className="bg-gray-100 px-2 py-1 rounded">UI/UX</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-10 text-white">
          Latest jobs open
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg" />
                <div>
                  <h3 className="font-semibold">Job Title</h3>
                  <p className="text-sm text-gray-400">Company • Location</p>
                </div>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded">
                Full Time
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
