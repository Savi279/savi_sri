import React, { useState, useEffect } from 'react';
import {useSelector } from 'react-redux';
import { customerColorAnalysisApi } from '../api/customer_api';
import '../styleSheets/ColorAnalysis.css'; // You'll need to create this CSS file

const ColorAnalysis = () => {
  const user = useSelector(state => state.user.currentUser); // Assuming user is stored in Redux

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
          // Profile might not exist, which is fine
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
            <div className="form-group">
              <label htmlFor="skinTone">What is your skin tone?</label>
              <select id="skinTone" value={skinTone} onChange={(e) => setSkinTone(e.target.value)} required>
                <option value="">Select...</option>
                <option value="fair">Fair</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="tan">Tan</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hairColor">What is your natural hair color?</label>
              <select id="hairColor" value={hairColor} onChange={(e) => setHairColor(e.target.value)} required>
                <option value="">Select...</option>
                <option value="blonde">Blonde</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
                <option value="grey">Grey</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eyeColor">What is your eye color?</label>
              <select id="eyeColor" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} required>
                <option value="">Select...</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="brown">Brown</option>
                <option value="hazel">Hazel</option>
                <option value="grey">Grey</option>
              </select>
            </div>

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