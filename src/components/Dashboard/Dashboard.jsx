import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Iridescence from "./Iridescence"; // Make sure this path is correct
import AnimatedBackground from "../Paths/AnimatedBackground";

const slideToCenter = {
  hidden: { x: 150, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

const slideInFromLeft = {
  hidden: { x: -150, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
};

const Dashboard = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let waveHeight = 40;
    let waveSpeed1 = 1.2;
    let waveSpeed2 = 0.2;
    let waveSpeed3 = 1;
    let waveLength = 0.01;

    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient1.addColorStop(0, "rgba(135, 206, 235, 0.8)");
      gradient1.addColorStop(1, "rgba(135, 206, 235, 0)");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient2.addColorStop(0, "rgba(221, 160, 221, 1)");
      gradient2.addColorStop(1, "rgba(221, 160, 221, 0)");

      const gradient3 = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient3.addColorStop(0, "rgba(144, 238, 144, 0.8)");
      gradient3.addColorStop(1, "rgba(144, 238, 144, 0)");

      function drawLayer(speed, height, gradient) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x < canvas.width; x++) {
          let y = Math.sin(x * waveLength + speed * performance.now() / 1000) * height + canvas.height / 2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      drawLayer(waveSpeed1, waveHeight, gradient1);
      drawLayer(waveSpeed2, waveHeight * 0.8, gradient2);
      drawLayer(waveSpeed3, waveHeight * 0.6, gradient3);
    }

    function animate() {
      drawWave();
      requestAnimationFrame(animate);
    }

    animate();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div>
  <main className="flex flex-col min-h-screen bg-black relative overflow-hidden">
    <Navbar />
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    <div className="flex-grow flex flex-col items-center justify-center relative text-center">
      <div>
        

        
      </div>

      <motion.div
        style={{
          width: "90%",          // Responsive width
          maxWidth: "1000px",     // Maximum size for larger screens
          height: "400px",       
          maxHeight: "400px",    // Maintain aspect ratio in bigger screens
          borderRadius: "200px",  // Rounded corners
          border: "10px solid white", // White stroke
        }}
      >
      
        <Iridescence
        
          color={[0.8, 0.5, 1.0]} 
          speed={.2}
          amplitude={1.5}
          mouseReact={true}
          style={{ width: "50%", height: "50%" }}
          
        />
        
      </motion.div>
    </div>

    <Footer />
  </main>
</div>
  );
};

export default Dashboard;