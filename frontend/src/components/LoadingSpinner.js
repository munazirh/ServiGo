import React from 'react';
import '../App.css'; // Reuse spinner anim

const LoadingSpinner = () => (
  <div className="loading-overlay">
    <div className="spinner-container">
      <div className="saas-spinner"></div>
      <p className="loading-text">ServiGo is preparing your experience...</p>
    </div>
  </div>
);

export default LoadingSpinner;

