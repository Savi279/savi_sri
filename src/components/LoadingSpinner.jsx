import React from 'react';
import '../styleSheets/LoadingSpinner.css'; // Optional: Create CSS for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
