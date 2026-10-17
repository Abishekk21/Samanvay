import React from 'react';

function RoundSummary({ round, tournament }) {
  // Group shots by team
  const teamResults = tournament.teams.map(team => {
    const teamShots = round.shots.filter(shot =>
      team.archers.some(a => a.id === shot.archerId)
    );

    const archer1 = team.archers[0];
    const archer2 = team.archers[1];
    const shot1 = teamShots.find(s => s.archerId === archer1.id);
    const shot2 = teamShots.find(s => s.archerId === archer2.id);

    const bonus = round.bonuses.find(b => b.teamId === team.id);
    const roundPoints = (shot1?.points || 0) + (shot2?.points || 0);
    const totalWithBonus = roundPoints + (bonus?.bonus || 0);

    return {
      team,
      archer1,
      archer2,
      shot1,
      shot2,
      bonus: bonus?.bonus || 0,
      roundPoints,
      totalWithBonus
    };
  });

  return (
    <div className="row">
      {teamResults.map(result => (
        <div key={result.team.id} className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{result.team.name}</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">{result.archer1.name}</span>
                  <span className="badge bg-secondary fs-6">
                    {result.shot1?.circle} → {result.shot1?.points} pts
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">{result.archer2.name}</span>
                  <span className="badge bg-secondary fs-6">
                    {result.shot2?.circle} → {result.shot2?.points} pts
                  </span>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Round Total:</span>
                <div className="text-end">
                  <div className="fs-4 fw-bold text-primary">{result.totalWithBonus} pts</div>
                  <small className="text-success" style={{ fontSize: '0.75rem', display: 'block' }}>
                    <i className="bi bi-star-fill me-1"></i>
                    Synchrony Bonus: +{result.bonus} pts
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoundSummary;
