import React, { useState } from 'react';

// Social media options for selection
const socialMediaOptions = [
  "Twitter", "LinkedIn", "Behance", "Facebook", "Instagram", 
  "Github", "LeetCode", "CodeForces", "HackerEarth", "HackerRank",
];

const SocialLinksTab = ({ socialProfiles, setSocialProfiles, isEditing, getAuthAxios, generateUUID }) => {
  const [newProfile, setNewProfile] = useState({ name: "", url: "" });
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState(null);

  const handleSocialInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  const isValidUrl = (url) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleAddSocialProfile = async () => {
    if (!newProfile.name || !isValidUrl(newProfile.url)) {
      alert("Please enter a valid profile name and URL starting with http");
      return;
    }
    
    try {
      const updatedProfiles = [
        ...socialProfiles,
        { ...newProfile, id: generateUUID() },
      ];
      
      const authAxios = getAuthAxios();
      await authAxios.post('/social-profiles', { links: updatedProfiles });
      
      setSocialProfiles(updatedProfiles);
      setNewProfile({ name: "", url: "" });
      setShowNewProfileForm(false);
    } catch (error) {
      console.error('Error adding social profile:', error);
      alert('Failed to add social profile. Please try again.');
    }
  };

  const handleSocialProfileChange = (id, url) => {
    setSocialProfiles(
      socialProfiles.map((profile) =>
        profile.id === id ? { ...profile, url } : profile
      )
    );
  };

  const handleSaveSocialProfile = async () => {
    try {
      const authAxios = getAuthAxios();
      await authAxios.post('/social-profiles', { links: socialProfiles });
      setEditingSocialId(null);
    } catch (error) {
      console.error('Error saving social profile:', error);
      alert('Failed to save social profile. Please try again.');
    }
  };

  const handleDeleteSocialProfile = async (id) => {
    try {
      const updatedProfiles = socialProfiles.filter((profile) => profile.id !== id);
      
      const authAxios = getAuthAxios();
      await authAxios.post('/social-profiles', { links: updatedProfiles });
      
      setSocialProfiles(updatedProfiles);
    } catch (error) {
      console.error('Error deleting social profile:', error);
      alert('Failed to delete social profile. Please try again.');
    }
  };

  return (
    <div className="social-tab">
      <h3>Social Profiles</h3>
      
      <div className="social-profiles-container">
        {socialProfiles.length > 0 ? (
          <div className="social-profiles-list">
            {socialProfiles.map((profile) => (
              <div key={profile.id} className="social-profile-item">
                <div className="social-icon">
                  <i className={`bx bxl-${profile.name.toLowerCase()}`}></i>
                </div>
                
                <div className="social-details">
                  <h4>{profile.name}</h4>
                  {editingSocialId === profile.id ? (
                    <input
                      type="text"
                      value={profile.url}
                      onChange={(e) => handleSocialProfileChange(profile.id, e.target.value)}
                    />
                  ) : (
                    <a href={profile.url} target="_blank" rel="noopener noreferrer">
                      {profile.url}
                    </a>
                  )}
                </div>
                
                {isEditing && (
                  <div className="social-actions">
                    {editingSocialId === profile.id ? (
                      <button 
                        onClick={handleSaveSocialProfile}
                        className="save-social-btn"
                      >
                        <i className="bx bx-check"></i>
                      </button>
                    ) : (
                      <button 
                        onClick={() => setEditingSocialId(profile.id)}
                        className="edit-social-btn"
                      >
                        <i className="bx bx-edit-alt"></i>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteSocialProfile(profile.id)}
                      className="delete-social-btn"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-socials">No social profiles added yet.</p>
        )}
      </div>
      
      {isEditing && (
        <div className="social-profile-form">
          {showNewProfileForm ? (
            <div className="add-social-form">
              <select
                name="name"
                value={newProfile.name}
                onChange={handleSocialInputChange}
                required
              >
                <option value="">Select Platform</option>
                {socialMediaOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <input
                type="text"
                name="url"
                placeholder="Profile URL (https://...)"
                value={newProfile.url}
                onChange={handleSocialInputChange}
                required
              />
              
              <div className="social-form-actions">
                <button 
                  onClick={handleAddSocialProfile}
                  className="add-social-btn"
                >
                  Add
                </button>
                <button 
                  onClick={() => setShowNewProfileForm(false)}
                  className="cancel-social-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowNewProfileForm(true)}
              className="show-social-form-btn"
            >
              <i className="bx bx-plus"></i> Add Social Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialLinksTab;