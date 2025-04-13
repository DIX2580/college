import React, { useState, useEffect } from "react";
import "./CareerRoadmap.css";


const CareerRoadmap = ({ pathsData, currentClass, dreamJob, onBackClick }) => {
  const [careerPaths, setCareerPaths] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [animationDelays, setAnimationDelays] = useState({});
  // Add animation progress state
  const [progressAnimation, setProgressAnimation] = useState(false);

  useEffect(() => {
    // Find the career paths for the selected job and filter based on current class
    const initializeCareerPaths = () => {
      try {
        // Convert current class to starting step
        const startingStep = determineStartingStep(currentClass);
        setCurrentStep(startingStep);
        
        // Find job matching the dream job in both sectors
        const paths = findJobPaths(pathsData, dreamJob);
        if (paths.length === 0) return [];
        
        // Filter paths to only show steps from current education level onward
        // AND match the specific education type (like BSc)
        const filteredPaths = filterPathSteps(paths, startingStep, currentClass);
        
        // Set up animation delays
        setupAnimationDelays(filteredPaths);
        
        return filteredPaths;
      } catch (error) {
        console.error("Error initializing career paths:", error);
        return [];
      }
    };

    // Trigger animation after data is loaded
    const foundPaths = initializeCareerPaths();
    setCareerPaths(foundPaths);
    
    setTimeout(() => {
      setAnimate(true);
      // Delay progress bar animation slightly after steps appear
      setTimeout(() => {
        setProgressAnimation(true);
      }, 800);
    }, 500);
  }, [pathsData, currentClass, dreamJob]);

  // Helper function to determine starting step based on current class
  const determineStartingStep = (classLevel) => {
    if (!classLevel) return 1;
    
    // Map education levels to step numbers
    if (classLevel.match(/^(5th|6th|7th|8th|9th|10th)$/)) {
      return 1; // Class 5-10
    } else if (classLevel.match(/^(11th|12th)$/)) {
      return 2; // Class 11-12
    } else if (classLevel.match(/^(Btech|B\.tech|Bsc|B\.sc|BE|B\.E|BCA|B\.CA|BA|B\.A|BFA|B\.FA|B\.Des|BJMC|BBA|B\.BA|Bcom|B\.com|BMS|B\.MS|MBBS|BDS|BPharma|B\.Pharma|BPT|BSC Nursing|B\.SC Nursing|LLB|BSW|BHM|BTTM)$/i)) {
      return 3; // Undergraduate level
    } else if (classLevel.includes("Master") || classLevel.includes("M.")) {
      return 4; // Masters level
    }
    
    return 1; // Default to step 1 if no match
  };

  // Helper function to find job paths from both sectors
  const findJobPaths = (data, targetJob) => {
    let jobPaths = [];
    let fullJobName = "";
    
    // Search through both sectors
    const sectors = ["publicSector", "privateSector"];
    
    for (const sectorKey of sectors) {
      const sector = data.jobSectors[sectorKey];
      if (!sector || !sector.jobs) continue;
      
      for (const jobKey in sector.jobs) {
        const job = sector.jobs[jobKey];
        
        // Match by full name or partial name
        if (job.fullName === targetJob || 
            job.fullName.includes(targetJob) || 
            targetJob.includes(job.fullName) ||
            jobKey === targetJob) {
          
          setJobTitle(job.fullName);
          jobPaths = job.careerPaths;
          break;
        }
      }
      
      if (jobPaths.length > 0) break;
    }
    
    return jobPaths;
  };

  // Normalize education names for comparison by removing dots and spaces
  const normalizeEducationName = (name) => {
    if (!name) return '';
    return name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');
  };

  // Updated function to filter paths based on both step number AND education type
  const filterPathSteps = (paths, startingStep, currentClass) => {
    // Normalize the current class name to handle variations with periods, spaces, etc.
    const normalizedCurrentClass = normalizeEducationName(currentClass);
    
    // First, filter paths that match the education type
    const educationTypeFiltered = paths.filter(path => {
      // Find the step that corresponds to the current education level
      const educationStep = path.steps.find(step => step.stepNumber === startingStep);
      
      // If no matching step or no current class specified, include all paths
      if (!educationStep || !currentClass) return true;
      
      // Normalize the description for comparison
      const normalizedDescription = normalizeEducationName(educationStep.description);
      
      // Check if matching - handle different variations (with/without dots)
      return normalizedDescription.includes(normalizedCurrentClass);
    });

    // Then filter steps by starting point
    return educationTypeFiltered.map(path => ({
      ...path,
      steps: path.steps.filter(step => step.stepNumber >= startingStep)
    }));
  };

  // Function to set up animation delays for smoother UI
  const setupAnimationDelays = (paths) => {
    const delays = {};
    paths.forEach((path, pathIndex) => {
      path.steps.forEach((step, stepIndex) => {
        delays[`${pathIndex}-${stepIndex}`] = (pathIndex * 0.5) + (stepIndex * 0.2);
      });
    });
    setAnimationDelays(delays);
  };

  // Function to get color based on path index
  const getPathColor = (pathIndex) => {
    const colors = [
      "#3498db", // Blue
      "#2ecc71", // Green
      "#422A61", // Dark Purple
      "#f39c12", // Yellow
      "#9b59b6", // Purple
      "#FFB6C1"  // Orange
    ];
    return colors[pathIndex % colors.length];
  };

  // Function to get gradient for path header
  const getPathGradient = (pathIndex) => {
    const baseColor = getPathColor(pathIndex);
    return `linear-gradient(135deg, ${baseColor} 0%, ${adjustColor(baseColor, -30)} 100%)`;
  };

  // Helper function to darken/lighten a color
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
  };

  // Function to determine step status (completed, current, future)
  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "future";
  };

  // Function to get animation delay for a specific step
  const getAnimationDelay = (pathIndex, stepIndex) => {
    return animationDelays[`${pathIndex}-${stepIndex}`] || 0;
  };

  // Calculate completion percentage for each path
  const calculateCompletion = (path) => {
    // Always assume 5 total steps for consistency
    const totalSteps = 5;
    const completedSteps = currentStep - 1;
    
    return (completedSteps / totalSteps) * 100;
  };

  return (
  <div>
          <h2 className="roadmap-title">Pathways to {jobTitle || dreamJob}</h2>

    <div className="career-roadmap-container">
      <div className="roadmap-subtitle">
        <p>Current Education Level: <span className="highlight">{currentClass}</span></p>
        <p>Multiple paths are available - select the best fit for your situation</p>
      </div>
      
      <button onClick={onBackClick} className="PathsPage-apply">
        Go Back
      </button>
      
      {careerPaths.length > 0 ? (
        <div className="roadmap-paths-container">
          {careerPaths.map((path, pathIndex) => (
            <div key={`path-${pathIndex}`} className="roadmap-path">
              <div 
                className="path-header" 
                style={{ background: getPathGradient(pathIndex) }}
              >
                <p>{path.pathName || `Option ${pathIndex + 1}`}</p>
                
                {/* Modern Progress Bar */}
                <div className="modern-progress-container">
                  <div className="progress-step-indicators">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={`indicator-${step}`} 
                        className={`progress-step-indicator ${step <= currentStep ? 'active' : ''}`}
                        style={{
                          backgroundColor: step < currentStep ? getPathColor(pathIndex) : 
                                         step === currentStep ? getPathColor(pathIndex) : '#e0e0e0',
                          transition: 'background-color 0.5s ease'
                        }}
                      >
                        {step <= currentStep && <span className="step-checkmark">✓</span>}
                      </div>
                    ))}
                  </div>
                  
                  <div className="progress-track">
                    <div 
                      className={`progress-fill ${progressAnimation ? 'animate' : ''}`} 
                      style={{
                        width: progressAnimation ? `${calculateCompletion(path)}%` : '0%',
                        backgroundColor: getPathColor(pathIndex),
                        boxShadow: `0 0 10px ${adjustColor(getPathColor(pathIndex), 20)}`
                      }}
                    />
                  </div>
                  
                  <div className="progress-percentage">
                    <span className={`percentage-text ${progressAnimation ? 'animate' : ''}`}>
                      {progressAnimation ? Math.round(calculateCompletion(path)) : 0}%
                    </span>
                    <span className="progress-label">Completed</span>
                  </div>
                </div>
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
    <button onClick={onBackClick} className="PathsPage-apply">
        Go Back
      </button>
      
    </div>
  );
};

export default CareerRoadmap;