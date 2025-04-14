import React, { useState } from "react";
import "./ProfileCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ open, user }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  // Get the token from localStorage
  const token = localStorage.getItem("token");
  
  // Configure axios with authentication header
  const authAxios = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const handleLogout = () => {
    // Clear token and navigate to login page
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdatedUser({
      firstName: user.firstName,
      surname: user.surname,
      email: user.email
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Update user profile via API
      const response = await authAxios.put('/auth/update-profile', updatedUser);
      
      // Update local user state with updated data
      if (response.data) {
        // Update local user state with the response data
        navigate(0); // Refresh the page to reflect changes
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Handle case when user data is not yet loaded
  if (!user) {
    return <div className="profile-card-loading">Loading user data...</div>;
  }

  return (
    <div className={`profile-card ${open ? "open" : ""}`}>
      <div className="profile-card-header">
        <div className="user-avatar">
          {/* Display initials as avatar */}
          <div className="avatar-placeholder">
            {user.firstName && user.firstName[0]}
            {user.surname && user.surname[0]}
          </div>
        </div>
        <div className="user-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={updatedUser.firstName || ""}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                type="text"
                name="surname"
                value={updatedUser.surname || ""}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email || ""}
                onChange={handleChange}
                placeholder="Email"
                disabled // Usually email is not editable for security reasons
              />
              <div className="edit-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{`${user.firstName} ${user.surname}`}</h3>
              <p>{user.email}</p>
              <p>{user.user_type === "student" ? "Student" : "Counsellor"}</p>
              <div className="user-actions">
                <button onClick={handleEdit}>Edit Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}