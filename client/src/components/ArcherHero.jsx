import React from 'react';

/**
 * Premium Archery Hero Illustration
 * Professional, modern archer with clean lines and premium aesthetic
 * Designed for sports-tech landing pages
 */
function ArcherHero() {
  return (
    <svg viewBox="0 0 700 600" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
      <defs>
        {/* Gradients for depth and premium feel */}
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFC928', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#F28C28', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFC928', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#F28C28', stopOpacity: 0.6 }} />
        </linearGradient>
        <radialGradient id="targetGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#FFC928', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#F28C28', stopOpacity: 0.4 }} />
        </radialGradient>
      </defs>

      {/* Background decorative shapes */}
      <circle cx="580" cy="100" r="100" fill="url(#sunGrad)" opacity="0.4" />
      <circle cx="580" cy="100" r="70" fill="#FFC928" opacity="0.3" />
      
      {/* Decorative orange circles */}
      <circle cx="100" cy="80" r="40" fill="#F28C28" opacity="0.2" />
      <circle cx="650" cy="500" r="60" fill="#FFC928" opacity="0.25" />
      <circle cx="80" cy="480" r="35" fill="#F28C28" opacity="0.2" />

      {/* Target - positioned in background */}
      <g transform="translate(520, 320)">
        <circle cx="0" cy="0" r="80" fill="#2C3440" />
        <circle cx="0" cy="0" r="68" fill="#4A5568" />
        <circle cx="0" cy="0" r="56" fill="#E96B18" />
        <circle cx="0" cy="0" r="44" fill="#F28C28" />
        <circle cx="0" cy="0" r="32" fill="#FFC928" />
        <circle cx="0" cy="0" r="20" fill="#FFFCF7" />
        <circle cx="0" cy="0" r="8" fill="#24282D" />
        
        {/* Arrow in bullseye */}
        <g transform="rotate(-25)">
          <line x1="-60" y1="-12" x2="8" y2="-3" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
          <polygon points="8,-3 15,-6 15,0" fill="#8B4513" />
          <path d="M-60,-17 L-60,-7 L-52,-12 Z" fill="#DC3545" />
        </g>
      </g>

      {/* Ground shadow */}
      <ellipse cx="300" cy="560" rx="200" ry="25" fill="#24282D" opacity="0.1" />

      {/* Archer figure - premium, clean silhouette */}
      <g transform="translate(200, 240)">
        {/* Legs with proper stance */}
        <g>
          {/* Back leg */}
          <path d="M120,180 Q115,220 110,260 L110,280 Q110,290 120,290 L135,290 Q145,290 145,280 L145,265 Q150,225 148,185 Z" 
                fill="#24282D" />
          {/* Front leg */}
          <path d="M160,185 Q165,230 170,270 L170,285 Q170,295 180,295 L195,295 Q205,295 205,285 L205,270 Q200,225 195,185 Z" 
                fill="#24282D" />
        </g>

        {/* Torso - athletic build */}
        <path d="M110,70 Q105,75 105,85 L105,120 Q105,140 110,160 L110,185 L200,185 L200,160 Q205,140 205,120 L205,85 Q205,75 200,70 Z" 
              fill="#24282D" />
        
        {/* Orange accent stripe on torso */}
        <rect x="110" y="95" width="90" height="18" rx="9" fill="url(#orangeGrad)" />
        <rect x="115" y="130" width="80" height="12" rx="6" fill="#F28C28" opacity="0.6" />

        {/* Arms - dynamic archery pose */}
        {/* Extended arm holding bow */}
        <g>
          <path d="M105,85 Q80,90 60,105 Q50,115 45,130 L40,145 Q38,150 42,155 L50,160 Q55,163 58,158 L75,130 Q85,115 95,100 Z" 
                fill="#24282D" />
          <circle cx="42" cy="152" r="12" fill="#24282D" />
        </g>

        {/* Drawing arm - bent, pulling string */}
        <g>
          <path d="M205,85 Q225,88 240,95 Q250,100 258,108 L275,125 Q280,130 285,128 L295,122 Q300,118 298,113 Q295,108 290,105 L270,92 Q250,80 225,75 Z" 
                fill="#24282D" />
          <path d="M290,108 Q305,115 315,130 L320,140 Q323,147 328,145 L335,142 Q340,140 338,133 L330,115 Q320,100 305,90 Z" 
                fill="#24282D" />
          <circle cx="332" cy="138" r="11" fill="#24282D" />
        </g>

        {/* Head - smooth, faceless, modern */}
        <ellipse cx="157" cy="50" rx="32" ry="38" fill="#24282D" />
        
        {/* Neck */}
        <path d="M135,70 Q140,75 157,75 Q174,75 179,70 L179,80 L135,80 Z" fill="#24282D" />

        {/* Quiver on back */}
        <g transform="translate(195, 95)">
          <rect x="0" y="0" width="18" height="55" rx="4" fill="#8B4513" opacity="0.8" />
          <rect x="2" y="2" width="14" height="51" rx="3" fill="#A0522D" opacity="0.6" />
          {/* Arrow shafts visible */}
          <line x1="5" y1="8" x2="5" y2="25" stroke="#FFC928" strokeWidth="2.5" />
          <line x1="9" y1="5" x2="9" y2="28" stroke="#F28C28" strokeWidth="2.5" />
          <line x1="13" y1="10" x2="13" y2="22" stroke="#FFC928" strokeWidth="2.5" />
        </g>

        {/* Bow - elegant recurve design */}
        <g transform="translate(42, 152)">
          <path d="M0,-55 Q-8,-30 -10,0 Q-8,30 0,55" 
                stroke="#8B4513" 
                strokeWidth="7" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round" />
          <path d="M0,-55 Q-15,-58 -18,-50 M0,55 Q-15,58 -18,50" 
                stroke="#A0522D" 
                strokeWidth="5" 
                fill="none" 
                strokeLinecap="round" />
        </g>

        {/* Bow string and arrow */}
        <line x1="42" y1="97" x2="332" y2="138" stroke="#718096" strokeWidth="2.5" opacity="0.9" />
        <line x1="42" y1="207" x2="332" y2="138" stroke="#718096" strokeWidth="2.5" opacity="0.9" />
        
        {/* Arrow nocked and ready */}
        <g>
          <line x1="332" y1="138" x2="480" y2="120" stroke="#8B4513" strokeWidth="5" strokeLinecap="round" />
          <polygon points="480,120 495,116 495,124" fill="#8B4513" />
          <polygon points="332,133 332,143 345,138" fill="#DC3545" />
          <line x1="340" y1="138" x2="370" y2="133" stroke="#FFC928" strokeWidth="2" />
        </g>
      </g>

      {/* Foreground decorative elements */}
      <circle cx="50" cy="200" r="25" fill="#F28C28" opacity="0.15" />
      <circle cx="620" cy="450" r="45" fill="url(#orangeGrad)" opacity="0.2" />
      
      {/* Small accent shapes */}
      <circle cx="150" cy="100" r="8" fill="#FFC928" opacity="0.4" />
      <circle cx="600" cy="200" r="12" fill="#F28C28" opacity="0.3" />
    </svg>
  );
}

export default ArcherHero;
