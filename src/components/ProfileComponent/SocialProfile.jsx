import React, { useState, useEffect } from "react";
import "./SocialProfile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // You'll need to install axios if not already installed

const socialMediaOptions = [
  "Twitter",
  "LinkedIn",
  "Behance",
  "Facebook",
  "Instagram",
  "Github",
  "LeetCode",
  "CodeForces",
  "HackerEarth",
  "HackerRank",
];

function generateUUID() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const initialProfiles = [
  {
    id: generateUUID(),
    name: "Twitter",
    url: "https://twitter.com/arafatnayeem94",
  },
  {
    id: generateUUID(),
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/arafatnayeem/",
  },
  {
    id: generateUUID(),
    name: "Behance",
    url: "https://www.behance.net/arafatnayeem",
  },
];

const SocialProfile = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [newProfile, setNewProfile] = useState({ name: "", url: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const navigate = useNavigate();
  
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  
  // Configure axios headers with authentication
  const authAxios = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    // Check authentication and fetch profiles
    if (token) {
      fetchProfiles();
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  }, [navigate]);

  const fetchProfiles = async () => {
    try {
      const response = await authAxios.get('/social-profiles');
      if (response.data && response.data.length > 0) {
        setProfiles(response.data);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized (expired token)
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const saveProfiles = async (updatedProfiles) => {
    try {
      await authAxios.post('/social-profiles', { links: updatedProfiles });
      return true;
    } catch (error) {
      console.error("Error saving profiles:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const handleAddProfile = async () => {
    if (!newProfile.name || !isValidUrl(newProfile.url)) {
      alert("Please enter a valid profile name and URL starting with http");
      return;
    }
    
    const updatedProfiles = [
      ...profiles,
      { ...newProfile, id: generateUUID() },
    ];
    
    const success = await saveProfiles(updatedProfiles);
    if (success) {
      setProfiles(updatedProfiles);
      setNewProfile({ name: "", url: "" });
      setShowNewProfileForm(false);
    }
  };

  const handleProfileChange = (id, url) => {
    setProfiles(
      profiles.map((profile) =>
        profile.id === id ? { ...profile, url } : profile
      )
    );
  };

  const handleDeleteProfile = async (id) => {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);
    const success = await saveProfiles(updatedProfiles);
    if (success) {
      setProfiles(updatedProfiles);
    }
  };

  const handleEditProfile = (id) => {
    setEditingId(id);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    const success = await saveProfiles(profiles);
    if (success) {
      setEditingId(null);
      setIsEditing(false);
    }
  };

  const handleUpdate = () => {
    setIsEditing(!isEditing);
  };

  const isValidUrl = (url) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  return (
    <div className="social-profile-container">
      <div className="social-profile-header">
        <div className="heading">
          <h2>Social Profile</h2>
          <p>You can update your social profile here</p>
        </div>
        <button onClick={handleUpdate}>
          {isEditing ? "Cancel" : "Update"}
        </button>
      </div>

      <div className="profile-list">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-item">
            <div className="icon-details">
              <i className={`bx bxl-${profile.name.toLowerCase()}`}></i>
              <h4>{profile.name.slice(0, 12)}</h4>
              <span>&gt;</span>
            </div>
            <input
              type="text"
              value={profile.url}
              placeholder={profile.url}
              readOnly={!isEditing || editingId !== profile.id}
              onChange={(e) => handleProfileChange(profile.id, e.target.value)}
            />
            <div className="btns">
              {isEditing && editingId === profile.id ? (
                <button className="Save" onClick={handleSaveProfile}>
                  <i className="bx bxs-save btn-icon"></i>
                </button>
              ) : (
                <button
                  className="Edit"
                  onClick={() => handleEditProfile(profile.id)}
                >
                  <i className="bx bxs-edit-alt btn-icon"></i>
                </button>
              )}
              {isEditing && (
                <button onClick={() => handleDeleteProfile(profile.id)}>
                  <i className="bx bxs-trash btn-icon"></i>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showNewProfileForm ? (
        <div className="add-profile">
          <select
            name="name"
            value={newProfile.name}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Profile Name</option>
            {socialMediaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="url"
            placeholder="Profile URL"
            value={newProfile.url}
            onChange={handleInputChange}
            required
          />
          <button className="add-btn" onClick={handleAddProfile}>
            Add New Profile
          </button>
        </div>
      ) : (
        <button className="add-btn" onClick={() => setShowNewProfileForm(true)}>
          Add New Profile
        </button>
      )}
    </div>
  );
};

export default SocialProfile;