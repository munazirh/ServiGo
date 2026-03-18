import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="notfound-container">
    <div className="notfound-content">
      <h1 className="notfound-title">404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link to="/" className="btn-home">← Back to Home</Link>
    </div>
  </div>
);

export default NotFound;

