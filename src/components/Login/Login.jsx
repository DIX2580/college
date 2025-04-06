import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState, useCallback, useContext } from "react";
import Tilt from "react-parallax-tilt";
import { Link, useNavigate } from "react-router-dom";
import meeting2 from "../../assets/meeting.webp";
import hide from "../../assets/hide.png";
import show from "../../assets/show.png";
import { auth, googleAuthProvider, database } from "../../firebase/auth";
import { ref, get } from "firebase/database";
import "./Login.css";
import { FaEnvelope, FaKey } from "react-icons/fa";
import validate from "../../common/validation";
import Footer from "../Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import { Switch } from "antd";
import { ThemeContext } from "../../App";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../action/action";
import Navbar from "../Navbar/Navbar";

const fetchUserDataByEmail = async (email) => {
  try {
    // Get the user ID using the email
    const encodedEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
    const emailRef = ref(database, `email/${encodedEmail}`);
    const emailSnapshot = await get(emailRef);
    if (emailSnapshot.exists()) {
      const userId = emailSnapshot.val();
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        return userData;
      } else {
        console.error("No user data available");
        return null;
      }
    } else {
      console.error("No user ID found for the provided email");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

//extra started
// Animated Background Component
const AnimatedBackground = ({ children }) => {
  const geometricBackgroundRef = useCallback((node) => {
    if (node !== null) {
      // Clear any existing shapes
      node.innerHTML = '';
      
      // Create shapes
      const shapeTypes = ['square', 'circle', 'triangle', 'rectangle'];
      
      for (let i = 0; i < 40; i++) {
        const shape = document.createElement('div');
        const shapeClass = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.className = `shape ${shapeClass}`;
        
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
        
        node.appendChild(shape);
      }
    }
  }, []);
  
  const particlesContainerRef = useCallback((node) => {
    if (node !== null) {
      // Clear any existing particles
      node.innerHTML = '';
      
      // Create particles
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
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
        
        node.appendChild(particle);
      }
    }
  }, []);
  
  // Add mouse interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      const shapes = document.querySelectorAll('.shape');
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
  }, []);
  
  return (
    <div className="animated-background-wrapper">
      <div className="geometric-background" ref={geometricBackgroundRef}></div>
      <div className="particles" ref={particlesContainerRef}></div>
      <div className="gradient-overlay"></div>
      
      {/* Content container */}
      <div className="container">
        {children}
      </div>
    </div>
  );
};
//extra 
export default function Login() {
  const [error, setError] = useState({});
  const [passwordType, setPasswordType] = useState("password");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  
  const formRef = useCallback(node => {
    // Ref for form element to programmatically submit
    if (node !== null) {
      formRef.current = node;
    }
  }, []);

  // Function for handling inputs
  const handleLoginInfo = useCallback(
    (e) => {
      const { name, value } = e.target;
      let errObj;

      // Validate based on input name
      if (name === "password") {
        errObj = validate.loginPassword(value);
      } else {
        errObj = validate[name](value);
      }

      // Update loginInfo and error state
      setLoginInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError((prev) => ({
        ...prev,
        ...errObj,
      }));
    },
    []
  );

  const passwordToggle = useCallback(() => {
    if (passwordType === "password") {
      setPasswordType("text");
    } else setPasswordType("password");
  }, [passwordType]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        const userData = await fetchUserDataByEmail(user.email);

        dispatch(loginSuccess(userData));

        localStorage.setItem("userUid", userData.id);
        
        toast.success("Authenticating your credentials… 🚀", {
          className: "toast-message",
        });
        localStorage.setItem("login", true);
        localStorage.setItem("count", true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    });
  }, [navigate, dispatch]);

  const fetchUserData = async (uid) => {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      localStorage.setItem("Userid", userData.id);
      return userData;
    } else {
      console.error("No data available");
      return null;
    }
  };

  // if signin with EmailId/password success then navigate to /dashboard
  const handleSignIn = useCallback((e) => {
    e.preventDefault();
    let submitable = true;

    Object.values(error).forEach((err) => {
      if (err !== false) {
        submitable = false;
        return;
      }
    });
    
    if (submitable) {
      signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
        .then(async () => {
          toast.success("Login successful!", {
            className: "toast-message",
          });
          
          setTimeout(async () => {
            const user = localStorage.getItem("userUid");
            const response = await fetchUserData(user); // Fetch user data after login
            console.log("response user", response);
            dispatch(loginSuccess(response));
            localStorage.setItem("login", true);
            navigate("/dashboard");
          }, 2000);
        })
        .catch((err) => {
          if (err.code === "auth/wrong-password") {
            toast.error("Incorrect Password!", {
              className: "toast-message",
            });
          } else if (err.code === "auth/user-not-found") {
            toast.error("This email is not registered", {
              className: "toast-message",
            });
          } else {
            console.error("Sign-in error", err);
            toast.error("An error occurred. Please try again!", {
              className: "toast-message",
            });
          }
        });
    } else {
      toast.error("Please fill all Fields with Valid Data.", {
        className: "toast-message",
      });
    }
  }, [error, loginInfo, dispatch, navigate, fetchUserData]);
  
  // Popup Google signin
  const SignInGoogle = useCallback(() => {
    signInWithPopup(auth, googleAuthProvider)
      .then(() => {
        toast.success("Login successful!", {
          className: "toast-message",
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      })
      .catch((err) =>
        toast.error(err.message, {
          className: "toast-message",
        })
      );
  }, [navigate]);

  // Guest login function
  const handleGuestLogin = useCallback((e) => {
    e.preventDefault();
    
    // Set guest credentials
    setLoginInfo({
      email: "Guest@Guest.com",
      password: "Guest@123"
    });
    
    // Add small delay to ensure state is updated before submitting
    setTimeout(() => {
      signInWithEmailAndPassword(auth, "Guest@Guest.com", "Guest@123")
        .then(() => {
          toast.success("Guest login successful!", {
            className: "toast-message",
          });
          setTimeout(() => {
            localStorage.setItem("login", true);
            navigate("/dashboard");
          }, 2000);
        })
        .catch((err) => {
          console.error("Guest login error", err);
          toast.error("Guest login failed. Please try again!", {
            className: "toast-message",
          });
        });
    }, 100);
  }, [navigate]);

  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="app-container">
      <AnimatedBackground>
        <main>
          <Navbar isLoginPage={true} />
          <div className="login-container">
            <div className="parent">
              {/* This is the right side of the login page */}
              <ToastContainer />
              <div className="right">
                <h1 className="counsellor"></h1>
                <div className="sign-in">Log in to your account</div>

                {/* Login form */}
                <form className="form" onSubmit={handleSignIn} ref={formRef}>
                  <div>
                    <label htmlFor="email">Email</label>
                    <div className="iconContainer">
                      <input
                        id="email"
                        type="text"
                        name="email"
                        onChange={handleLoginInfo}
                        value={loginInfo.email}
                        placeholder="Email"
                        required
                        className={`${error.emailError && "inputField"}`}
                      />
                      <FaEnvelope className="icons" />
                    </div>

                    {error.email && error.emailError && (
                      <p className="errorShow">{error.emailError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <div className="password-input">
                      <div className="iconContainer">
                        <input
                          id="password"
                          name="password"
                          type={passwordType}
                          onChange={handleLoginInfo}
                          value={loginInfo.password}
                          required
                          placeholder="Password"
                          className={`${error.passwordError && "inputField"}`}
                        />
                        <FaKey className="icons" />
                        <div onClick={passwordToggle} className="toggle-button">
                          <img
                            height={20}
                            width={20}
                            src={passwordType === "password" ? hide : show}
                            alt="password-toggle"
                          />
                        </div>
                        {error.password && error.passwordError && (
                          <p className="errorShow">{error.passwordError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="remember-me">
                    <input type="checkbox" id="remember-me" />
                    <label htmlFor="remember-me"> Remember me</label>
                  </div>
                  <button className="login_btn" type="submit">
                    Login
                  </button>
                </form>
                <div className="btn">
                  <Link to="/forgotpassword" className="forgot-password">
                    Forgot Your password?
                  </Link>
                </div>
                <div className="dont-have-account">
                  <Link to="/signup" className="forgot-password">
                    Don't have an account?
                  </Link>
                </div>
                <div className="Guest-Login">
                  <button 
                    onClick={handleGuestLogin} 
                    className="forgot-password" 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}
                  >
                    Guest Login
                  </button>
                </div>
                <div className="get-app">
                  {/* App download links (commented out) */}
                </div>
              </div>
              {/* This is the left side of the login page */}
              <div className="left">
                <Tilt>
                  <img src={meeting2} alt="meeting" />
                </Tilt>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </AnimatedBackground>
    </div>
  );
}