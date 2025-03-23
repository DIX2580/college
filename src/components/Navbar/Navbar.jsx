import { useEffect, useState, useCallback, useContext } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/logo.webp";
import { auth } from "../../firebase/auth";
import { ThemeContext } from "../../App";
import { toast } from "react-toastify";
import "./Navbar.css"; // We'll create this file separately

const signOutUser = (navigate, setError) => {
  signOut(auth)
    .then(() => {
      navigate("/");
    })
    .catch((err) => {
      setError(err.message);
    });
};

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [login, setLogin] = useState(localStorage.getItem("login") || "");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedLogin = localStorage.getItem("login");
      setLogin(storedLogin);
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    {
      login &&
        auth.onAuthStateChanged((user) => {
          if (user) {
            setUser(user);
          } else {
            setUser(null);
            navigate("/");
          }
        });
    }
  }, [navigate, login]);

  const handleSignOut = useCallback(() => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("login");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message, {
          className: "toast-message",
        });
      });
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        toggleMenu();
      }
    },
    [toggleMenu]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`navbar ${isScrolled ? "scrolled" : ""} ${
        theme === "dark" ? "dark-mode" : ""
      }`}
    >
      <div className="navbar-container">
        <LogoSection login={login} />
        
        {/* Desktop Menu */}
        <div className="desktop-menu">
          <DesktopMenu user={user} handleSignOut={handleSignOut} theme={theme} toggleTheme={toggleTheme} />
        </div>
        
        {/* Mobile Menu Button */}
        <HamburgerButton
          toggleMenu={toggleMenu}
          menuOpen={menuOpen}
          handleKeyPress={handleKeyPress}
        />
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            user={user}
            handleSignOut={handleSignOut}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const LogoSection = ({ login }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="logo-section"
  >
    <Link to={login ? "/dashboard" : "/"} className="logo-link">
      <img src={Logo} alt="Logo" className="logo-image" />
    </Link>
  </motion.div>
);

const DesktopMenu = ({ user, handleSignOut, theme, toggleTheme }) => {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },

    { name: "Top Universities", href: "/topuniversities" },
    { name: "Paths", href: "/Paths" },
    { name: "Courses", href: "/courses" },
    { name: "Career Support", href: "/careersupport" },

  ];

  return (
    <div className="menu-items">
      {menuItems.map((item, index) => (
        <NavItem key={index} href={item.href} name={item.name} />
      ))}
      
      {user ? (
        <>
          <NavItem onClick={handleSignOut} name="Log Out" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/profile"}
            className="profile-button"
          >
            Profile
          </motion.button>
        </>
      ) : (
        <NavItem href="/" name="Login" />
      )}
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="theme-toggle-button"
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

const NavItem = ({ href, name, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="nav-item-container"
  >
    {onClick ? (
      <a
        onClick={onClick}
        className="nav-item"
      >
        {name}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
          className="nav-item-underline"
        />
      </a>
    ) : (
      <a
        href={href}
        className="nav-item"
      >
        {name}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
          className="nav-item-underline"
        />
      </a>
    )}
  </motion.div>
);

const HamburgerButton = ({ toggleMenu, menuOpen, handleKeyPress }) => (
  <motion.div
    whileTap={{ scale: 0.9 }}
    className="hamburger-container"
  >
    <button
      onClick={toggleMenu}
      onKeyDown={handleKeyPress}
      aria-label="Toggle menu"
      className="hamburger-button"
    >
      <div className="hamburger-icon">
        <motion.div
          animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className={`hamburger-line ${menuOpen ? "open-top" : ""}`}
        />
        <motion.div
          animate={menuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          className={`hamburger-line ${menuOpen ? "open-middle" : ""}`}
        />
        <motion.div
          animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className={`hamburger-line ${menuOpen ? "open-bottom" : ""}`}
        />
      </div>
    </button>
  </motion.div>
);

const MobileMenu = ({ user, handleSignOut, theme, toggleTheme }) => {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },

    { name: "Top Universities", href: "/topuniversities" },
    { name: "Paths", href: "/Paths" },
    { name: "Courses", href: "/courses" },
    { name: "Career Support", href: "/careersupport" },
    
  ];

  const menuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div
      variants={menuVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="mobile-menu"
    >
      <div className="mobile-menu-container">
        <div className="mobile-menu-items">
          {menuItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="mobile-menu-item-wrapper">
              <a
                href={item.href}
                className="mobile-menu-item"
              >
                {item.name}
              </a>
            </motion.div>
          ))}
          
          {user ? (
            <>
              <motion.div variants={itemVariants} className="mobile-menu-item-wrapper">
                <a
                  onClick={handleSignOut}
                  className="mobile-menu-item"
                >
                  Log Out
                </a>
              </motion.div>
              <motion.div variants={itemVariants} className="mobile-menu-item-wrapper">
                <a
                  href="/profile"
                  className="mobile-menu-item profile-link"
                >
                  Profile
                </a>
              </motion.div>
            </>
          ) : (
            <motion.div variants={itemVariants} className="mobile-menu-item-wrapper">
              <a
                href="/"
                className="mobile-menu-item"
              >
                Login
              </a>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants} className="theme-toggle-container">
            <div className="theme-toggle-wrapper">
              <span className="theme-label">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
              <button
                onClick={toggleTheme}
                className="theme-toggle-button-mobile"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;