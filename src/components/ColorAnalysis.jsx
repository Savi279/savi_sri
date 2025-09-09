import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { customerColorAnalysisApi } from '../api/customer_api';
import '../styleSheets/ColorAnalysis.css';
import LoadingSpinner from './LoadingSpinner';

const colorOptions = {
  skinTone: [
    { value: 'fair', name: 'Fair - Very Light Skin', color: '#fce4d6' },
    { value: 'light', name: 'Light - Light Beige', color: '#f9d5b3' },
    { value: 'medium', name: 'Medium - Olive Beige', color: '#d2a679' },
    { value: 'tan', name: 'Tan - Golden Brown', color: '#b97a57' },
    { value: 'dark', name: 'Dark - Deep Brown', color: '#6b4226' },
  ],
  hairColor: [
    { value: 'blonde', name: 'Blonde - Golden Yellow', color: '#f3e5ab' },
    { value: 'brown', name: 'Brown - Chestnut', color: '#6f4e37' },
    { value: 'black', name: 'Black - Jet Black', color: '#1c1c1c' },
    { value: 'red', name: 'Red - Auburn', color: '#b22222' },
    { value: 'grey', name: 'Grey - Silver', color: '#a9a9a9' },
  ],
  eyeColor: [
    { value: 'blue', name: 'Blue - Sky Blue', color: '#3b5998' },
    { value: 'green', name: 'Green - Forest Green', color: '#228b22' },
    { value: 'brown', name: 'Brown - Chocolate', color: '#654321' },
    { value: 'hazel', name: 'Hazel - Golden Brown', color: '#8e7618' },
    { value: 'grey', name: 'Grey - Steel Grey', color: '#808080' },
  ],
};

const Dropdown = ({ label, options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="form-group custom-dropdown" ref={dropdownRef}>
      <label>{label}</label>
      <button type="button" className="dropdown-toggle" onClick={handleToggle} aria-haspopup="listbox" aria-expanded={isOpen}>
        {selectedOption ? (
          <>
            <span className="color-dot" style={{ backgroundColor: selectedOption.color }}></span>
            {selectedOption.name}
          </>
        ) : (
          'Select...'
        )}
        <span className="dropdown-arrow">&#9662;</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === selectedValue}
              className={`dropdown-item ${opt.value === selectedValue ? 'selected' : ''}`}
              onClick={() => handleOptionClick(opt.value)}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOptionClick(opt.value); }}
            >
              <span className="color-dot" style={{ backgroundColor: opt.color }}></span>
              {opt.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ColorAnalysis = () => {
  const user = useSelector(state => state.user.currentUser);

  const [skinTone, setSkinTone] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [suggestedColors, setSuggestedColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const profile = await customerColorAnalysisApi.getUserColorProfile();
          if (profile) {
            setSkinTone(profile.skinTone);
            setHairColor(profile.hairColor);
            setEyeColor(profile.eyeColor);
            setSuggestedColors(profile.suggestedColors);
            setProfileExists(true);
          }
        } catch (err) {
          if (err.message === 'Color profile not found for this user') {
            setProfileExists(false);
          } else {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const analysisData = { skinTone, hairColor, eyeColor };
      const result = await customerColorAnalysisApi.analyzeColors(analysisData);
      setSuggestedColors(result.suggestedColors);
      setProfileExists(true);
      alert('Color analysis complete!');
    } catch (err) {
      setError(err.message || 'Failed to perform color analysis.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="color-analysis-container">
      <h1>Your Personal Color Analysis</h1>
      {!user ? (
        <p className="login-prompt">Please log in to get your personalized color analysis.</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="color-analysis-form">
            <Dropdown
              label="What is your skin tone?"
              options={colorOptions.skinTone}
              selectedValue={skinTone}
              onChange={setSkinTone}
            />
            <Dropdown
              label="What is your natural hair color?"
              options={colorOptions.hairColor}
              selectedValue={hairColor}
              onChange={setHairColor}
            />
            <Dropdown
              label="What is your eye color?"
              options={colorOptions.eyeColor}
              selectedValue={eyeColor}
              onChange={setEyeColor}
            />
            <button type="submit" disabled={loading}>
              {profileExists ? 'Update Analysis' : 'Get My Colors'}
            </button>
          </form>

          {suggestedColors.length > 0 && (
            <div className="suggested-colors-section">
              <h2>Suggested Colors for You:</h2>
              <div className="color-palette">
                {suggestedColors.map((color, index) => (
                  <div key={index} className="color-swatch" style={{ backgroundColor: color.hex }}>
                    <p>{color.name}</p>
                    <span>{color.hex}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ColorAnalysis;
