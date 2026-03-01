import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { JobsLandingPage } from "../../Subject to/Home/JobsLandingPage/JobsLandingPage";
import { Gh } from "../../Subject to/Home/Jome/gh";

export const Home = () => {
  const location = useLocation();
  const [showJobs, setShowJobs] = useState(false);

  useEffect(() => {
    if (location.state?.showJobs) {
      setShowJobs(true);
    }
  }, [location.state]);
  
  return <div>{showJobs ? <JobsLandingPage /> : <Gh />}</div>;
};
