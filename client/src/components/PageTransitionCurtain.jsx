import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './PageTransitionCurtain.css';

/**
 * Premium diagonal curtain page transition
 * Inspired by Motion UI - covers viewport from top-right to bottom-left
 * 
 * Two-stage animation:
 * 1. Cover: Curtain slides from top-right corner to cover full screen
 * 2. Reveal: Route changes, then curtain slides to bottom-left to reveal new page
 */
const PageTransitionCurtain = ({ children }) => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('idle'); // idle, covering, revealing

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage('covering');
    }
  }, [location, displayLocation.pathname]);

  const handleCoverComplete = () => {
    // Update route content when screen is fully covered
    setDisplayLocation(location);
    // Small delay before revealing to ensure content is updated
    setTimeout(() => {
      setStage('revealing');
    }, 50);
  };

  const handleRevealComplete = () => {
    setStage('idle');
  };

  const duration = shouldReduceMotion ? 0.2 : 0.55;
  const easing = [0.76, 0, 0.24, 1];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Page Content - use displayLocation to control what's shown */}
      <div key={displayLocation.pathname} className="page-content-wrapper">
        {children}
      </div>

      {/* Diagonal Curtain Overlay */}
      {stage === 'covering' && (
        <motion.div
          className="page-transition-curtain"
          initial={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
          animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          transition={{ duration, ease: easing }}
          onAnimationComplete={handleCoverComplete}
        />
      )}

      {stage === 'revealing' && (
        <motion.div
          className="page-transition-curtain"
          initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          animate={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
          transition={{ duration, ease: easing }}
          onAnimationComplete={handleRevealComplete}
        />
      )}
    </div>
  );
};

export default PageTransitionCurtain;
