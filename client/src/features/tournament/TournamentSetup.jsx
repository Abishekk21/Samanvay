import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import { validateTournament } from '../../services/api';
import { setActiveTournament } from '../../storage/localStorage';
import { generateTeamId, generateArcherId } from '../../utils/idGenerator';

function TournamentSetup() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournament, loading, error, updateTournament } = useTournament(tournamentId);
  
  const [teamName, setTeamName] = useState('');
  const [archer1Name, setArcher1Name] = useState('');
  const [archer2Name, setArcher2Name] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [validating, setValidating] = useState(false);
  const [starting, setStarting] = useState(false);

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
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAddTeam = (e) => {
    e.preventDefault();
    
    if (!teamName.trim() || !archer1Name.trim() || !archer2Name.trim()) {
      alert('All fields are required');
      return;
    }

    const newTeam = {
      id: generateTeamId(),
      name: teamName.trim(),
      archers: [
        { id: generateArcherId(), name: archer1Name.trim() },
        { id: generateArcherId(), name: archer2Name.trim() }
      ]
    };

    const updatedTeams = [...tournament.teams, newTeam];
    updateTournament({ teams: updatedTeams });

    setTeamName('');
    setArcher1Name('');
    setArcher2Name('');
  };

  const handleRemoveTeam = (teamId) => {
    if (!confirm('Remove this team?')) {
      return;
    }

    const updatedTeams = tournament.teams.filter(t => t.id !== teamId);
    updateTournament({ teams: updatedTeams });
  };

  const moveArcherInOrder = (archerId, direction) => {
    const currentIndex = tournament.shootingOrder.indexOf(archerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= tournament.shootingOrder.length) return;

    const newOrder = [...tournament.shootingOrder];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    
    updateTournament({ shootingOrder: newOrder });
  };

  const generateDefaultShootingOrder = () => {
    const allArchers = [];
    tournament.teams.forEach(team => {
      team.archers.forEach(archer => {
        allArchers.push(archer.id);
      });
    });
    updateTournament({ shootingOrder: allArchers });
  };

  const handleStartTournament = async () => {
    setValidationErrors([]);
    setValidating(true);

    try {
      // Validate with backend
      const response = await validateTournament(tournament);
      
      if (!response.data.valid) {
        setValidationErrors(response.data.errors);
        setValidating(false);
        return;
      }

      setStarting(true);

      // Update tournament status
      await updateTournament({ 
        status: 'active',
        currentRound: 1
      });

      // Set as active tournament
      setActiveTournament(tournament.id);

      // Navigate to shooting desk
      navigate(`/shooting/${tournament.id}`);
    } catch (err) {
      alert(`Validation failed: ${err.message}`);
      setValidating(false);
      setStarting(false);
    }
  };

  // Get archer name by ID
  const getArcherName = (archerId) => {
    for (const team of tournament.teams) {
      const archer = team.archers.find(a => a.id === archerId);
      if (archer) return `${archer.name} (${team.name})`;
    }
    return archerId;
  };

  const canStart = tournament.teams.length >= 2 && 
                  tournament.shootingOrder.length > 0;

  return (
    <div>
      <div className="mb-4">
        <h2>
          <i className="bi bi-gear me-2"></i>
          Tournament Setup
        </h2>
        <h4 className="text-muted">{tournament.name}</h4>
        {tournament.venue && <p className="text-muted">{tournament.venue}</p>}
      </div>

      {validationErrors.length > 0 && (
        <div className="alert alert-danger">
          <h5>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Validation Errors
          </h5>
          <ul className="mb-0">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Team Form */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-people-fill me-2"></i>
            Add Team
          </h5>
          <form onSubmit={handleAddTeam}>
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="teamName" className="form-label">Team Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Gyrhuna"
                  maxLength={100}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="archer1" className="form-label">Archer 1 *</label>
                <input
                  type="text"
                  className="form-control"
                  id="archer1"
                  value={archer1Name}
                  onChange={(e) => setArcher1Name(e.target.value)}
                  placeholder="e.g., János Diák"
                  maxLength={100}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="archer2" className="form-label">Archer 2 *</label>
                <input
                  type="text"
                  className="form-control"
                  id="archer2"
                  value={archer2Name}
                  onChange={(e) => setArcher2Name(e.target.value)}
                  placeholder="e.g., Süsü"
                  maxLength={100}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-plus-circle me-1"></i>
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Teams List */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-list-ul me-2"></i>
            Registered Teams ({tournament.teams.length})
          </h5>
          {tournament.teams.length === 0 ? (
            <p className="text-muted mb-0">No teams added yet. Add at least 2 teams to start.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Archer 1</th>
                    <th>Archer 2</th>
                    <th width="100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tournament.teams.map(team => (
                    <tr key={team.id}>
                      <td className="fw-bold">{team.name}</td>
                      <td>{team.archers[0].name}</td>
                      <td>{team.archers[1].name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveTeam(team.id)}
                          title="Remove team"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Shooting Order */}
      {tournament.teams.length > 0 && (
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">
                <i className="bi bi-arrow-down-up me-2"></i>
                Shooting Order
              </h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={generateDefaultShootingOrder}
              >
                <i className="bi bi-shuffle me-1"></i>
                Generate Default Order
              </button>
            </div>
            
            {tournament.shootingOrder.length === 0 ? (
              <p className="text-muted">Click "Generate Default Order" to create a shooting order.</p>
            ) : (
              <div className="list-group">
                {tournament.shootingOrder.map((archerId, index) => (
                  <div key={archerId} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <strong>#{index + 1}</strong> - {getArcherName(archerId)}
                    </span>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => moveArcherInOrder(archerId, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <i className="bi bi-arrow-up"></i>
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => moveArcherInOrder(archerId, 'down')}
                        disabled={index === tournament.shootingOrder.length - 1}
                        title="Move down"
                      >
                        <i className="bi bi-arrow-down"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="d-flex gap-3 justify-content-end">
        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigate('/')}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancel
        </button>
        <button
          className="btn btn-success btn-lg"
          onClick={handleStartTournament}
          disabled={!canStart || validating || starting}
        >
          {validating || starting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {validating ? 'Validating...' : 'Starting...'}
            </>
          ) : (
            <>
              <i className="bi bi-play-fill me-2"></i>
              Start Tournament
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TournamentSetup;
