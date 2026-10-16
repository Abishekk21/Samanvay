import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';

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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <i className="bi bi-bar-chart me-2"></i>
            Live Scoreboard
          </h2>
          <h4 className="text-muted">{tournament.name}</h4>
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
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Status</h5>
              <p className="fs-4 fw-bold mb-0">
                {tournament.status === 'completed' ? (
                  <span className="text-success">Completed</span>
                ) : (
                  <span className="text-primary">Round {currentRound}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Teams</h5>
              <p className="fs-4 fw-bold mb-0">{tournament.teams.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Leading Team</h5>
              <p className="fs-6 fw-bold mb-0">{leader.teamName}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Points to Win</h5>
              <p className="fs-4 fw-bold mb-0">{leader.pointsToWin}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Standings Table */}
      <div className="standings-table">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th width="60">Rank</th>
              <th>Team</th>
              <th>Archer 1</th>
              <th className="text-end">Score</th>
              <th>Archer 2</th>
              <th className="text-end">Score</th>
              <th className="text-end">Bonus</th>
              <th className="text-end">Total</th>
              <th className="text-end">To Win</th>
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
                <td className="text-end">{standing.archer1Score}</td>
                <td>{standing.archer2Name}</td>
                <td className="text-end">{standing.archer2Score}</td>
                <td className="text-end">
                  {standing.bonusTotal > 0 && (
                    <span className="badge bg-success">+{standing.bonusTotal}</span>
                  )}
                </td>
                <td className="text-end fw-bold fs-5">{standing.teamTotal}</td>
                <td className="text-end text-muted">{standing.pointsToWin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Links */}
      <div className="mt-4 d-flex gap-3">
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
  );
}

export default Scoreboard;
