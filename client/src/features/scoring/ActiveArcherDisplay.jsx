import React from 'react';

function ActiveArcherDisplay({ archer, position, total, roundNumber, tournament }) {
  // Get team score
  const team = tournament.teams.find(t => t.id === archer.teamId);
  
  // Calculate current team score (simplified - full calculation in backend)
  const getTeamCurrentScore = () => {
    let total = 0;
    
    if (tournament.rounds) {
      for (const round of tournament.rounds) {
        if (round.status === 'completed' && round.shots) {
          for (const shot of round.shots) {
            const shotArcher = team.archers.find(a => a.id === shot.archerId);
            if (shotArcher) {
              total += shot.points;
            }
          }
        }
        
        if (round.status === 'completed' && round.bonuses) {
          const teamBonus = round.bonuses.find(b => b.teamId === team.id);
          if (teamBonus) {
            total += teamBonus.bonus;
          }
        }
      }
    }
    
    return total;
  };

  const teamScore = getTeamCurrentScore();

  return (
    <div className="active-archer-display">
      <div className="row align-items-center">
        <div className="col-md-8">
          <div className="mb-2">
            <span className="badge bg-light text-dark fs-6">
              Shooter {position} of {total}
            </span>
          </div>
          <h2 className="mb-2">{archer.name}</h2>
          <p className="meta mb-0">
            <i className="bi bi-people-fill me-2"></i>
            {archer.teamName} • Current Score: {teamScore} pts
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="fs-1 fw-bold">Round {roundNumber}</div>
        </div>
      </div>
    </div>
  );
}

export default ActiveArcherDisplay;
