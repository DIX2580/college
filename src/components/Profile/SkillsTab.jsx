import React, { useState } from 'react';
import './SkillsTab.css';
// Tech skills data
const techStackOptions = [
  "JavaScript", "Python", "Java", "C#", "PHP", "HTML", "CSS", 
  "TypeScript", "Ruby", "Swift", "Go", "Kotlin", "React.js", 
  "Angular", "Vue.js", "Node.js", "Django"
];

const SkillsTab = ({ skills, setSkills, isEditing, getAuthAxios }) => {
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleAddSkill = async () => {
    if (!selectedSkill || skills.includes(selectedSkill)) {
      return;
    }
    
    try {
      const updatedSkills = [...skills, selectedSkill];
      
      const authAxios = getAuthAxios();
      await authAxios.put('/profile/update-skills', { skills: updatedSkills });
      
      setSkills(updatedSkills);
      setSelectedSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill. Please try again.');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const updatedSkills = skills.filter(skill => skill !== skillToRemove);
      
      const authAxios = getAuthAxios();
      await authAxios.put('/profile/update-skills', { skills: updatedSkills });
      
      setSkills(updatedSkills);
    } catch (error) {
      console.error('Error removing skill:', error);
      alert('Failed to remove skill. Please try again.');
    }
  };

  return (
    <div className="skills-tab">
      <h3>My Skills</h3>
      
      <div className="skills-container">
        {skills.length > 0 ? (
          <div className="skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                {isEditing && (
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="remove-skill-btn"
                  >
                    <i className="bx bx-x"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-skills">No skills added yet.</p>
        )}
      </div>
      
      {isEditing && (
        <div className="add-skill-form">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Select a skill</option>
            {techStackOptions.map((skill, index) => (
              <option key={index} value={skill}>{skill}</option>
            ))}
          </select>
          <button onClick={handleAddSkill} disabled={!selectedSkill}>
            Add Skill
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsTab;