import React from "react";
import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  Building2,
  Users,
  List,
  Calendar,
  Settings,
  HelpCircle,
  Plus,
  Bell,
} from "lucide-react";

const CompanyHome = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">


      <main className="flex-1 p-8 overflow-y-auto">

        <div className="max-w-7xl mx-auto">
          <div className="mb-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Good morning, Maria</h2>
                <p className="text-sm text-slate-500">
                  Here is your job listings statistic report from July 19 - July
                  25.
                </p>
              </div>

              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm text-slate-600">
                <span>Jul 19 - Jul 25</span>
                📅
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-500 text-white rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">New candidates to review</p>
                  <h3 className="text-4xl font-bold mt-1">76</h3>
                </div>
                <span className="text-2xl">›</span>
              </div>

              <div className="bg-emerald-400 text-white rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Schedule for today</p>
                  <h3 className="text-4xl font-bold mt-1">3</h3>
                </div>
                <span className="text-2xl">›</span>
              </div>

              <div className="bg-blue-500 text-white rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">Messages received</p>
                  <h3 className="text-4xl font-bold mt-1">24</h3>
                </div>
                <span className="text-2xl">›</span>
              </div>
            </div>
          </div>

          {/* ===== TOP GRID ===== */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {/* ===== Job Statistics ===== */}
            <div className="col-span-2 bg-white rounded-xl border p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Job statistics</h3>
                  <p className="text-xs text-slate-400">
                    Showing Job statistics Jul 19-25
                  </p>
                </div>

                <div className="flex bg-slate-100 rounded p-1 text-sm">
                  <button className="px-3 py-1 bg-white rounded shadow">
                    Week
                  </button>
                  <button className="px-3 py-1 text-slate-500">Month</button>
                  <button className="px-3 py-1 text-slate-500">Year</button>
                </div>
              </div>

              <div className="flex gap-6">
                {/* Chart */}
                <div className="flex-1 h-64 flex items-end gap-4">
                  {[
                    [60, 40],
                    [50, 30],
                    [70, 45],
                    [80, 55],
                    [45, 30],
                    [30, 20],
                    [55, 35],
                  ].map(([view, applied], i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-orange-400 rounded-t"
                        style={{ height: `${view}%` }}
                      />
                      <div
                        className="w-full bg-blue-500 rounded-b"
                        style={{ height: `${applied}%` }}
                      />
                      <span className="text-xs text-slate-400">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Side Stats */}
                <div className="w-56 space-y-4">
                  <MiniStat
                    title="Job Views"
                    value="2,342"
                    trend="+6.4%"
                    positive
                  />
                  <MiniStat title="Job Applied" value="654" trend="-0.5%" />
                </div>
              </div>
            </div>

            {/* ===== Right Side ===== */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border">
                <p className="text-sm text-slate-400">Job Open</p>
                <h2 className="text-4xl font-bold">
                  12{" "}
                  <span className="text-sm font-normal text-slate-400">
                    Jobs Opened
                  </span>
                </h2>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <p className="text-sm text-slate-400">Applicants Summary</p>
                <h2 className="text-4xl font-bold mb-4">
                  67{" "}
                  <span className="text-sm font-normal text-slate-400">
                    Applicants
                  </span>
                </h2>

                <div className="h-2 bg-slate-100 rounded-full flex overflow-hidden mb-4">
                  <div className="bg-blue-500 w-[45%]" />
                  <div className="bg-green-400 w-[24%]" />
                  <div className="bg-orange-400 w-[31%]" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <span>■ Full Time: 45</span>
                  <span>■ Internship: 32</span>
                  <span>■ Part-Time: 24</span>
                  <span>■ Contract: 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Job Updates ===== */}
          <div>
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Job Updates</h3>
              <button className="text-indigo-600 text-sm font-semibold">
                View All →
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <JobCard
                title="Social Media Assistant"
                company="Nomad"
                location="Paris, France"
              />
              <JobCard
                title="Brand Designer"
                company="Nomad"
                location="Paris, France"
              />
              <JobCard
                title="Interactive Developer"
                company="Terraform"
                location="Berlin, Germany"
              />
              <JobCard
                title="Product Designer"
                company="ClassPass"
                location="Berlin, Germany"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================= COMPONENTS ================= */

interface NavItemProps {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
  badge?: number | null;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active = false,
  badge = null,
}) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
      active
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    {badge !== null && (
      <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </div>
);

interface MiniStatProps {
  title: string;
  value: string | number;
  trend: string;
  positive?: boolean;
}

const MiniStat: React.FC<MiniStatProps> = ({
  title,
  value,
  trend,
  positive = false,
}) => (
  <div className="border rounded-lg p-4">
    <p className="text-sm text-slate-400">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
    <p className={`text-xs ${positive ? "text-emerald-500" : "text-red-500"}`}>
      {trend}
    </p>
  </div>
);

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  location,
  type = "Full-Time",
}) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer">
    <div className="flex justify-between mb-4">
      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
        💼
      </div>
      <span className="text-[10px] border border-emerald-400 text-emerald-500 px-2 py-0.5 rounded-full h-fit">
        {type}
      </span>
    </div>
    <h4 className="font-bold text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-400 mb-4">
      {company} • {location}
    </p>
    <div className="flex gap-2 mb-4">
      <span className="bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded">
        Marketing
      </span>
      <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded">
        Design
      </span>
    </div>
    <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-500">
      5 applied <span className="text-slate-300">of 10 capacity</span>
    </div>
  </div>
);

export default CompanyHome;
