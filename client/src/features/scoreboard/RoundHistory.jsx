import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';

function RoundHistory() {
  const { tournamentId } = useParams();
  const { tournament, loading, error } = useTournament(tournamentId);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="alert alert-danger">
        <h4>Error</h4>
        <p>{error || 'Tournament not found'}</p>
      </div>
    );
  }

  const completedRounds = tournament.rounds?.filter(r => r.status === 'completed') || [];

  if (completedRounds.length === 0) {
    return (
      <div>
        <h2 className="mb-4">Round History</h2>
        <div className="empty-state">
          <p>No completed rounds yet</p>
          <Link to={`/shooting/${tournament.id}`} className="btn btn-primary">
            Start Shooting
          </Link>
        </div>
      </div>
    );
  }

  // Get archer and team names
  const getArcherInfo = (archerId) => {
    for (const team of tournament.teams) {
      const archer = team.archers.find(a => a.id === archerId);
      if (archer) {
        return { name: archer.name, teamName: team.name };
      }
    }
    return { name: 'Unknown', teamName: 'Unknown' };
  };

  return (
    <div>
      <div className="mb-4">
        <h2>
          <i className="bi bi-clock-history me-2"></i>
          Round History
        </h2>
        <h4 className="text-muted">{tournament.name}</h4>
      </div>

      {completedRounds.map(round => {
        // Group by team
        const teamResults = tournament.teams.map(team => {
          const teamShots = round.shots.filter(shot =>
            team.archers.some(a => a.id === shot.archerId)
          );
          const bonus = round.bonuses.find(b => b.teamId === team.id);
          const roundPoints = teamShots.reduce((sum, shot) => sum + shot.points, 0);
          
          return {
            team,
            shots: teamShots.map(shot => {
              const archer = team.archers.find(a => a.id === shot.archerId);
              return { ...shot, archerName: archer.name };
            }),
            bonus: bonus?.bonus || 0,
            roundPoints,
            totalWithBonus: roundPoints + (bonus?.bonus || 0)
          };
        });

        return (
          <div key={round.roundNumber} className="card shadow mb-4">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">
                <i className="bi bi-circle-fill me-2"></i>
                Round {round.roundNumber}
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                {teamResults.map(result => (
                  <div key={result.team.id} className="col-md-6 mb-3">
                    <h5 className="fw-bold text-primary">{result.team.name}</h5>
                    <ul className="list-unstyled mb-2">
                      {result.shots.map(shot => (
                        <li key={shot.archerId} className="mb-1">
                          <span className="fw-semibold">{shot.archerName}:</span>{' '}
                          <span className="badge bg-secondary">{shot.circle}</span> → {shot.points} pts
                        </li>
                      ))}
                    </ul>
                    {result.bonus > 0 && (
                      <div className="alert alert-success py-2 mb-2">
                        <i className="bi bi-star-fill me-1"></i>
                        Synchrony bonus: +{result.bonus} pts
                      </div>
                    )}
                    <div className="fw-bold">
                      Round total: {result.totalWithBonus} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className="mt-4">
        <Link to={`/scoreboard/${tournament.id}`} className="btn btn-primary">
          <i className="bi bi-bar-chart me-2"></i>
          Back to Scoreboard
        </Link>
      </div>
    </div>
  );
}

export default RoundHistory;
