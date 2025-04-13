import React, { useEffect } from "react";
import "./Courses.css";
import coursesData from "./courses.json";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/auth";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";

const CashfreeButton = () => (
  <a href="https://payments.cashfree.com/forms/sucessdsa" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
    <div className="button-container" style={{ background: '#000', border: '1px solid black', borderRadius: '15px', display: 'flex', padding: '10px', width: 'fit-content', cursor: 'pointer' }}>
      <div>
        <img src="https://cashfree-checkoutcartimages-prod.cashfree.com/logoH8d8q8h2pv80_prod.png" alt="logo" className="logo-container" style={{ width: '40px', height: '40px' }} />
      </div>
      <div className="text-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px', justifyContent: 'center', marginRight: '10px' }}>
        <div style={{ fontFamily: 'Arial', color: '#fff', marginBottom: '5px', fontSize: '14px' }}>
          Pay Now
        </div>
        <div style={{ fontFamily: 'Arial', color: '#fff', fontSize: '10px' }}>
          <span>Powered By Cashfree</span>
          <img src="https://cashfreelogo.cashfree.com/cashfreepayments/logosvgs/Group_4355.svg" alt="logo" className="seconday-logo-container" style={{ width: '16px', height: '16px', verticalAlign: 'middle' }} />
        </div>
      </div>
    </div>
  </a>
);

const Courses = () => {
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="courses-container">
        <motion.h1
          className="courses-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Available Courses
        </motion.h1>
        
        <div className="courses-list">
          {coursesData.map((course, index) => (
            <motion.div
              className="course-card"
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
              }}
            >
              <div className="course-image-container">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                  loading="lazy"
                />
                <div className="course-overlay">
                  {/* Replace the button with the CashFree button */}
                  <CashfreeButton />
                </div>
              </div>
              
              <motion.div
                className="course-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <h2 className="course-title">{course.title}</h2>
                <p className="course-description">{course.description}</p>
                <div className="course-details">
                  <div className="detail-item">
                    <span className="detail-label">Instructor:</span>
                    <span className="detail-value">{course.instructor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{course.duration}</span>
                  </div>
                  <div className="detail-item price">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value price-value">{course.price}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses;