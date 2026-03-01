import { jwtDecode } from "jwt-decode";
import {

  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "./Basic/Home/Home";
import { UserInformation } from "./Basic/User Information/UserInformation";
import Contact from "./Basic/Contact/Contact";
import JobBoard from "./Basic/JobBoard/JobBoard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { About } from "./Basic/About/About";
import CompaniesJobs from "./Basic/CompaniesJobs/CompaniesJobs";
import { Header } from "./Permanent/Header/Header";
import Footer from "./Permanent/Footer/Footer";
import { JobDetailsPage } from "./Basic/JobDetailsPage/JobDetailsPage";
import { ObitoSidebar } from "./Basic/ObitoSidebar/ObitoSidebar";
import MyApplications from "./Basic/My Applications/MyApplications";
import JobDashboard from "./Basic/DoughnutChart/DoughnutChart";
import ProfilePage from "./Basic/Profilepage/Profilepage";
import { MessagingApp } from "./Basic/Messagingapp/Messagingapp";
import HelpCenter from "./Basic/Help/Help";
import ProfileSettings from "./Basic/MyProfileTab/ProfileSettings";
import Applicants from "./Basic/Social Media Assistant applicant/Social Media As";
import JobListing from "./Basic/Job Listing/Job Listing";
import PostJobForm from "./Basic/post job/PostJobForm";
import PostJobStep3 from "./Basic/Perks & Benefits/Perks&Benefits";
import PostJob from "./Basic/post job/PostJobForm";
import CompanyHome from "./Basic/CompanyHome/CompanyHome";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number], // smooth ease out
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: "transform, opacity", width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function AppContent({ role, isAuthenticated, user }: { role: string | null, isAuthenticated: boolean, user: { name?: string; email?: string; avatar?: string; phone?: string; notification_preferences?: any } | null }) {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [showObitoSidebar, setshowObitoSidebar] = useState(true);
  const hideLayoutPaths = ["/user-information"];
  const currentPath = location.pathname.toLowerCase();
  const shouldHide = hideLayoutPaths.includes(currentPath);

  useEffect(() => {
    if (shouldHide) {
      setShowHeader(false);
      setshowObitoSidebar(false);
    } else {
      setShowHeader(true);
      setshowObitoSidebar(true);
    }
  }, [currentPath, shouldHide]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="App">
      <div className="">
        <AnimatePresence>
          {showObitoSidebar && isAuthenticated && (
            <ObitoSidebar setshowObitoSidebar={setshowObitoSidebar} />
          )}
        </AnimatePresence>
      </div>

      <div className="main-layout">
        {showHeader && <Header isAuthenticated={isAuthenticated} user={user} setshowObitoSidebar={setshowObitoSidebar} />}
        <div className="page-content">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/Find Jobs" element={<PageWrapper><JobBoard /></PageWrapper>} />
              <Route path="/Job details" element={<PageWrapper><JobDetailsPage /></PageWrapper>} />
              <Route path="/Help" element={<PageWrapper><HelpCenter /></PageWrapper>} />
              <Route path="/Browse Companies" element={<PageWrapper><CompaniesJobs /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/user-Information" element={<PageWrapper><UserInformation /></PageWrapper>} />
              <Route path="/ProfileSettings" element={<PageWrapper><ProfileSettings user={user} /></PageWrapper>} />

              {/* Role-Specific Routes */}
              {role === "company" ? (
                <>
                  <Route path="/company-home" element={<PageWrapper><CompanyHome /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper><CompanyHome /></PageWrapper>} />
                </>
              ) : (
                <>
                  <Route path="/MyApplications" element={<PageWrapper><MyApplications /></PageWrapper>} />
                  <Route path="/Messagingapp" element={<PageWrapper><MessagingApp setShowHeader={setShowHeader} /></PageWrapper>} />
                  <Route path="/JobDashboard" element={<PageWrapper><JobDashboard /></PageWrapper>} />
                  <Route path="/ProfilePage" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                </>
              )} 
            </Routes>
          </AnimatePresence>
          {showHeader && <Footer />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string; phone?: string; notification_preferences?: any } | null>(null);

  useEffect(() => {
    const checkRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setRole(decoded.role || "student");

          setUser({
            name: decoded.name || null,
            email: decoded.email || null,
            avatar: decoded.avatar || null,
            phone: decoded.phone || null,
            notification_preferences: decoded.notification_preferences || null,
          });
        } catch (e) {
          setRole("student");
          setUser(null);
        }
      } else {
        setRole("student");
        setUser(null);
      }
    };

    checkRole();
    window.addEventListener("auth-changed", checkRole);
    window.addEventListener("storage", checkRole);
    return () => {
      window.removeEventListener("auth-changed", checkRole);
      window.removeEventListener("storage", checkRole);
    };
  }, []);

  return (
    <Router>
      <AppContent role={role} isAuthenticated={!!localStorage.getItem("token")} user={user} />
    </Router>
  );
}
