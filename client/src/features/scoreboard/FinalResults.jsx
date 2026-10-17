import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import './FinalResults.css';

function FinalResults() {
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

  if (tournament.status !== 'completed') {
    return (
      <div className="alert alert-info">
        <h4>Tournament Not Completed</h4>
        <p>This tournament is still in progress.</p>
        <Link to={`/scoreboard/${tournament.id}`} className="btn btn-primary">
          View Scoreboard
        </Link>
      </div>
    );
  }

  // Calculate final standings
  const calculateStandings = () => {
    const individualTotals = new Map();
    const teamBonuses = new Map();

    tournament.teams.forEach(team => {
      team.archers.forEach(archer => {
        individualTotals.set(archer.id, 0);
      });
      teamBonuses.set(team.id, 0);
    });

    if (tournament.rounds) {
      tournament.rounds.forEach(round => {
        if (round.status === 'completed') {
          round.shots.forEach(shot => {
            const current = individualTotals.get(shot.archerId) || 0;
            individualTotals.set(shot.archerId, current + shot.points);
          });

          round.bonuses.forEach(bonus => {
            const current = teamBonuses.get(bonus.teamId) || 0;
            teamBonuses.set(bonus.teamId, current + bonus.bonus);
          });
        }
      });
    }

    const standings = tournament.teams.map(team => {
      const archer1 = team.archers[0];
      const archer2 = team.archers[1];
      const archer1Score = individualTotals.get(archer1.id) || 0;
      const archer2Score = individualTotals.get(archer2.id) || 0;
      const bonusTotal = teamBonuses.get(team.id) || 0;
      const teamTotal = archer1Score + archer2Score + bonusTotal;

      return {
        teamId: team.id,
        teamName: team.name,
        archer1Name: archer1.name,
        archer1Score,
        archer2Name: archer2.name,
        archer2Score,
        bonusTotal,
        teamTotal
      };
    });

    standings.sort((a, b) => b.teamTotal - a.teamTotal);
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  };

  const standings = calculateStandings();
  const winner = standings[0];
  const tied = tournament.tied;

  const completedRounds = tournament.rounds?.filter(r => r.status === 'completed').length || 0;

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-card">
          <div className="results-header">
            <h1 className="results-title">
              <i className="bi bi-trophy-fill text-warning me-3"></i>
              Tournament Complete!
            </h1>
            <h2 className="results-tournament-name">{tournament.name}</h2>
            
            {tied && tied.length > 0 ? (
              <div className="results-winner-card" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)' }}>
                <h3 className="results-winner-title">
                  <i className="bi bi-dash-circle me-2"></i>
                  Tied Result
                </h3>
                <p className="results-winner-score">
                  {tied.map(t => t.teamName).join(' and ')} tied with {tied[0].finalScore} points
                </p>
              </div>
            ) : (
              <div className="results-winner-card">
                <h3 className="results-winner-title">
                  <i className="bi bi-trophy-fill me-2"></i>
                  Winner: {winner.teamName}
                </h3>
                <p className="results-winner-score">
                  Final Score: <strong>{winner.teamTotal} points</strong>
                </p>
              </div>
            )}
          </div>

          {/* Final Standings */}
          <div className="results-standings-table">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Archer 1</th>
                  <th>Score</th>
                  <th>Archer 2</th>
                  <th>Score</th>
                  <th>Bonus</th>
                  <th>Final Total</th>
                </tr>
              </thead>
              <tbody>
                {standings.map(standing => (
                  <tr 
                    key={standing.teamId}
                    className={standing.rank === 1 ? 'winner-row' : ''}
                  >
                    <td className="rank-cell">
                      {standing.rank === 1 && <i className="bi bi-trophy-fill text-warning me-1"></i>}
                      {standing.rank}
                    </td>
                    <td className="fw-bold">{standing.teamName}</td>
                    <td>{standing.archer1Name}</td>
                    <td>{standing.archer1Score}</td>
                    <td>{standing.archer2Name}</td>
                    <td>{standing.archer2Score}</td>
                    <td>
                      {standing.bonusTotal > 0 && (
                        <span className="badge bg-success">+{standing.bonusTotal}</span>
                      )}
                    </td>
                    <td className="fw-bold fs-5">{standing.teamTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="results-actions">
            <Link to={`/history/${tournament.id}`} className="btn btn-outline-primary btn-lg">
              <i className="bi bi-clock-history me-2"></i>
              View Round History
            </Link>
            <Link to="/" className="btn btn-primary btn-lg">
              <i className="bi bi-house-door me-2"></i>
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalResults;
