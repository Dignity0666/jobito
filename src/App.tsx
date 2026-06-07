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
import ModeSwitcherBar from "./Permanent/ModeSwitcherBar/ModeSwitcherBar";
import Footer from "./Permanent/Footer/Footer";
import { JobDetailsPage } from "./Basic/JobDetailsPage/JobDetailsPage";
import ApplicationsHistory from "./Basic/ApplicationsHistory/ApplicationsHistory";
import JobDashboard from "./Basic/DoughnutChart/DoughnutChart";
import ProfilePage from "./Basic/Profilepage/Profilepage";
import AllApplicants from "./Basic/Company/All Applicants/All Applicants";
import CVViewer from "./Basic/Company/All Applicants/CVViewer";
import PostJobStep3 from "./Basic/Company/Perks & Benefits/Perks&Benefits";
import PostJob from "./Basic/Company/post job/PostJobForm";
import { AuthProvider, useJobitoAuth } from "./context/LinkContxt";
import { TranslationProvider } from "./context/translation-context";
import { ThemeProvider } from "./context/ThemeContext";
import ProfilepageCompany from "./Basic/Company/ProfilepageCompany/ProfilepageCompany";
import JobListing from "./Basic/Company/Job Listing/Job Listing";
import CompanyHome from "./Basic/Company/CompanyHome/CompanyHome";
import AccountSecurity from "./Basic/Security/AccountSecurity";
import EditProfile from "./Basic/Profilepage/EditProfile";
import ProfileSettings from "./Basic/MyProfileTab/ProfileSettings";
import ChatApp from "./Basic/ChatApp/ChatApp";
import NotFound from "./Shared/NotFound/NotFound";
import ApplicantDetails from "./Basic/Company/ApplicantDetails/ApplicantDetails";
import JobAnalytics from "./Basic/Company/JobAnalytics/JobAnalytics";
import CompleteProfile from "./Basic/CompleteProfile/CompleteProfile";
import PostWork from "./Basic/Tradesman/PostWork/PostWork";
import WorkListing from "./Basic/Tradesman/WorkListing/WorkListing";
import WorkApplicants from "./Basic/Tradesman/WorkApplicants/WorkApplicants";
import WorkApplicantDetails from "./Basic/Tradesman/WorkApplicants/Details/WorkApplicantDetails";
import ChatBotWidget from "./Shared/ChatBotWidget/ChatBotWidget";
import AIChatBot from "./Basic/AIChatBot/AIChatBot";
import Admin from "./Basic/Admin/Admin";
import TradesmanReviewStatus from "./Basic/Tradesman/ReviewStatus/TradesmanReviewStatus";
import PrivacyPolicy from "./Basic/PrivacyPolicy/PrivacyPolicy";

import WorkDetails from "./Basic/Tradesman/WorkListing/Details/WorkDetails";
import { ToastProvider } from "./context/ToastContext";
import CompanyRatings from "./Basic/Company/CompanyRatings/CompanyRatings";


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
        minHeight: "100%",
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
      background: "var(--color-bg)",
      color: "var(--color-text)",
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
        background: "linear-gradient(135deg, #4A6ED1 0%, #FF7A2A 100%)",
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
        color: "var(--color-text)",
      }}
    >
      JOBITO
    </motion.h1>
  </div>
);

