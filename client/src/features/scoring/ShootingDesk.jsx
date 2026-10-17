import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import { completeRound } from '../../services/api';
import TargetSelector from './TargetSelector';
import ActiveArcherDisplay from './ActiveArcherDisplay';
import RoundSummary from './RoundSummary';
import ArcheryTarget from './ArcheryTarget';
import './ShootingDesk.css';

function ShootingDesk() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournament, loading, error, updateTournament, refresh } = useTournament(tournamentId);
  
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [roundShots, setRoundShots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [roundSummary, setRoundSummary] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (tournament) {
      // Check if current round is already complete
      const currentRound = tournament.rounds?.find(r => r.roundNumber === tournament.currentRound);
      if (currentRound && currentRound.status === 'completed') {
        setRoundComplete(true);
        setRoundSummary(currentRound);
      }
    }
  }, [tournament]);

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

  if (tournament.status === 'completed') {
    return (
      <div className="alert alert-info">
        <h4>Tournament Completed</h4>
        <p>This tournament has finished.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/results/${tournament.id}`)}
        >
          View Results
        </button>
      </div>
    );
  }

  // Get current archer
  const currentArcherId = tournament.shootingOrder[currentShotIndex];
  const currentArcher = tournament.teams
    .flatMap(t => t.archers.map(a => ({ ...a, teamName: t.name, teamId: t.id })))
    .find(a => a.id === currentArcherId);

  const totalArchers = tournament.shootingOrder.length;
  const roundNumber = tournament.currentRound || 1;

  const handleCircleSelect = async (circle) => {
    if (!currentArcher) {
      return;
    }

    setApiError(null);

    // Add shot to round immediately
    const shot = {
      archerId: currentArcher.id,
      circle: circle
    };

    const updatedRoundShots = [...roundShots, shot];
    setRoundShots(updatedRoundShots);

    // Check if round is complete
    if (updatedRoundShots.length === totalArchers) {
      await submitRound(updatedRoundShots);
    } else {
      // Move to next archer
      setCurrentShotIndex(currentShotIndex + 1);
    }
  };

  const submitRound = async (shots) => {
    setSubmitting(true);

    try {
      const response = await completeRound(tournament, roundNumber, shots);
      
      if (response.success) {
        // Update tournament with response
        const updatedTournament = response.data.tournament;
        await updateTournament(updatedTournament);
        
        setRoundComplete(true);
        setRoundSummary(response.data.roundResult);
        setSubmitting(false);
      }
    } catch (err) {
      setApiError(err.message || 'Failed to submit round');
      setSubmitting(false);
    }
  };

  const handleStartNextRound = async () => {
    // Reset state
    setRoundComplete(false);
    setRoundSummary(null);
    setCurrentShotIndex(0);
    setRoundShots([]);
    
    // Increment round number
    await updateTournament({ currentRound: tournament.currentRound + 1 });
    refresh();
  };

  const handleViewScoreboard = () => {
    navigate(`/scoreboard/${tournament.id}`);
  };

  const handleViewResults = () => {
    navigate(`/results/${tournament.id}`);
  };

  // Show round summary after completion
  if (roundComplete && roundSummary) {
    return (
      <div>
        <h2 className="mb-4">
          <i className="bi bi-check-circle text-success me-2"></i>
          Round {roundNumber} Complete
        </h2>

        <RoundSummary 
          round={roundSummary}
          tournament={tournament}
        />

        <div className="d-flex gap-3 justify-content-center mt-4">
          <button
            className="btn btn-outline-primary btn-lg"
            onClick={handleViewScoreboard}
          >
            <i className="bi bi-bar-chart me-2"></i>
            View Scoreboard
          </button>

          {tournament.status === 'completed' ? (
            <button
              className="btn btn-success btn-lg"
              onClick={handleViewResults}
            >
              <i className="bi bi-trophy me-2"></i>
              View Final Results
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleStartNextRound}
            >
              <i className="bi bi-arrow-right-circle me-2"></i>
              Start Round {roundNumber + 1}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show submitting state
  if (submitting) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
        <h4>Finalizing Round {roundNumber}...</h4>
        <p className="text-muted">Calculating scores and bonuses</p>
      </div>
    );
  }

  return (
    <div className="shooting-desk-container">
      <div className="shooting-desk-content">
        <div className="shooting-desk-card">
          <div className="shooting-layout">
            {/* Left Panel - Info */}
            <div className="shooting-info-panel">
              <div className="shooting-info-header">
                <h1 className="shooting-info-title">
                  <i className="bi bi-bullseye me-2"></i>
                  {tournament.name}
                </h1>
                <p className="shooting-info-subtitle">Round {roundNumber} in Progress</p>
              </div>

              {currentArcher && (
                <>
                  <div className="info-section">
                    <div className="info-label">Round</div>
                    <div className="info-value-large">{String(roundNumber).padStart(2, '0')}</div>
                  </div>

                  <div className="info-section">
                    <div className="info-label">Current Shooter</div>
                    <div className="info-value">{currentArcher.name}</div>
                    <div className="info-meta" style={{ display: 'none' }}>
                      <i className="bi bi-people-fill me-2"></i>
                      {currentArcher.teamName}
                    </div>
                  </div>

                  <div className="info-section">
                    <div className="info-label">Position</div>
                    <div className="info-value">
                      {currentShotIndex + 1}/{totalArchers}
                    </div>
                  </div>

                  <div className="info-section">
                    <div className="info-label">Team Score</div>
                    <div className="info-value">
                      <span className="score-number">
                      {(() => {
                        const team = tournament.teams.find(t => t.id === currentArcher.teamId);
                        let total = 0;
                        if (tournament.rounds) {
                          for (const round of tournament.rounds) {
                            if (round.status === 'completed' && round.shots) {
                              for (const shot of round.shots) {
                                const shotArcher = team.archers.find(a => a.id === shot.archerId);
                                if (shotArcher) {
                                  total += shot.points;
                                }
                              }
                            }
                            if (round.status === 'completed' && round.bonuses) {
                              const teamBonus = round.bonuses.find(b => b.teamId === team.id);
                              if (teamBonus) {
                                total += teamBonus.bonus;
                              }
                            }
                          }
                        }
                        return total;
                      })()}
                      </span>
                      {" "}
                      <span className="score-unit">pts</span>
                    </div>
                  </div>
                </>
              )}

              <div className="shooting-progress">
                <div className="progress-label">Round Progress</div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(roundShots.length / totalArchers) * 100}%` }}
                  >
                    {roundShots.length} / {totalArchers}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Target Board */}
            <div className="shooting-target-panel">
              {/* Decorative clouds */}
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>
              
              <h3 className="target-instruction">Click on the target to record shot</h3>
              <ArcheryTarget
                roundNumber={roundNumber}
                onSelect={handleCircleSelect}
                confirming={false}
                selectedCircle={null}
              />
            </div>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger alert-dismissible fade show mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {apiError}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setApiError(null)}
            ></button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShootingDesk;
