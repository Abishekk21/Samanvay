import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTournaments, deleteTournament } from '../../storage/localStorage';
import ArcheryIllustration from '../../components/ArcheryIllustration';

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    try {
      const loaded = getAllTournaments();
      // Sort by most recent first
      loaded.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTournaments(loaded);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) {
      return;
    }

    try {
      deleteTournament(id);
      loadTournaments();
    } catch (error) {
      alert('Failed to delete tournament');
    }
  };

  const getStatusBadge = (tournament) => {
    if (tournament.status === 'completed') {
      return <span className="status-badge completed">Completed</span>;
    } else if (tournament.status === 'active' && tournament.currentRound > 0) {
      return <span className="status-badge active">Active - Round {tournament.currentRound}</span>;
    } else {
      return <span className="status-badge setup">Setup</span>;
    }
  };

  const getActionButton = (tournament) => {
    if (tournament.status === 'completed') {
      return (
        <Link 
          to={`/results/${tournament.id}`}
          className="btn btn-sm btn-outline-primary"
        >
          <i className="bi bi-trophy me-1"></i>
          View Results
        </Link>
      );
    } else if (tournament.status === 'active') {
      return (
        <Link 
          to={`/shooting/${tournament.id}`}
          className="btn btn-sm btn-primary"
        >
          <i className="bi bi-play-fill me-1"></i>
          Continue
        </Link>
      );
    } else {
      return (
        <Link 
          to={`/setup/${tournament.id}`}
          className="btn btn-sm btn-primary"
        >
          <i className="bi bi-gear me-1"></i>
          Setup
        </Link>
      );
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-trophy me-2"></i>
          Tournaments
        </h2>
        <Link to="/create" className="btn btn-primary btn-lg">
          <i className="bi bi-plus-circle me-2"></i>
          New Tournament
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-bullseye"></i>
          </div>
          <h3>No tournaments yet</h3>
          <p className="mb-4">Create your first tournament to get started</p>
          <Link to="/create" className="btn btn-primary btn-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Create Tournament
          </Link>
          
          {/* Animated archery illustration in bottom right */}
          <ArcheryIllustration />
        </div>
      ) : (
        <div className="row">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="col-md-6 col-lg-4 mb-4">
              <div className="tournament-card">
                <div className="tournament-card-header">
                  <div>
                    <h3 className="tournament-card-title">{tournament.name}</h3>
                    <div className="tournament-card-meta">
                      {tournament.venue && <div>{tournament.venue}</div>}
                      <div>{tournament.teams?.length || 0} teams</div>
                      {tournament.createdAt && (
                        <div className="text-muted small">
                          Created {new Date(tournament.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(tournament)}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {getActionButton(tournament)}
                  
                  {tournament.status === 'active' && (
                    <Link 
                      to={`/scoreboard/${tournament.id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <i className="bi bi-bar-chart me-1"></i>
                      Scoreboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => handleDelete(tournament.id)}
                    className="btn btn-sm btn-outline-danger ms-auto"
                    title="Delete tournament"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
