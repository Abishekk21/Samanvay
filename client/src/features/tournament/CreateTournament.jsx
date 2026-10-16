import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTournament } from '../../storage/localStorage';
import { generateTournamentId } from '../../utils/idGenerator';
import './CreateTournament.css';

function CreateTournament() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [touched, setTouched] = useState({ name: false, venue: false });

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

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-tournament-container">
      <div className="create-tournament-layout">
        {/* Left Column - Context */}
        <div className="create-tournament-intro">
          <div className="intro-header">
            <div className="intro-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="#E6F2FF"/>
                <circle cx="32" cy="32" r="20" fill="#0969DA" opacity="0.2"/>
                <circle cx="32" cy="32" r="12" fill="#0969DA" opacity="0.4"/>
                <circle cx="32" cy="32" r="6" fill="#0969DA"/>
              </svg>
            </div>
            <h1 className="intro-title">Create a Tournament</h1>
          </div>
          
          <p className="intro-description">
            Set up a new tournament to organize your archery competition. Configure teams, define shooting order, and track scores automatically.
          </p>
          
          <div className="intro-features">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="feature-text">
                <div className="feature-title">Register Teams</div>
                <div className="feature-desc">Add participating teams with two archers each</div>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-list-ol"></i>
              </div>
              <div className="feature-text">
                <div className="feature-title">Configure Order</div>
                <div className="feature-desc">Set the shooting sequence for all archers</div>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="bi bi-trophy"></i>
              </div>
              <div className="feature-text">
                <div className="feature-title">Track Progress</div>
                <div className="feature-desc">Monitor scores and determine winners automatically</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="create-tournament-form-container">
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Tournament Details</h2>
              <p className="form-card-description">
                Enter the basic information to get started
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Tournament Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${touched.name && !name.trim() ? 'is-invalid' : ''}`}
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  placeholder="e.g., National Championship 2026"
                  maxLength={100}
                  required
                  autoFocus
                />
                <div className="form-text d-flex justify-content-between">
                  <span>
                    {touched.name && !name.trim() ? 'Tournament name is required' : 'Required'}
                  </span>
                  <span className={name.length >= 90 ? 'text-warning-light' : ''}>
                    {name.length}/100
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="venue" className="form-label">
                  Venue / Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="venue"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., Olympic Stadium"
                  maxLength={100}
                />
                <div className="form-text">
                  <span>Optional</span>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !name.trim()}
                >
                  {creating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Create
                    </>
                  )}
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