function AppContent() {
  const { role, user, isAuthenticated, isBackendOffline, isMaintenance, isInitialLoading } =
    useJobitoAuth();
  const classification = user?.classification;
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);

  const hideLayoutPaths = [
    "/user-information",
    "/complete-profile",
    "/admin",
    "/ai-chat",
    "/chat",
    "/messagingapp",
  ];
  const currentPath = location.pathname.toLowerCase();
  const shouldHide = hideLayoutPaths.includes(currentPath);

  const mainLayoutRef = useRef<HTMLDivElement>(null);

  // DevTools Protection (Blocks Right-Click, F12, and Shortcuts)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Block Right-Click
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key.toLowerCase() === "i" ||
          e.key.toLowerCase() === "j" ||
          e.key.toLowerCase() === "c")
      ) {
        e.preventDefault();
      }
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  // Redirect logged-in users with no classification (who are not company/admin) to complete profile
  const isCompleteProfilePath = location.pathname.toLowerCase() === "/complete-profile";
  const isUserWithoutClassification = isAuthenticated && role === "user" && !classification;

  if (isUserWithoutClassification && !isCompleteProfilePath) {
    return <Navigate to="/complete-profile" replace />;
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
              flexDirection: "column",
              padding: "60px 20px",
              minHeight: "60vh",
            }}
          >
            {isMaintenance ? (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  maxWidth: "550px",
                  width: "100%",
                  margin: "0 auto",
                  background: "linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%)",
                  padding: "50px 40px",
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
                  textAlign: "center",
                  direction: "rtl",
                  border: "1px solid rgba(255,255,255,0.6)",
                }}
              >
                {/* Animated Gear Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: "80px",
                    height: "80px",
                    margin: "0 auto 24px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "36px",
                    boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                  }}
                >
                  ⚙️
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: "#1E293B",
                    marginBottom: "16px",
                    lineHeight: "1.4",
                  }}
                >
                  الموقع تحت الصيانة حالياً
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{
                    fontSize: "16px",
                    color: "#64748B",
                    lineHeight: "1.8",
                    marginBottom: "28px",
                  }}
                >
                  نعتذر عن الإزعاج، نقوم حالياً ببعض التحديثات والتحسينات الهامة على النظام لتقديم تجربة أفضل لكم. يرجى المحاولة مرة أخرى لاحقاً.
                </motion.p>

                {/* Pulsing Status Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "12px 24px",
                    background: "rgba(79, 70, 229, 0.08)",
                    borderRadius: "12px",
                    border: "1px solid rgba(79, 70, 229, 0.15)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#4F46E5",
                    }}
                  />
                  <span style={{ fontSize: "14px", color: "#4F46E5", fontWeight: "600" }}>
                    جاري العمل على التحديثات...
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <NotFound />
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="App">

      <div className="main-layout" ref={mainLayoutRef}>
        {showHeader && <Header />}
        {showHeader && role === "user" && <ModeSwitcherBar />}
        <div className={`page-content ${shouldHide ? "full-screen-page" : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              {/* ─── Company & Tradesman Management Routes ────────────────────────── */}
              {(role === "company" || classification === "tradesman") && (
                <>
                  {classification === "tradesman" && (user?.accountStatus === 'pending' || user?.accountStatus === 'cr_rejected') ? (
                    <Route
                      path="*"
                      element={
                        <PageWrapper>
                          <TradesmanReviewStatus />
                        </PageWrapper>
                      }
                    />
                  ) : (
                    <>
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
                    </>
                  )}
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
                    path="/chat"
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
                    path="/CompanyRatings"
                    element={
                      <PageWrapper>
                        <CompanyRatings />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/JobListing"
                    element={
                      <PageWrapper>
                        {classification === "tradesman" ? <WorkListing /> : <JobListing />}
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/PostWork"
                    element={
                      <PageWrapper>
                        <PostWork />
                      </PageWrapper>
                    }
                  />
                   <Route
                    path="/WorkApplicants"
                    element={
                      <PageWrapper>
                        <WorkApplicants />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/WorkApplicantDetails/:id"
                    element={
                      <PageWrapper>
                        <WorkApplicantDetails />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/WorkManagement/:id"
                    element={
                      <PageWrapper>
                        <WorkDetails />
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
                  <Route
                    path="/CVViewer"
                    element={
                      <PageWrapper>
                        <CVViewer />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/JobAnalytics/:jobId"
                    element={
                      <PageWrapper>
                        <JobAnalytics />
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
                        {classification === "tradesman" ? <ProfilePage /> : <ProfilepageCompany />}
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
                      role === "admin" ? (
                        <Navigate to="/admin" replace />
                      ) : (
                        <PageWrapper>
                          <Home />
                        </PageWrapper>
                      )
                    }
                  />
                  <Route path="/home" element={role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />} />
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
                    path="/complete-profile"
                    element={
                      <PageWrapper>
                        <CompleteProfile />
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
                    path="/chat"
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
                  <Route
                    path="/Profile/:id"
                    element={
                      <PageWrapper>
                        <ProfilePage />
                      </PageWrapper>
                    }
                  />
                </>
              )}

              {/* ─── AI ChatBot (available for all roles) ─── */}
              <Route
                path="/admin"
                element={
                  <PageWrapper>
                    <Admin />
                  </PageWrapper>
                }
              />
              <Route
                path="/ai-chat"
                element={
                  <PageWrapper>
                    <AIChatBot />
                  </PageWrapper>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <PageWrapper>
                    <PrivacyPolicy />
                  </PageWrapper>
                }
              />

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
          {showHeader && currentPath !== "/messagingapp" && currentPath !== "/ai-chat" && currentPath !== "/chat" && <Footer />}
        </div>
      </div>
      {/* ─── Global Floating Chat Button ─── */}
      {showHeader && currentPath !== "/chat" && currentPath !== "/messagingapp" && <ChatBotWidget />}
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
    <ThemeProvider>
      <TranslationProvider>
        <AuthProvider>
          <ToastProvider>
            <RootInner />
          </ToastProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}
