import React, { useEffect, useState } from "react";
import unidata from "./data.json";
import "./university.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const University = () => {
  const [isLoggedIn, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLogin(!!user);
    });

    // Check preferred color scheme
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);

    // Add listener for color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleColorSchemeChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleColorSchemeChange);

    // Simulate loading with a shorter timeout for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      unsubscribe();
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        className="universityPage-card skeleton-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="skeleton-img"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-company"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-location"></div>
      </motion.div>
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`universityPage ${darkMode ? 'dark' : 'light'}`} id={darkMode ? 'dark' : 'light'} data-theme={darkMode ? 'dark' : 'light'}>
      <Navbar />
      <header className="universityPage-header">
        <motion.h1 
          className="universityPage-main-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Top Universities
        </motion.h1>
        <motion.p 
          className="universityPage-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore prestigious educational institutions worldwide
        </motion.p>
       
      </header>

      <main className="universityPage-content">
        <motion.div 
          className="universityPage-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            renderSkeletons()
          ) : (
            unidata.map((university, index) => (
              <motion.div
                key={university.id || index}
                className="universityPage-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" 
                }}
              >
                <div className="universityPage-image-container">
                  <motion.img
                    src={university.image || `https://source.unsplash.com/300x180/?university,${university.name}`}
                    alt={university.name}
                    className="universityPage-image"
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <h2 className="universityPage-title">{university.name}</h2>
                <p className="universityPage-company">
                  <a href={university.website} className="universityPage-link" target="_blank" rel="noopener noreferrer">
                    {university.website}
                  </a>
                </p>
                <p className="universityPage-stats">
                  <span className="universityPage-stats-label">Students:</span>
                  {university.students}
                </p>
                <p className="universityPage-location">
                  <span className="universityPage-location-label">Location:</span>
                  {university.location}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default University;