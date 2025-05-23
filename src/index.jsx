import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import CollegePage from "./components/CollegePage/CollegePage";
import {
  About,
  Dashboard,
  ErrorPage,
  ForgotPasswordForm,
  SignUpForm,
  FAQs,
 
} from "./components/index";
import Loading from "./components/Loading/Loading";
import Login from "./components/Login/Login";
import "./index.css";
import Contact from "./components/Contact/Contact";
import ProfilePage from "./components/Profile/index";
import Courses from "./components/Courses/Courses";
import Privacy from "./components/Privacy-Policy/Privacy";
import Terms from "./components/Terms/Terms";
import JoinUs from "./components/Joinus/JoinUs";
import Help from "./components/Help/Help";
import Livechat from "./components/LiveChat/LiveChat";
import CareerSupport from "./components/Career Support/CareerSupport";
import Paths from "./components/Paths/Paths";
import University from "./components/Top Universities/University";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        errorElement: <ErrorPage />,
        element: <Login />,
      },
      {
        path: "/dashboard",
        errorElement: <ErrorPage />,
        element: <Dashboard />,
      },
      {
        path: "/about",
        errorElement: <ErrorPage />,
        element: <About />,
      },
      {
        path: "/contact",
        errorElement: <ErrorPage />,
        element: <Contact />,
      },
      {
        path: "/courses",
        errorElement: <ErrorPage />,
        element: <Courses />,
      },
      {
        path: "/Paths",
        errorElement: <ErrorPage />,
        element: <Paths />,
      },
      {
        path: "/topuniversities",
        errorElement: <ErrorPage />,
        element: <University />,
      },
      {
        path: "/careersupport",
        errorElement: <ErrorPage />,
        element: <CareerSupport />,
      },
      {
        path: "/help",
        errorElement: <ErrorPage />,
        element: <Help />,
      },
      {
        path: "/Livechat",
        errorElement: <ErrorPage />,
        element: <Livechat />,
      },
      {
        path: "/privacy-policy",
        errorElement: <ErrorPage />,
        element: <Privacy />,
      },
      {
        path: "/terms",
        errorElement: <ErrorPage />,
        element: <Terms />,
      },
      {
        path: "/join-us",
        errorElement: <ErrorPage />,
        element: <JoinUs />,
      },
      {
        path: "/signup",
        errorElement: <ErrorPage />,
        element: <SignUpForm />,
      },
      {
        path: "/forgotpassword",
        errorElement: <ErrorPage />,
        element: <ForgotPasswordForm />,
      },
      {
        path: "/college/:id",
        errorElement: <ErrorPage />,
        element: <CollegePage />,
      },
     
      {
        path: "/profile",
        errorElement: <ErrorPage />,
        element: <ProfilePage />,
      },
      {
        path: "/FAQs",
        errorElement: <ErrorPage />,
        element: <FAQs />,
      },
     
     
     
    
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
