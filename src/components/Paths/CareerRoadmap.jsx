import React, { useState, useEffect } from "react";
import "./CareerRoadmap.css";

const CareerRoadmap = ({ pathsData, currentClass, dreamJob }) => {
  const [careerPaths, setCareerPaths] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [animationDelays, setAnimationDelays] = useState({});

  useEffect(() => {
    // Find the career paths for the selected job
    const findCareerPaths = () => {
      try {
        // Search through both public and private sectors
        const sectors = [
          pathsData.jobSectors.publicSector,
          pathsData.jobSectors.privateSector,
        ];

        for (const sector of sectors) {
          for (const key in sector.jobs) {
            const job = sector.jobs[key];
            if (
              job.fullName === dreamJob ||
              job.fullName.includes(dreamJob) ||
              dreamJob.includes(job.fullName) ||
              key === dreamJob
            ) {
              setJobTitle(job.fullName);
              return filterPathsByClass(job.careerPaths, currentClass);
            }
          }
        }
        return [];
      } catch (error) {
        console.error("Error finding career paths:", error);
        return [];
      }
    };

    // Filter and adjust paths based on current class
    const filterPathsByClass = (paths, currentClass) => {
      if (!currentClass) return paths;
      
      // Determine the starting step based on current class
      let startingStep = 1;
      if (currentClass.includes("11-12")) {
        startingStep = 2;
      } else if (currentClass.includes("Diploma") || currentClass.includes("Bachelor")) {
        startingStep = 3;
      } else if (currentClass.includes("Master")) {
        startingStep = 4;
      }
      
      setCurrentStep(startingStep);
      
      // Filter out steps that are before the current step
      return paths.map(path => ({
        ...path,
        steps: path.steps.filter(step => step.stepNumber >= startingStep)
      }));
    };

    // Set up animation delays based on the number of paths
    const setupAnimationDelays = (paths) => {
      const delays = {};
      paths.forEach((path, pathIndex) => {
        path.steps.forEach((step, stepIndex) => {
          delays[`${pathIndex}-${stepIndex}`] = (pathIndex * 0.5) + (stepIndex * 0.2);
        });
      });
      setAnimationDelays(delays);
    };

    const foundPaths = findCareerPaths();
    setCareerPaths(foundPaths);
    setupAnimationDelays(foundPaths);
    
    // Trigger animation after a short delay
    setTimeout(() => {
      setAnimate(true);
    }, 500);
  }, [pathsData, currentClass, dreamJob]);

  // Function to get color based on path index
  const getPathColor = (pathIndex) => {
    const colors = ["#F9BC60", "#8AC926", "#FF595E", "#1982C4", "#6A4C93"];
    return colors[pathIndex % colors.length];
  };

  // Function to determine step status
  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "future";
  };

  // Function to get animation delay for a specific step
  const getAnimationDelay = (pathIndex, stepIndex) => {
    return animationDelays[`${pathIndex}-${stepIndex}`] || 0;
  };

  // Render back button to return to form
  const handleBackButton = () => {
    window.location.reload();
  };

  return (
    <div className="career-roadmap-container">
      <h2 className="roadmap-title">Pathways to {jobTitle || dreamJob}</h2>
      <div className="roadmap-subtitle">
        <p>Current Education Level: <span className="highlight">{currentClass}</span></p>
        <p>Multiple paths are available - select the best fit for your situation</p>
      </div>
      
      <button onClick={handleBackButton} className="PathsPage-apply" style={{ marginBottom: '2rem' }}>
        Go Back
      </button>
      
      {careerPaths.length > 0 ? (
        <div className="roadmap-paths-container">
          {careerPaths.map((path, pathIndex) => (
            <div key={`path-${pathIndex}`} className="roadmap-path">
              <div className="path-header" style={{ backgroundColor: getPathColor(pathIndex) }}>
                <h3>Path {pathIndex + 1}</h3>
                <p>Steps: {path.steps.length}</p>
              </div>
              <div className="path-steps">
                {path.steps.map((step, stepIndex) => (
                  <React.Fragment key={`step-${pathIndex}-${stepIndex}`}>
                    <div 
                      className={`roadmap-step ${getStepStatus(step.stepNumber)} ${animate ? 'animate-in' : ''}`} 
                      style={{ 
                        backgroundColor: getPathColor(pathIndex),
                        transitionDelay: `${getAnimationDelay(pathIndex, stepIndex)}s`
                      }}
                    >
                      <p className="step-number">Step {step.stepNumber}</p>
                      <p className="step-description">{step.description}</p>
                    </div>
                    {stepIndex < path.steps.length - 1 && (
                      <div 
                        className={`roadmap-arrow ${animate ? 'animate-in' : ''}`} 
                        style={{ transitionDelay: `${getAnimationDelay(pathIndex, stepIndex) + 0.1}s` }}
                      >
                        <svg width="24" height="60" viewBox="0 0 24 60">
                          <path d="M12 0 L12 50 L4 42 L12 60 L20 42 L12 50" stroke={getPathColor(pathIndex)} fill="none" strokeWidth="2" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-paths-message">
          <p>No career paths found for {dreamJob} starting from {currentClass}. Please try a different combination.</p>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;