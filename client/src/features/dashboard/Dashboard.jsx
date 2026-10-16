import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllTournaments, deleteTournament } from '../../storage/localStorage';
import Modal from '../../components/Modal';
import { Lottie } from 'lottie-react';
import carnivalAnimation from '../../Carnival Archery.json';
import { staggerContainer, fadeInUp, cardHover, buttonTap } from '../../utils/transitions';
import './Dashboard.css';

function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const openDeleteModal = (tournament) => {
    setTournamentToDelete(tournament);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteModalOpen(false);
      setTournamentToDelete(null);
    }
  };

  const confirmDelete = async () => {
    if (!tournamentToDelete || deleting) return;

    setDeleting(true);
    try {
      deleteTournament(tournamentToDelete.id);
      loadTournaments();
      closeDeleteModal();
    } catch (error) {
      alert('Failed to delete tournament');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (tournament) => {
    if (tournament.status === 'completed') {
      return <span className="tournament-status-badge status-completed">Completed</span>;
    } else if (tournament.status === 'active' && tournament.currentRound > 0) {
      return <span className="tournament-status-badge status-active">Round {tournament.currentRound}</span>;
    } else {
      return <span className="tournament-status-badge status-setup">Setup</span>;
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

  const calculateStats = () => {
    const total = tournaments.length;
    const active = tournaments.filter(t => t.status === 'active').length;
    const completed = tournaments.filter(t => t.status === 'completed').length;
    const totalTeams = tournaments.reduce((sum, t) => sum + (t.teams?.length || 0), 0);
    
    return { total, active, completed, totalTeams };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <motion.div 
      className="dashboard-container"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      {/* Dashboard Content */}
      <div className="dashboard-content-wrapper">
        {/* Page Header */}
        <motion.div className="dashboard-header" variants={fadeInUp}>
          <div>
            <h1 className="dashboard-title">Tournaments</h1>
            <p className="dashboard-subtitle">
              Manage your tournaments, track progress, and review final results
            </p>
          </div>
          <motion.div whileTap={buttonTap}>
            <Link to="/create" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Tournament
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats Overview - Always visible */}
        <motion.div className="dashboard-stats" variants={fadeInUp}>
          <motion.div 
            className="stat-card stat-card-red"
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <div className="stat-icon">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{String(stats.total).padStart(2, '0')}</div>
              <div className="stat-label">Total Tournaments</div>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card stat-card-yellow"
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <div className="stat-icon">
              <i className="bi bi-play-circle-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{String(stats.active).padStart(2, '0')}</div>
              <div className="stat-label">Active</div>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card stat-card-blue"
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <div className="stat-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{String(stats.completed).padStart(2, '0')}</div>
              <div className="stat-label">Completed</div>
            </div>
          </motion.div>
          <motion.div 
            className="stat-card stat-card-green"
            initial="rest"
            whileHover="hover"
            variants={cardHover}
          >
            <div className="stat-icon">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{String(stats.totalTeams).padStart(2, '0')}</div>
              <div className="stat-label">Total Teams</div>
            </div>
          </motion.div>
        </motion.div>

      {/* Tournaments Section */}
      <motion.div className="tournaments-section" variants={fadeInUp}>
        <div className="tournaments-section-header">
          <h2 className="tournaments-section-title">Your Tournaments</h2>
          <p className="tournaments-section-subtitle">
            All your tournaments, in one place. Create a tournament to get started.
          </p>
        </div>

        {tournaments.length === 0 ? (
          /* Empty State Panel */
          <div className="empty-state-panel">
            <div className="empty-state-content-grid">
              <div className="empty-state-text">
                <h3 className="empty-state-heading">Your tournament workspace is ready</h3>
                <p className="empty-state-desc">
                  Set up your competition, register teams, record every shot, and follow the results through to the final winner.
                </p>
                <ul className="empty-state-features">
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Register teams and archers</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Record rounds with automatic score calculation</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Track standings and determine the winner</span>
                  </li>
                </ul>
              </div>
              <div className="empty-state-illustration">
                <Lottie 
                  src={carnivalAnimation}
                  autoplay
                  loop
                  style={{ width: '100%', height: '100%', maxHeight: '600px' }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Tournament Grid */
          <motion.div 
            className="tournament-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {tournaments.map((tournament, index) => (
              <motion.div 
                key={tournament.id} 
                className="tournament-card-premium"
                variants={fadeInUp}
                whileHover={cardHover.hover}
                custom={index}
              >
                <div className="tournament-card-icon">
                  <i className="bi bi-bullseye"></i>
                </div>
                
                <div className="tournament-card-header-premium">
                  <div className="tournament-card-title-section">
                    <h3 className="tournament-card-title-premium">{tournament.name}</h3>
                    {getStatusBadge(tournament)}
                  </div>
                </div>

                <div className="tournament-card-meta-premium">
                  {tournament.venue && (
                    <div className="meta-item">
                      <i className="bi bi-geo-alt"></i>
                      <span>{tournament.venue}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <i className="bi bi-people"></i>
                    <span>{tournament.teams?.length || 0} teams</span>
                  </div>
                  {tournament.createdAt && (
                    <div className="meta-item">
                      <i className="bi bi-calendar"></i>
                      <span>{new Date(tournament.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="tournament-card-divider"></div>

                <div className="tournament-card-actions">
                  {getActionButton(tournament)}
                  
                  {tournament.status === 'active' && (
                    <Link 
                      to={`/scoreboard/${tournament.id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <i className="bi bi-bar-chart"></i>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => openDeleteModal(tournament)}
                    className="btn btn-sm btn-outline-danger ms-auto"
                    title="Delete tournament"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Tournament"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDeleteModal}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash me-2"></i>
                  Delete Tournament
                </>
              )}
            </button>
          </>
        }
      >
        {tournamentToDelete && (
          <div>
            <p className="mb-3">
              Are you sure you want to delete <strong>{tournamentToDelete.name}</strong>?
            </p>
            <div className="alert alert-warning mb-0">
              <i className="bi bi-exclamation-triangle me-2"></i>
              This action cannot be undone. All tournament data, including teams, rounds, and scores will be permanently deleted.
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default Dashboard;
