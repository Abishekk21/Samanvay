import React, { useState } from 'react';

const RINGS = [
  { id: 'F', label: 'F', color: '#6c757d', size: 500, zIndex: 1 },
  { id: 'E', label: 'E', color: '#ffffff', size: 500, zIndex: 2 },
  { id: 'D', label: 'D', color: '#212529', size: 400, zIndex: 3 }, // Black color
  { id: 'C', label: 'C', color: '#0066cc', size: 300, zIndex: 4 },
  { id: 'B', label: 'B', color: '#dc3545', size: 200, zIndex: 5 },
  { id: 'A', label: 'A', color: '#ffd700', size: 100, zIndex: 6 },
];

const BASE_POINTS = { A: 10, B: 9, C: 8, D: 7, E: 6, F: 0 };

function ArcheryTarget({ roundNumber, onSelect, confirming, selectedCircle }) {
  const [arrows, setArrows] = useState([]);

  const getPoints = (circle) => {
    if (circle === 'F') return 0;
    return BASE_POINTS[circle];
  };

  const handleRingClick = (ringId, event) => {
    if (confirming) return;

    // Get click position relative to target board
    const rect = event.currentTarget.getBoundingClientRect();
    const boardRect = event.currentTarget.closest('.archery-target-board').getBoundingClientRect();
    const x = event.clientX - boardRect.left;
    const y = event.clientY - boardRect.top;

    // Add arrow marker at click position
    const newArrow = { x, y, ring: ringId };
    setArrows([...arrows, newArrow]);

    onSelect(ringId);
  };

  const clearArrows = () => {
    setArrows([]);
  };

  // Expose clearArrows to parent (if needed)
  React.useEffect(() => {
    if (!confirming && selectedCircle) {
      // Keep arrows visible during confirmation
    }
  }, [confirming, selectedCircle]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div className="archery-target-board">
        {/* Render rings from outside to inside (F to A) */}
        {RINGS.map((ring) => (
          <div
            key={ring.id}
            className={`target-ring ring-${ring.id}`}
            onClick={(e) => handleRingClick(ring.id, e)}
            style={{
              width: `${ring.size}px`,
              height: `${ring.size}px`,
              zIndex: ring.zIndex,
            }}
          >
            {/* Yellow center - show just "10" */}
            {ring.id === 'A' && (
              <div className="ring-info">
                <span className="ring-points">10</span>
              </div>
            )}
            
            {/* Other rings - show 4-sided point values */}
            {(ring.id === 'B' || ring.id === 'C' || ring.id === 'D' || ring.id === 'E') && (
              <>
                <span className="ring-edge-label ring-edge-top">{getPoints(ring.id)}</span>
                <span className="ring-edge-label ring-edge-right">{getPoints(ring.id)}</span>
                <span className="ring-edge-label ring-edge-bottom">{getPoints(ring.id)}</span>
                <span className="ring-edge-label ring-edge-left">{getPoints(ring.id)}</span>
              </>
            )}
          </div>
        ))}

        {/* Arrow markers */}
        {arrows.map((arrow, index) => (
          <div
            key={index}
            className="arrow-marker"
            style={{
              left: `${arrow.x}px`,
              top: `${arrow.y}px`,
            }}
          >
            {/* Arrow SVG - Back view (feathers visible) */}
            <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
              <path d="M8 15 L15 8 L15 22 Z" fill="#DC143C" opacity="0.8"/>
              <path d="M22 15 L15 8 L15 22 Z" fill="#FFD700" opacity="0.8"/>
              <circle cx="15" cy="15" r="5" fill="#654321"/>
              <circle cx="15" cy="15" r="2" fill="#2F4F4F"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Target Stand - Outside the board container */}
      <div className="target-stand">
        <div className="stand-leg stand-leg-left"></div>
        <div className="stand-leg stand-leg-center"></div>
        <div className="stand-leg stand-leg-right"></div>
      </div>
    </div>
  );
}

export default ArcheryTarget;
