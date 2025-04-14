import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Profile.css';

// Component imports
import PersonalInfoTab from '../Profile/PersonalInfoTab';
import SkillsTab from '../Profile/SkillsTab';
import SocialLinksTab from '../Profile/SocialLinksTab';
import DocumentsTab from '../Profile/DocumentsTab';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resume, setResume] = useState(null);
  
  // Skills state
  const [skills, setSkills] = useState([]);
  
  // Social profiles state
  const [socialProfiles, setSocialProfiles] = useState([]);

  // Form state for user update
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    bio: '',
    gender: '',
    dob: '',
    age: ''
  });

  // Configure axios with authentication header
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: '/api',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  useEffect(() => {
    fetchUserData();
    fetchSocialProfiles();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      
      // Get user profile data
      const response = await authAxios.get('/auth/me');
      setUser(response.data);
      
      // Update form data
      setFormData({
        firstName: response.data.firstName || '',
        surname: response.data.surname || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        gender: response.data.gender || '',
        dob: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : '',
        age: response.data.age || ''
      });
      
      // Set skills
      setSkills(response.data.skills || []);
      
      // Set profile picture if available
      if (response.data.profilePicture) {
        setPreviewUrl(response.data.profilePicture);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 401) {
        // Redirect to login if unauthorized
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const fetchSocialProfiles = async () => {
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/social-profiles');
      if (response.data && Array.isArray(response.data)) {
        setSocialProfiles(response.data);
      }
    } catch (error) {
      console.error('Error fetching social profiles:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data if canceling edit
    if (isEditing) {
      setFormData({
        firstName: user.firstName || '',
        surname: user.surname || '',
        email: user.email || '',
        bio: user.bio || '',
        gender: user.gender || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        age: user.age || ''
      });
      setPreviewUrl(user.profilePicture || '');
      setProfilePicture(null);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const authAxios = getAuthAxios();
      const response = await authAxios.put('/profile/update', formData);
      
      // Upload profile picture if selected
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        await authAxios.post('/profile/upload-profile-picture', formData);
      }
      
      // Upload resume if selected
      if (resume) {
        const formData = new FormData();
        formData.append('resume', resume);
        await authAxios.post('/profile/upload-resume', formData);
      }
      
      // Refresh user data
      fetchUserData();
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Error loading profile</h2>
        <p>Please login again to access your profile.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <motion.div 
        className="profile-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user.firstName && user.firstName[0]}
                {user.surname && user.surname[0]}
              </div>
            )}
            {isEditing && (
              <div className="avatar-upload-overlay">
                <label htmlFor="profile-picture-upload">
                  <i className="bx bx-camera"></i>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="profile-info">
          <h1>{`${user.firstName} ${user.surname}`}</h1>
          <p className="user-type">{user.user_type === 'student' ? 'Student' : 'Counsellor'}</p>
          <p className="user-email">{user.email}</p>
          
          <div className="profile-actions">
            <button onClick={handleEditToggle} className="edit-btn">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="profile-tabs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button 
          className={activeTab === 'personal' ? 'active' : ''} 
          onClick={() => handleTabChange('personal')}
        >
          <i className="bx bx-user"></i> Personal Info
        </button>
        <button 
          className={activeTab === 'skills' ? 'active' : ''} 
          onClick={() => handleTabChange('skills')}
        >
          <i className="bx bx-code-alt"></i> Skills
        </button>
        <button 
          className={activeTab === 'social' ? 'active' : ''} 
          onClick={() => handleTabChange('social')}
        >
          <i className="bx bx-link"></i> Social Links
        </button>
        <button 
          className={activeTab === 'documents' ? 'active' : ''} 
          onClick={() => handleTabChange('documents')}
        >
          <i className="bx bx-file"></i> Documents
        </button>
      </motion.div>

      <motion.div 
        className="profile-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Render the active tab */}
        {activeTab === 'personal' && (
          <PersonalInfoTab 
            user={user}
            isEditing={isEditing}
            formData={formData}
            handleInputChange={handleInputChange}
            handleProfileUpdate={handleProfileUpdate}
          />
        )}
        
        {activeTab === 'skills' && (
          <SkillsTab 
            skills={skills}
            setSkills={setSkills}
            isEditing={isEditing}
            getAuthAxios={getAuthAxios}
          />
        )}
        
        {activeTab === 'social' && (
          <SocialLinksTab 
            socialProfiles={socialProfiles}
            setSocialProfiles={setSocialProfiles}
            isEditing={isEditing}
            getAuthAxios={getAuthAxios}
            generateUUID={generateUUID}
          />
        )}
        
        {activeTab === 'documents' && (
          <DocumentsTab 
            user={user}
            isEditing={isEditing}
            resume={resume}
            handleResumeChange={handleResumeChange}
          />
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;