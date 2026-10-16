import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTournament } from '../../storage/localStorage';
import { generateTournamentId } from '../../utils/idGenerator';

function CreateTournament() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Tournament name is required');
      return;
    }

    if (name.trim().length > 100) {
      setError('Tournament name cannot exceed 100 characters');
      return;
    }

    setCreating(true);

    try {
      const tournament = {
        id: generateTournamentId(),
        name: name.trim(),
        venue: venue.trim() || null,
        teams: [],
        shootingOrder: [],
        status: 'setup',
        rounds: [],
        currentRound: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveTournament(tournament);
      navigate(`/setup/${tournament.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create tournament');
      setCreating(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-5">
            <h2 className="card-title mb-4">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Tournament
            </h2>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-bold">
                  Tournament Name *
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., National Championship 2026"
                  maxLength={100}
                  required
                  autoFocus
                />
                <div className="form-text">
                  {name.length}/100 characters
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="venue" className="form-label fw-bold">
                  Venue/Location
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., Olympic Stadium"
                  maxLength={100}
                />
                <div className="form-text">
                  Optional
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg flex-grow-1"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Create Tournament
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate('/')}
                  disabled={creating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTournament;
