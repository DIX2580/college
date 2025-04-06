import React from "react";
import "./Blogs.css"; // Import CSS file for styles
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Blogs = () => {
  return (
    <>
      <Navbar />
      <div className="blogs-container">
        <header className="blogs-header">
          <h1>Our Latest Blogs</h1>
          <p>Stay updated with our latest news and articles on counseling.</p>
        </header>
        {/* Content area removed */}
      </div>
      <Footer />
    </> 
  );
};

export default Blogs;