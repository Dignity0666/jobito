import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState, useEffect, useRef } from "react";
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
import ApplicationsHistory from "./Basic/ApplicationsHistory/ApplicationsHistory";
import JobDashboard from "./Basic/DoughnutChart/DoughnutChart";
import ProfilePage from "./Basic/Profilepage/Profilepage";
// import { MessagingApp } from "./Basic/Messagingapp/Messagingapp";
// import HelpCenter from "./Basic/Help/Help";
import Applicants from "./Basic/Social Media Assistant applicant/Social Media As";
import AllApplicants from "./Basic/Company/All Applicants/All Applicants";
import PostJobStep3 from "./Basic/Company/Perks & Benefits/Perks&Benefits";
import PostJob from "./Basic/Company/post job/PostJobForm";
import { AuthProvider, useJobitoAuth } from "./context/LinkContxt";
import { TranslationProvider } from "./context/TranslationContext";
import ProfilepageCompany from "./Basic/Company/ProfilepageCompany/ProfilepageCompany";
import JobListing from "./Basic/Company/Job Listing/Job Listing";
import CompanyHome from "./Basic/Company/CompanyHome/CompanyHome";
import AccountSecurity from "./Basic/Security/AccountSecurity";
import EditProfile from "./Basic/Profilepage/EditProfile";
import ProfileSettings from "./Basic/MyProfileTab/ProfileSettings";
import ChatApp from "./Basic/ChatApp/ChatApp";
import NotFound from "./Shared/NotFound/NotFound";
import ApplicantDetails from "./Basic/Company/ApplicantDetails/ApplicantDetails";

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
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
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
      style={{
        willChange: "transform, opacity",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </motion.div>
  );
}

const SplashScreen = () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#ffffff",
      color: "#0f172a",
    }}
  >
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 90, 180, 270, 360],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: 80,
        height: 80,
        background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
        marginBottom: 32,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    />
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 8,
        color: "#0f172a",
      }}
    >
      JOBITO
    </motion.h1>
  </div>
);

function AppContent() {
  const { role, isAuthenticated, isBackendOffline, isInitialLoading } =
    useJobitoAuth();
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  const [showObitoSidebar, setshowObitoSidebar] = useState(false);
  const hideLayoutPaths = ["/user-information"];
  const currentPath = location.pathname.toLowerCase();
  const shouldHide = hideLayoutPaths.includes(currentPath);

  const mainLayoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowHeader(!shouldHide);
  }, [shouldHide]);

  useEffect(() => {
    if (mainLayoutRef.current) {
      mainLayoutRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  if (isInitialLoading) {
    return <SplashScreen />;
  }

  if (isBackendOffline) {
    return (
      <div className="App">
        <div className="main-layout" ref={mainLayoutRef}>
          <Header />
          <div
            className="page-content"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotFound />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="">
        <AnimatePresence>
          {showObitoSidebar && isAuthenticated && (
            <ObitoSidebar setshowObitoSidebar={setshowObitoSidebar} />
          )}
        </AnimatePresence>
      </div>

      <div className="main-layout" ref={mainLayoutRef}>
        {showHeader && <Header />}
        <div className="page-content">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              {/* ─── Company Routes ────────────────────────────────────────── */}
              {role === "company" && (
                <>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route
                    path="/home"
                    element={
                      <PageWrapper>
                        <CompanyHome />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/PostJob"
                    element={
                      <PageWrapper>
                        <PostJob />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/PostJobStep3"
                    element={
                      <PageWrapper>
                        <PostJobStep3 />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Messagingapp"
                    element={
                      <PageWrapper>
                        <ChatApp setShowHeader={setShowHeader} />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/AllApplicants"
                    element={
                      <PageWrapper>
                        <AllApplicants />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/JobListing"
                    element={
                      <PageWrapper>
                        <JobListing />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/ApplicantDetails/:id"
                    element={
                      <PageWrapper>
                        <ApplicantDetails />
                      </PageWrapper>
                    }
                  />
                  {/* <Route path="/Help" element={<PageWrapper><HelpCenter /></PageWrapper>} /> */}
                  <Route
                    path="/Applicants"
                    element={
                      <PageWrapper>
                        <Applicants />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Profile"
                    element={
                      <PageWrapper>
                        <ProfilepageCompany />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Job details"
                    element={
                      <PageWrapper>
                        <JobDetailsPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/ProfileSettings"
                    element={
                      <PageWrapper>
                        <ProfileSettings />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/settings/security"
                    element={
                      <PageWrapper>
                        <AccountSecurity />
                      </PageWrapper>
                    }
                  />
                </>
              )}

              {role !== "company" && (
                <>
                  <Route
                    path="/edit-profile"
                    element={
                      <PageWrapper>
                        <EditProfile />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <PageWrapper>
                        <Home />
                      </PageWrapper>
                    }
                  />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route
                    path="/Find Jobs"
                    element={
                      <PageWrapper>
                        <JobBoard />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Job details"
                    element={
                      <PageWrapper>
                        <JobDetailsPage />
                      </PageWrapper>
                    }
                  />
                  {/* <Route path="/Help" element={<PageWrapper><HelpCenter /></PageWrapper>} /> */}
                  <Route
                    path="/Browse Companies"
                    element={
                      <PageWrapper>
                        <CompaniesJobs />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Company/:id"
                    element={
                      <PageWrapper>
                        <ProfilepageCompany />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <PageWrapper>
                        <About />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PageWrapper>
                        <Contact />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/user-information"
                    element={
                      <PageWrapper>
                        <UserInformation />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/settings/security"
                    element={
                      <PageWrapper>
                        <AccountSecurity />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/MyApplications"
                    element={
                      <PageWrapper>
                        <ApplicationsHistory />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Messagingapp"
                    element={
                      <PageWrapper>
                        <ChatApp setShowHeader={setShowHeader} />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/JobDashboard"
                    element={
                      <PageWrapper>
                        <JobDashboard />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/Profile"
                    element={
                      <PageWrapper>
                        <ProfilePage />
                      </PageWrapper>
                    }
                  />
                </>
              )}

              <Route
                path="*"
                element={
                  <PageWrapper>
                    <NotFound />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
          {showHeader && currentPath !== "/messagingapp" && <Footer />}
        </div>
      </div>
    </div>
  );
}

function RootInner() {
  const { googleClientId } = useJobitoAuth();

  return (
    <GoogleOAuthProvider clientId={googleClientId || "dummy"}>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <RootInner />
      </AuthProvider>
    </TranslationProvider>
  );
}
