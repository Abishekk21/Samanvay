import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTournament } from '../../hooks/useTournament';
import { completeRound } from '../../services/api';
import TargetSelector from './TargetSelector';
import ActiveArcherDisplay from './ActiveArcherDisplay';
import RoundSummary from './RoundSummary';

function ShootingDesk() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournament, loading, error, updateTournament, refresh } = useTournament(tournamentId);
  
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [roundShots, setRoundShots] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [confirming, setConfirming] = useState(false);
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

  const handleCircleSelect = (circle) => {
    setSelectedCircle(circle);
    setConfirming(true);
  };

  const handleConfirmShot = async () => {
    if (!selectedCircle || !currentArcher) {
      return;
    }

    setApiError(null);

    // Add shot to round
    const shot = {
      archerId: currentArcher.id,
      circle: selectedCircle
    };

    const updatedRoundShots = [...roundShots, shot];
    setRoundShots(updatedRoundShots);
    setSelectedCircle(null);
    setConfirming(false);

    // Check if round is complete
    if (updatedRoundShots.length === totalArchers) {
      await submitRound(updatedRoundShots);
    } else {
      // Move to next archer
      setCurrentShotIndex(currentShotIndex + 1);
    }
  };

  const handleCancelShot = () => {
    setSelectedCircle(null);
    setConfirming(false);
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
    <div>
      <div className="mb-4">
        <h2>
          <i className="bi bi-bullseye me-2"></i>
          {tournament.name} - Round {roundNumber}
        </h2>
        
        <div className="progress-bar-wrapper">
          <div className="progress">
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: `${(roundShots.length / totalArchers) * 100}%` }}
            >
              {roundShots.length} / {totalArchers} shots
            </div>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="alert alert-danger alert-dismissible fade show">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {apiError}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setApiError(null)}
          ></button>
        </div>
      )}

      {currentArcher && (
        <ActiveArcherDisplay
          archer={currentArcher}
          position={currentShotIndex + 1}
          total={totalArchers}
          roundNumber={roundNumber}
          tournament={tournament}
        />
      )}

      {!confirming ? (
        <>
          <h4 className="mb-3 text-center">Select Target Circle</h4>
          <TargetSelector
            roundNumber={roundNumber}
            onSelect={handleCircleSelect}
          />
        </>
      ) : (
        <div className="card shadow-lg">
          <div className="card-body text-center p-5">
            <h3 className="mb-4">
              <i className="bi bi-question-circle text-warning me-2"></i>
              Confirm Shot
            </h3>
            <p className="lead mb-4">
              <strong>{currentArcher.name}</strong> hit circle <strong className="fs-2">{selectedCircle}</strong>?
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-lg btn-outline-secondary"
                onClick={handleCancelShot}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                className="btn btn-lg btn-success"
                onClick={handleConfirmShot}
              >
                <i className="bi bi-check-circle me-2"></i>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShootingDesk;
