import React, { useEffect, useState } from "react";
import unidata from "./data.json";
import "./university.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import CardHolder from "./CardHolder";
import { auth } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const University = () => {
  const [isLoggedIn, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLogin(!!user);
    });

    // Simulate loading with a shorter timeout for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    // Ensure the background is set to dark
    document.body.style.backgroundColor = "#121212";

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const renderSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <motion.div
        key={`skeleton-${index}`}
        className="card skeleton-card"
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

  return (
    <div className="universityPage">
      <Navbar />
      <motion.header 
        className="universityPage-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="universityPage-main-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="gradient-text">Discover Top Universities</span>
        </motion.h1>
      
        <motion.div 
          className="search-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
        
        
        </motion.div>
      </motion.header>

      <main className="universityPage-content">
        <CardHolder 
          items={unidata} 
          loading={loading} 
          renderSkeletons={renderSkeletons} 
        />
      </main>
      <Footer />
    </div>
  );
};

export default University;