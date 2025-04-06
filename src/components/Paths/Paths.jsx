import React, { useState, useEffect } from "react";
import "./Paths.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CareerRoadmap from "./CareerRoadmap";
import pathsData from "./Paths.json";
import AnimatedBackground from "./AnimatedBackground";

const Paths = () => {
  // State to control animation
  const [animate, setAnimate] = useState(false);
  // State to store user data
  const [userData, setUserData] = useState(null);
  // State to control whether to show the roadmap
  const [showRoadmap, setShowRoadmap] = useState(false);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    // Fetch user data from localStorage
    const fetchUserData = () => {
      try {
        const storedData = localStorage.getItem('userCareerData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    
    // Simulate loading for smoother animation
    setTimeout(() => {
      setIsLoading(false);
    }, 400);

    // Trigger animation after component mounts with a slight delay
    setTimeout(() => {
      setAnimate(true);
    }, 600);
  }, []);

  // Handle button click to show roadmap with transition
  const handleSeePathsClick = () => {
    // Add fade-out animation to current view
    setAnimate(false);
    
    // Wait for fade-out before changing view
    setTimeout(() => {
      setShowRoadmap(true);
    }, 500);
  };

  // Handle back button click to return to form
  const handleBackClick = () => {
    setShowRoadmap(false);
    
    // Reset animation for flow chart view
    setTimeout(() => {
      setAnimate(true);
    }, 300);
  };

  return (
    <>
            <AnimatedBackground>

      <div className="PathsPage">
        <Navbar />
        
        <header className="PathsPage-header">
          <h1 className="PathsPage-main-title">Your Career Path</h1>
          <p className="PathsPage-subtitle">
            Discover your journey from{" "}
            <span className="highlight">{userData?.currentClass || "education"}</span> to{" "}
            <span className="highlight">{userData?.dreamJob || "dream career"}</span>
          </p>
        </header>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your career data...</p>
          </div>
        ) : showRoadmap ? (
          // Display the career roadmap with filtered steps based on current class
          <CareerRoadmap 
            pathsData={pathsData} 
            currentClass={userData?.currentClass} 
            dreamJob={userData?.dreamJob} 
            onBackClick={handleBackClick}
          />
        ) : (
          // Display the form summary
          <div className="flow-chart-container">
            {/* Current class box */}
            <div className={`flow-chart-box current-class ${animate ? 'animate-in' : ''}`}>
              <h3>Current Class</h3>
              <p>{userData?.currentClass || "Not specified"}</p>
            </div>
            
            {/* Animated arrow connecting the boxes */}
            <div className={`flow-chart-arrow ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.2s' }}>
              <svg width="40" height="80" viewBox="0 0 40 80">
                <path d="M20 0 L20 60 L10 50 L20 70 L30 50 L20 60" stroke="#333" fill="none" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Sector box */}
            <div className={`flow-chart-box goal-field ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <h3>Preferred Sector</h3>
              <p>{userData?.sector || "Not specified"}</p>
            </div>
            
            {/* Animated arrow connecting the boxes */}
            <div className={`flow-chart-arrow ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.6s' }}>
              <svg width="40" height="80" viewBox="0 0 40 80">
                <path d="M20 0 L20 60 L10 50 L20 70 L30 50 L20 60" stroke="#333" fill="none" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Dream job box */}
            <div className={`flow-chart-box goal-field ${animate ? 'animate-in' : ''}`} style={{ transitionDelay: '0.8s' }}>
              <h3>Dream Job</h3>
              <p>{userData?.dreamJob || "Not specified"}</p>
            </div>
            
            {/* Button to see paths */}
            <div className="button-container">
              <button 
                className="PathsPage-apply"
                onClick={handleSeePathsClick}
                disabled={!userData}
              >
                See Available Paths
              </button>
            </div>
          </div>
        )}
      </div>
      
      </AnimatedBackground>
      <Footer />

    </>
  );
};

export default Paths;