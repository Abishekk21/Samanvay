import { useEffect, useRef, useState } from 'react';
import './GyroscopeCursor.css';

const GyroscopeCursor = ({ 
  size = 24, 
  color = '#ffffff',
  opacity = 0.9,
  trailLength = 8,
  smoothing = 0.15
}) => {
  const cursorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const positionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    let lastTime = performance.now();

    const updatePosition = (currentTime) => {
      if (!cursorRef.current) return;

      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const pos = positionRef.current;
      const vel = velocityRef.current;

      // Smooth cursor movement
      const dx = pos.targetX - pos.x;
      const dy = pos.targetY - pos.y;
      
      pos.x += dx * smoothing;
      pos.y += dy * smoothing;

      // Calculate velocity
      vel.x = dx * smoothing / Math.max(deltaTime, 0.001);
      vel.y = dy * smoothing / Math.max(deltaTime, 0.001);

      // Calculate angle based on velocity
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
      if (speed > 10) {
        const targetAngle = Math.atan2(vel.y, vel.x) * (180 / Math.PI);
        // Smooth angle transition
        let angleDiff = targetAngle - angleRef.current;
        
        // Normalize angle difference to -180 to 180
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        
        angleRef.current += angleDiff * 0.2;
      }

      // Update cursor position and rotation
      cursorRef.current.style.transform = `
        translate(${pos.x}px, ${pos.y}px) 
        rotate(${angleRef.current + 45}deg)
      `;

      rafRef.current = requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e) => {
      positionRef.current.targetX = e.clientX;
      positionRef.current.targetY = e.clientY;
      
      if (!isVisible) {
        positionRef.current.x = e.clientX;
        positionRef.current.y = e.clientY;
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isVisible, smoothing]);

  return (
    <div 
      ref={cursorRef}
      className={`gyroscope-cursor ${isVisible ? 'visible' : ''}`}
      style={{
        '--cursor-size': `${size}px`,
        '--cursor-color': color,
        '--cursor-opacity': opacity,
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M13.5 2L22 12L13.5 14L12 22L2 12L10.5 10L13.5 2Z" 
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <circle 
          cx="12" 
          cy="12" 
          r="2" 
          fill="rgba(0, 0, 0, 0.3)"
        />
      </svg>
      
      {/* Trail effect */}
      <div className="cursor-trail" />
    </div>
  );
};

export default GyroscopeCursor;
