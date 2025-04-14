// src/services/ProfileService.js
import API from './API2'; // Assuming you have a base API service

class ProfileService {
  // Get current user profile
  static async getUserProfile() {
    try {
      const response = await API.get('/api/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(profileData) {
    try {
      const response = await API.put('/api/profile/update', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await API.post('/api/profile/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Upload resume
  static async uploadResume(file) {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await API.post('/api/profile/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  // Update user skills
  static async updateUserSkills(skills) {
    try {
      const response = await API.put('/api/profile/update-skills', { skills });
      return response.data;
    } catch (error) {
      console.error('Error updating skills:', error);
      throw error;
    }
  }

  // Get social profiles
  static async getSocialProfiles() {
    try {
      const response = await API.get('/api/social-profiles');
      return response.data;
    } catch (error) {
      console.error('Error fetching social profiles:', error);
      throw error;
    }
  }

  // Update social profiles
  static async updateSocialProfiles(links) {
    try {
      const response = await API.post('/api/social-profiles', { links });
      return response.data;
    } catch (error) {
      console.error('Error updating social profiles:', error);
      throw error;
    }
  }
}

export default ProfileService;