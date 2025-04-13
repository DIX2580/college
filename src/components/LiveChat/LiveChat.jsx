import React, { useEffect, useRef, useState } from "react";
import "./LiveChat.css";
import Navbar from "../Navbar/Navbar";
import AnimatedBackground from "../Paths/AnimatedBackground";

const LiveChat = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [userData, setUserData] = useState(null);
  const tawkContainerRef = useRef(null);
  const timerRef = useRef(null);

  // Load user data and Tawk.to widget on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // Fetch user data from localStorage
    try {
      const storedData = localStorage.getItem('userCareerData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    
    // Remove any existing Tawk.to scripts
    const existingScript = document.getElementById('tawk-script');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
    
    // Define Tawk variables before loading script
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Set embedded mode
    window.Tawk_API.embedded = 'tawk-embed-container';
    window.Tawk_API.customStyle = {
      zIndex: 1,
      position: 'relative'
    };
    
    // When Tawk is ready, hide the loader and send default message
    window.Tawk_API.onLoad = function() {
      setIsLoading(false);
      
      // Start the session timer when chat loads
      startSessionTimer();
      
      // Send default message about user's career path
      setTimeout(() => {
        if (window.Tawk_API) {
          const currentClass = userData?.currentClass || "not specified";
          const dreamJob = userData?.dreamJob || "not specified";
          
          // Create a simple default message
          const defaultMessage = `The selected class is ${currentClass} and selected dream job is ${dreamJob}`;
          
          // Attempt to send the message using different possible Tawk API methods
          try {
            if (typeof window.Tawk_API.visitor === 'object' && typeof window.Tawk_API.visitor.sendMessage === 'function') {
              window.Tawk_API.visitor.sendMessage(defaultMessage);
            } else if (typeof window.Tawk_API.sendMessage === 'function') {
              window.Tawk_API.sendMessage(defaultMessage);
            } else {
              // If the above methods don't work, try to set the pre-chat message
              if (typeof window.Tawk_API.setAttributes === 'function') {
                window.Tawk_API.setAttributes({
                  message: defaultMessage
                }, function(error) {
                  console.log(error);
                });
              }
            }
          } catch (error) {
            console.error("Error sending initial message:", error);
          }
        }
      }, 2000); // Send message after 2 seconds to ensure chat is fully loaded
    };
    
    const tawkScript = document.createElement('script');
    tawkScript.id = 'tawk-script';
    tawkScript.async = true;
    tawkScript.src = 'https://embed.tawk.to/67ef9bbdf99b5b19067e603e/1invvgnvj';
    tawkScript.charset = 'UTF-8';
    tawkScript.setAttribute('crossorigin', '*');
    document.head.appendChild(tawkScript);

    // Fallback to hide loader after 10 seconds if onLoad doesn't fire
    const timeout = setTimeout(() => {
      setIsLoading(false);
      
      // Start the session timer if it wasn't started by onLoad
      startSessionTimer();
    }, 10000);

    // Clean up function
    return () => {
      clearTimeout(timeout);
      clearInterval(timerRef.current);
      
      if (document.head.contains(tawkScript)) {
        document.head.removeChild(tawkScript);
      }
      
      // Safely reset Tawk variables
      window.Tawk_API = {};
      window.Tawk_LoadStart = null;
    };
  }, []);

  // Start the session timer
  const startSessionTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          // Clear interval and end session when timer reaches zero
          clearInterval(timerRef.current);
          endChatSession();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // End the chat session
  const endChatSession = () => {
    setSessionExpired(true);
    
    // If Tawk API is available, end the chat
    if (window.Tawk_API && typeof window.Tawk_API.endChat === 'function') {
      window.Tawk_API.endChat();
    }
  };

  // Restart the chat session
  const restartSession = () => {
    setSessionExpired(false);
    setTimeRemaining(5 * 60);
    setIsLoading(true);
    
    // Reload the component to restart everything
    window.location.reload();
  };

  return (
    <>
      <Navbar />
      <AnimatedBackground darkMode={true}>
        <div className="livechat-container">
          <header className="livechat-header">
            <h1>Live Chat Support</h1>
            <p>Connect with our counselors in real-time for immediate assistance.</p>
            {!sessionExpired && (
              <div className="session-timer">
                <span className={timeRemaining < 60 ? "time-warning" : ""}>
                  Session expires in: {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </header>
          
          <div className="chat-interface-container">
            {/* Tawk.to chat container */}
            <div
              id="tawk-embed-container"
              ref={tawkContainerRef}
              className={`tawk-embed-container ${isLoading ? 'loading' : 'loaded'}`}
            >
              {isLoading && (
                <div className="chat-loader">
                  <div className="spinner"></div>
                  <p>Connecting to support...</p>
                </div>
              )}
            </div>
            
            {/* Session expired popup overlay */}
            {sessionExpired && (
              <div className="session-expired-overlay">
                <div className="session-expired-popup">
                  <h2>Chat Session Expired</h2>
                  <p>Your chat session has timed out after 5 minutes of inactivity.</p>
                  <button onClick={() => window.location.href = "/dashboard"}>Go to Dashboard</button>                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatedBackground>
    </>
  );
};

export default LiveChat;