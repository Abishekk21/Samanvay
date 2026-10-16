import React from 'react';

const CIRCLES = ['A', 'B', 'C', 'D', 'E', 'F'];
const BASE_POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

function TargetSelector({ roundNumber, onSelect }) {
  const getPoints = (circle) => {
    if (circle === 'F') return 0;
    return BASE_POINTS[circle] + roundNumber - 1;
  };

  return (
    <div className="target-grid">
      {CIRCLES.map(circle => (
        <button
          key={circle}
          className={`target-circle circle-${circle}`}
          onClick={() => onSelect(circle)}
          type="button"
        >
          <span className="target-circle-label">{circle}</span>
          <span className="target-circle-points">{getPoints(circle)} pts</span>
        </button>
      ))}
    </div>
  );
}

export default TargetSelector;
