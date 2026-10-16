import React from 'react';
import './ArcheryIllustration.css';

/**
 * Animated Archery Illustration
 * Features an archer aiming at a target with smooth animations
 */
function ArcheryIllustration() {
  return (
    <div className="archery-illustration">
      {/* Archer figure */}
      <div className="archer">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Archer body */}
          <g className="archer-body">
            {/* Head */}
            <circle cx="100" cy="50" r="15" fill="#2d3238"/>
            
            {/* Torso */}
            <rect x="88" y="65" width="24" height="40" rx="4" fill="#2d3238"/>
            
            {/* Left arm (drawing bow) */}
            <g className="arm-left">
              <path d="M88 75 L70 65 L65 75" stroke="#2d3238" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </g>
            
            {/* Right arm (holding bow) */}
            <g className="arm-right">
              <path d="M112 75 L130 70 L135 75" stroke="#2d3238" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </g>
            
            {/* Legs */}
            <path d="M92 105 L88 140" stroke="#2d3238" strokeWidth="7" strokeLinecap="round"/>
            <path d="M108 105 L112 140" stroke="#2d3238" strokeWidth="7" strokeLinecap="round"/>
          </g>
          
          {/* Bow */}
          <g className="bow">
            <path d="M135 60 Q145 75 135 90" stroke="#8b4513" strokeWidth="3" fill="none"/>
            <line x1="135" y1="60" x2="70" y2="75" stroke="#6c757d" strokeWidth="1.5" className="bow-string"/>
            <line x1="135" y1="90" x2="70" y2="75" stroke="#6c757d" strokeWidth="1.5" className="bow-string"/>
          </g>
          
          {/* Arrow */}
          <g className="arrow">
            <line x1="70" y1="75" x2="50" y2="75" stroke="#8b4513" strokeWidth="2"/>
            <polygon points="50,75 45,73 45,77" fill="#8b4513"/>
          </g>
        </svg>
      </div>
      
      {/* Target */}
      <div className="target">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Target rings */}
          <circle cx="100" cy="100" r="80" fill="#2d3238" opacity="0.3"/>
          <circle cx="100" cy="100" r="64" fill="#0066cc" opacity="0.4"/>
          <circle cx="100" cy="100" r="48" fill="#dc3545" opacity="0.5"/>
          <circle cx="100" cy="100" r="32" fill="#ffd700" opacity="0.6"/>
          <circle cx="100" cy="100" r="16" fill="#fff" opacity="0.7"/>
          <circle cx="100" cy="100" r="6" fill="#2d3238"/>
          
          {/* Ring separators */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="#2d3238" strokeWidth="1" opacity="0.2"/>
          <circle cx="100" cy="100" r="64" fill="none" stroke="#2d3238" strokeWidth="1" opacity="0.2"/>
          <circle cx="100" cy="100" r="48" fill="none" stroke="#2d3238" strokeWidth="1" opacity="0.2"/>
          <circle cx="100" cy="100" r="32" fill="none" stroke="#2d3238" strokeWidth="1" opacity="0.2"/>
        </svg>
      </div>
    </div>
  );
}

export default ArcheryIllustration;
