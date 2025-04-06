import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ children }) => {
  const geometricBackgroundRef = useRef(null);
  const particlesContainerRef = useRef(null);
  
  // Create geometric shapes
  const createShapes = () => {
    if (!geometricBackgroundRef.current) return;
    
    const background = geometricBackgroundRef.current;
    const shapeTypes = ['ab-square', 'ab-circle', 'ab-triangle', 'ab-rectangle'];
    
    for (let i = 0; i < 40; i++) {
      const shape = document.createElement('div');
      const shapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      shape.className = `ab-shape ${shapeClass}`;
      
      // Random positions
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random animation properties
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 10;
      
      // Apply styles
      shape.style.left = `${posX}%`;
      shape.style.top = `${posY}%`;
      shape.style.animationDelay = `${delay}s`;
      shape.style.animationDuration = `${duration}s`;
      
      background.appendChild(shape);
    }
  };
  
  // Create particles
  const createParticles = () => {
    if (!particlesContainerRef.current) return;
    
    const particlesContainer = particlesContainerRef.current;
    
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      particle.className = 'ab-particle';
      
      // Random positions
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random animation properties
      const delay = Math.random() * 8;
      const duration = Math.random() * 4 + 4;
      
      // Apply styles
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  };
  
  // Add mouse interaction
  const addMouseInteraction = () => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const shapes = document.querySelectorAll('.ab-shape');
      shapes.forEach(shape => {
        const speed = 0.05;
        const shapeX = parseFloat(shape.style.left);
        const shapeY = parseFloat(shape.style.top);
        
        shape.style.left = `${shapeX + (x - 0.5) * speed}%`;
        shape.style.top = `${shapeY + (y - 0.5) * speed}%`;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  };
  
  useEffect(() => {
    createShapes();
    createParticles();
    const cleanupMouseInteraction = addMouseInteraction();
    
    // Cleanup function
    return () => {
      cleanupMouseInteraction();
      if (geometricBackgroundRef.current) {
        geometricBackgroundRef.current.innerHTML = '';
      }
      if (particlesContainerRef.current) {
        particlesContainerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount
  
  return (
    <div className="ab-wrapper">
      <div className="ab-geometric-background" ref={geometricBackgroundRef}></div>
      <div className="ab-particles-container" ref={particlesContainerRef}></div>
      <div className="ab-gradient-overlay"></div>
      
      {/* Content container */}
      <div className="ab-content-container">
        {children}
      </div>
      
      <style jsx global>{`
        .ab-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: var(--color-background, #f5f5f5);
          overflow: hidden;
        }
        
        .ab-content-container {
          position: relative;
          width: 100%;
          min-height: 100vh;
          z-index: 10;
        }
        
        .ab-geometric-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        
        .ab-shape {
          position: absolute;
          opacity: 0.1;
          transform-origin: center;
        }
        
        .ab-square {
          width: 40px;
          height: 40px;
          background: var(--color-primary, #1890ff);
          animation: ab-rotate 20s infinite linear;
        }
        
        .ab-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--color-item, #4cc9f0);
          animation: ab-pulse 15s infinite alternate;
        }
        
        .ab-triangle {
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 50px solid var(--color-item, #7209b7);
          animation: ab-float 12s infinite ease-in-out;
        }
        
        .ab-rectangle {
          width: 80px;
          height: 30px;
          background: var(--color-primary, #4361ee);
          animation: ab-slide 18s infinite linear;
        }
        
        .ab-particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .ab-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: var(--color-primary, #1890ff);
          opacity: 0.3;
          animation: ab-sparkle 8s infinite linear;
        }
        
        .ab-gradient-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, var(--color-background, #f5f5f5) 80%);
          z-index: 5;
          animation: ab-pulse-overlay 10s infinite alternate;
        }
        
        #dark .ab-gradient-overlay {
          background: radial-gradient(circle at center, transparent 0%, #121212 80%);
        }
        
        @keyframes ab-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes ab-pulse {
          0% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(1);
            opacity: 0.1;
          }
        }
        
        @keyframes ab-float {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(20px) rotate(180deg);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(360deg);
          }
        }
        
        @keyframes ab-slide {
          0% {
            transform: translateX(-100px) rotate(0deg);
          }
          50% {
            transform: translateX(100px) rotate(180deg);
          }
          100% {
            transform: translateX(-100px) rotate(360deg);
          }
        }
        
        @keyframes ab-sparkle {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
        
        @keyframes ab-pulse-overlay {
          0% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;