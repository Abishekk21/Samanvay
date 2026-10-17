import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import './Scoreboard.css';

function Scoreboard() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
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

  // Calculate standings
  const calculateStandings = () => {
    const individualTotals = new Map();
    const teamBonuses = new Map();

    // Initialize
    tournament.teams.forEach(team => {
      team.archers.forEach(archer => {
        individualTotals.set(archer.id, 0);
      });
      teamBonuses.set(team.id, 0);
    });

    // Sum completed rounds
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

    // Calculate team standings
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
        teamTotal,
        pointsToWin: Math.max(0, 60 - teamTotal)
      };
    });

    // Sort by total descending
    standings.sort((a, b) => b.teamTotal - a.teamTotal);

    // Add rank
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  };

  const standings = calculateStandings();
  const leader = standings[0];
  const currentRound = tournament.currentRound || 0;
  const completedRounds = tournament.rounds?.filter(r => r.status === 'completed').length || 0;

  return (
    <div className="scoreboard-container">
      <div className="scoreboard-content">
        <div className="scoreboard-card">
          <div className="scoreboard-header">
            <div>
              <h2 className="scoreboard-title">
                <i className="bi bi-bar-chart me-2"></i>
                Live Scoreboard
              </h2>
              <h4 className="scoreboard-subtitle">{tournament.name}</h4>
            </div>
            <div>
              {tournament.status === 'active' && (
                <Link 
                  to={`/shooting/${tournament.id}`}
                  className="btn btn-primary btn-lg"
                >
                  <i className="bi bi-bullseye me-2"></i>
                  Shooting Desk
                </Link>
              )}
              {tournament.status === 'completed' && (
                <Link 
                  to={`/results/${tournament.id}`}
                  className="btn btn-success btn-lg"
                >
                  <i className="bi bi-trophy me-2"></i>
                  Final Results
                </Link>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <h5 className="summary-card-title">Status</h5>
              <p className="summary-card-value">
                {tournament.status === 'completed' ? (
                  <span className="text-success">Completed</span>
                ) : (
                  <span className="text-primary">Round {currentRound}</span>
                )}
              </p>
            </div>
            <div className="summary-card">
              <h5 className="summary-card-title">Teams</h5>
              <p className="summary-card-value">{tournament.teams.length}</p>
            </div>
            <div className="summary-card">
              <h5 className="summary-card-title">Leading Team</h5>
              <p className="summary-card-value" style={{ fontSize: '1.25rem' }}>{leader.teamName}</p>
            </div>
            <div className="summary-card">
              <h5 className="summary-card-title">Points to Win</h5>
              <p className="summary-card-value">{leader.pointsToWin}</p>
            </div>
          </div>

          {/* Standings Table */}
          <div className="standings-table">
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
                  <th>Total</th>
                  <th>To Win</th>
                </tr>
              </thead>
              <tbody>
                {standings.map(standing => (
                  <tr 
                    key={standing.teamId}
                    className={
                      standing.rank === 1 && tournament.status === 'active' ? 'leader-row' :
                      standing.rank === 1 && tournament.status === 'completed' ? 'winner-row' : ''
                    }
                  >
                    <td className="rank-cell">{standing.rank}</td>
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
                    <td className="text-muted">{standing.pointsToWin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Links */}
          <div className="scoreboard-actions">
            {completedRounds > 0 && (
              <Link 
                to={`/history/${tournament.id}`}
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-clock-history me-2"></i>
                Round History
              </Link>
            )}
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-house-door me-2"></i>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
