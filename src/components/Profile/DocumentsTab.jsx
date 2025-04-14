import React from 'react';

const DocumentsTab = ({ user, isEditing, resume, handleResumeChange }) => {
  return (
    <div className="documents-tab">
      <h3>Resume</h3>
      
      <div className="resume-section">
        {user.resume ? (
          <div className="resume-info">
            <div className="resume-icon">
              <i className="bx bxs-file-pdf"></i>
            </div>
            <div className="resume-details">
              <span>Current Resume</span>
              <a href={`/api/profile/download-resume/${user._id}`} target="_blank" rel="noopener noreferrer">
                View/Download Resume
              </a>
            </div>
          </div>
        ) : (
          <p className="no-resume">No resume uploaded yet.</p>
        )}
        
        {isEditing && (
          <div className="upload-resume-section">
            <label htmlFor="resume-upload" className="resume-upload-label">
              <i className="bx bx-upload"></i>
              <span>{resume ? "Change Resume" : "Upload Resume"}</span>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                style={{ display: 'none' }}
              />
            </label>
            {resume && <span className="file-selected">{resume.name}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;