import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "./CardHolder.css";

// Animated Background Component
const AnimatedBackground = ({ children }) => {
  return (
    <div className="animated-background">
      <div className="gradient-blob blob-1"></div>
      <div className="gradient-blob blob-2"></div>
      <div className="gradient-blob blob-3"></div>
      <div className="noise-overlay"></div>
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

const SearchableCardHolder = ({ items, loading, renderSkeletons }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.location.toLowerCase().includes(query) ||
      (item.website && item.website.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const searchBoxVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedBackground>
      <motion.div 
        className="search-container"
        variants={searchBoxVariants}
        initial="hidden"
        animate="visible"
        style={{
          margin: "0 auto 2rem",
          maxWidth: "600px",
          padding: "0 2rem"
        }}
      >
        <div className="search-box" style={{
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            style={{
              position: "absolute",
              left: "16px",
              width: "20px",
              height: "20px",
              stroke: "#818cf8",
              pointerEvents: "none"
            }}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search universities by name, location, or website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "400px",
              padding: "1rem 1rem 1rem 3rem",
              borderRadius: "0.75rem",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              background: "rgba(30, 30, 30, 0.7)",
              color: "white",
              fontSize: "1rem",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease"
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px"
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#a1a1aa" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="card-holder"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          renderSkeletons()
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <motion.div
              key={item.id || index}
              className="card"
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              initial="hidden"
              animate="visible"
            >
              <div className="card-glass-effect"></div>
              <div className="card-image-container">
                <motion.img
                  src={item.image || `https://source.unsplash.com/300x180/?university,${item.name}`}
                  alt={item.name}
                  className="card-image"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.5 }
                  }}
                  loading="lazy"
                />
                <motion.div
                  className="card-badge"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {item.students} students
                </motion.div>
              </div>
              <motion.div
                className="card-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <h2 className="card-title">
                  {item.name}
                  <span className="card-title-underline"></span>
                </h2>
                <p className="card-website">
                  <a href={item.website} className="card-link" target="_blank" rel="noopener noreferrer">
                    {item.website}
                  </a>
                </p>
                <p className="card-location">
                  <svg xmlns="http://www.w3.org/2000/svg" className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {item.location}
                </p>
              </motion.div>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "3rem",
              color: "#a1a1aa",
              background: "rgba(30, 30, 30, 0.7)",
              borderRadius: "1rem",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(99, 102, 241, 0.1)"
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#818cf8" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ marginBottom: "1rem" }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <h3 style={{ color: "white", marginBottom: "0.5rem" }}>No universities found</h3>
            <p>Try adjusting your search criteria</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatedBackground>
  );
};

export default SearchableCardHolder;