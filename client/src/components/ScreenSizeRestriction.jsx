import React, { useState, useEffect } from 'react';
import './ScreenSizeRestriction.css';

function ScreenSizeRestriction({ children }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isSmallScreen) {
    return (
      <div className="screen-restriction-overlay">
        <div className="screen-restriction-card">
          <div className="restriction-icon">
            <i className="bi bi-laptop"></i>
          </div>
          <h1 className="restriction-title">Desktop Required</h1>
          <p className="restriction-message">
            Archeville Tournament Control Console is optimized for desktop and laptop screens.
          </p>
          <p className="restriction-submessage">
            Please open this application on a device with a screen width of at least 1024px for the best experience.
          </p>
          <div className="restriction-details">
            <div className="detail-item">
              <i className="bi bi-display"></i>
              <span>Minimum: 1024px width</span>
            </div>
            <div className="detail-item">
              <i className="bi bi-check-circle"></i>
              <span>Recommended: Desktop or Laptop</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ScreenSizeRestriction;
