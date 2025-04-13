import React, { useState, useEffect } from 'react';
import './FAQs.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('General');
  const [activeIndex, setActiveIndex] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);

  const faqData = {
    General: [
      {
        question: "What is Career Path Guide?",
        answer: "Career Path Guide is an interactive tool designed to help students and professionals discover optimal paths to their dream careers based on their current education level and career goals. We provide personalized roadmaps with step-by-step guidance."
      },
      {
        question: "How accurate are the career paths shown?",
        answer: "Our career paths are developed based on industry standards, educational requirements, and input from professionals in various fields. While we strive for accuracy, we recommend using our guidance alongside consultation with academic advisors or career counselors."
      },
      {
        question: "Can I save my results?",
        answer: "Yes, your results are automatically saved in your browser's local storage. You can return to the site later and pick up where you left off. In the future, we plan to add user accounts for more persistent storage."
      },
      {
        question: "Is this service free?",
        answer: "Yes, the Career Path Guide is completely free to use. We may introduce premium features in the future, but our core guidance will always remain free."
      }
    ],
    Build_Career: [
      {
        question: "How do I start building my career path?",
        answer: "To start building your career path, simply fill out the form on our homepage. Enter your name, current education level, preferred sector, and dream job. Our system will then generate personalized career paths based on your inputs."
      },
      {
        question: "What educational qualifications are considered?",
        answer: "We consider various educational levels from 10th grade through PhD, as well as working professionals. Our system adapts recommendations based on your current educational status and the requirements of your target career."
      },
      {
        question: "Can I build multiple career paths?",
        answer: "Yes, you can explore different career paths by changing your inputs. Feel free to experiment with different sectors and dream jobs to see various path options."
      },
      {
        question: "How do I build skills for my chosen career?",
        answer: "Each career path includes recommended skills and learning resources. We suggest courses, certifications, and practical experiences that will help you develop the necessary skills for your chosen career."
      }
    ],
    Promote: [
      {
        question: "How can I promote myself with the knowledge gained?",
        answer: "Use the roadmap to highlight your strategic career planning when networking or interviewing. Mention specific skills and qualifications you've acquired based on the recommended path, showing employers your commitment to professional development."
      },
      {
        question: "Are there networking opportunities through this platform?",
        answer: "Currently, we don't offer direct networking capabilities, but we plan to incorporate community features in future updates. For now, we provide guidance on where and how to network effectively for your specific career path."
      },
      {
        question: "How do I showcase my career progression?",
        answer: "We recommend creating a professional portfolio or LinkedIn profile that highlights the milestones you've achieved along your career path. Document your learning journey, projects, and achievements to demonstrate your growth."
      }
    ],
    Manage: [
      {
        question: "How do I manage career transitions?",
        answer: "Our system provides specific guidance for career transitions, including steps to minimize risk and maximize success. We highlight transferable skills, suggest bridge roles, and outline additional training that may be necessary."
      },
      {
        question: "Can I track my progress along the career path?",
        answer: "Currently, we don't offer progress tracking, but we're developing a feature that will allow users to mark completed steps and track their advancement along their chosen career path."
      },
      {
        question: "How often should I update my career plan?",
        answer: "We recommend reviewing your career plan annually or whenever significant changes occur in your professional life or industry. Regular assessments help ensure your path remains aligned with your evolving goals."
      },
      {
        question: "What if I'm falling behind on my timeline?",
        answer: "Career development rarely follows a perfect timeline. If you're falling behind, focus on quality over speed. Our paths provide general timeframes, but individual progress may vary based on circumstances and opportunities."
      }
    ],
    Integrations: [
      {
        question: "Can I integrate my LinkedIn profile?",
        answer: "We're currently developing LinkedIn integration that will allow us to provide more personalized recommendations based on your existing profile and network. This feature will be available in a future update."
      },
      {
        question: "Does this integrate with any learning platforms?",
        answer: "We don't currently offer direct integrations with learning platforms, but we provide links to relevant courses and resources that match your career path needs."
      },
      {
        question: "Are there any API integrations available?",
        answer: "We're developing an API for educational institutions and career counseling services. If you're interested in integrating our career path recommendations into your platform, please contact us."
      }
    ],
    Legal: [
      {
        question: "How is my data stored and used?",
        answer: "We store your inputs locally in your browser using localStorage. We don't collect or store personal data on our servers unless you explicitly create an account. Your information is used solely to generate personalized career recommendations."
      },
      {
        question: "Are there any age restrictions for using this service?",
        answer: "Our service is designed for users 13 and older. While we don't collect personal information, users under 18 should have parental guidance when exploring career options."
      },
      {
        question: "What are the terms of service?",
        answer: "Our service is provided 'as is' without any guarantees regarding career outcomes. We provide guidance based on best practices and industry standards, but individual results may vary based on numerous factors beyond our control."
      }
    ]
  };

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(null);
    setAnimatedItems([]);
  }, [activeCategory]);

  // Add staggered animation to FAQ items
  useEffect(() => {
    const items = faqData[activeCategory].map((_, index) => index);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < items.length) {
        setAnimatedItems(prev => [...prev, items[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [activeCategory, faqData]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Format category name for display
  const formatCategoryName = (category) => {
    return category.replace(/_/g, ' ');
  };

  return (
    <div className="faq-container">
      <Navbar />

      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Career Path Guide</p>
      </div>

      <div className="faq-content">
        <div className="faq-sidebar">
          {Object.keys(faqData).map((category) => (
            <div 
              key={category} 
              className={`sidebar-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {formatCategoryName(category)}
            </div>
          ))}
        </div>

        <div className="faq-main">
          <div className="faq-section-header">
            <div className="section-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2>{formatCategoryName(activeCategory)} Questions</h2>
          </div>

          <div className="faq-list">
            {faqData[activeCategory].map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${animatedItems.includes(index) ? 'animated fadeIn' : 'hidden'}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: animatedItems.includes(index) ? 1 : 0,
                  transform: animatedItems.includes(index) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                <button
                  className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points={activeIndex === index ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                    </svg>
                  </span>
                </button>
                <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;