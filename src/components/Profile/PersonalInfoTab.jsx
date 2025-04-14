import React from 'react';
import './PersonalInfoTab.css'
const PersonalInfoTab = ({ user, isEditing, formData, handleInputChange, handleProfileUpdate }) => {
  return (
    <div className="personal-info-tab">
      {isEditing ? (
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          </div>
          
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      ) : (
        <div className="user-details">
          <div className="detail-item">
            <span className="detail-label">Full Name:</span>
            <span className="detail-value">{`${user.firstName} ${user.surname}`}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Bio:</span>
            <span className="detail-value">{user.bio || 'No bio added yet.'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{user.gender}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">
              {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{user.age}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">User Type:</span>
            <span className="detail-value">{user.user_type === 'student' ? 'Student' : 'Counsellor'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoTab;