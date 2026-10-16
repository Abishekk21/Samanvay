/**
 * Tournament API controllers
 */

import { ValidationError, ConflictError } from '../errors/AppError.js';
import { validateTournamentConfiguration, validateShootingOrder, validateTournamentStart } from '../domain/tournament/validation.js';
import { calculateRoundResult, determineTournamentOutcome } from '../domain/tournament/calculator.js';
import { CIRCLES, BASE_POINTS, WINNING_THRESHOLD, SYNCHRONY_BONUS } from '../domain/scoring/rules.js';

/**
 * GET /api/v1/health
 * Health check endpoint
 */
export function healthCheck(req, res) {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
}

/**
 * GET /api/v1/rules
 * Get tournament rules and constants
 */
export function getRules(req, res) {
  res.json({
    success: true,
    data: {
      circles: CIRCLES,
      basePoints: BASE_POINTS,
      synchronyBonus: SYNCHRONY_BONUS,
      winningThreshold: WINNING_THRESHOLD,
      scoringFormula: 'points = basePoints[circle] + roundNumber - 1 (except F which is always 0)'
    }
  });
}

/**
 * POST /api/v1/tournaments/validate
 * Validate tournament configuration
 */
export function validateTournament(req, res) {
  const { tournament } = req.body;
  
  if (!tournament) {
    throw new ValidationError('Tournament object is required');
  }
  
  const validation = validateTournamentStart(tournament);
  
  res.json({
    success: true,
    data: {
      valid: validation.valid,
      errors: validation.errors
    }
  });
}

/**
 * POST /api/v1/tournaments/:tournamentId/rounds/preview
 * Preview round result without committing
 */
export function previewRound(req, res) {
  const { tournament, roundNumber, shots } = req.body;
  
  if (!tournament || !roundNumber || !shots) {
    throw new ValidationError('tournament, roundNumber, and shots are required');
  }
  
  // Check tournament status
  if (tournament.status === 'completed') {
    throw new ConflictError('Cannot score rounds in a completed tournament');
  }
  
  // Validate shots array
  if (!Array.isArray(shots) || shots.length === 0) {
    throw new ValidationError('shots must be a non-empty array');
  }
  
  // Calculate round result
  const roundResult = calculateRoundResult(tournament, roundNumber, shots);
  
  res.json({
    success: true,
    data: {
      roundResult
    }
  });
}

/**
 * POST /api/v1/tournaments/:tournamentId/rounds/complete
 * Complete a round and check for tournament completion
 */
export function completeRound(req, res) {
  const { tournament, roundNumber, shots } = req.body;
  
  if (!tournament || !roundNumber || !shots) {
    throw new ValidationError('tournament, roundNumber, and shots are required');
  }
  
  // Check tournament status
  if (tournament.status === 'completed') {
    throw new ConflictError('Cannot score rounds in a completed tournament');
  }
  
  // Check for duplicate round
  if (tournament.rounds && tournament.rounds.some(r => r.roundNumber === roundNumber && r.status === 'completed')) {
    throw new ConflictError(`Round ${roundNumber} has already been completed`);
  }
  
  // Calculate round result
  const roundResult = calculateRoundResult(tournament, roundNumber, shots);
  
  // Create updated tournament with new round
  const updatedRounds = [...(tournament.rounds || [])];
  
  // Replace or add round
  const existingIndex = updatedRounds.findIndex(r => r.roundNumber === roundNumber);
  if (existingIndex >= 0) {
    updatedRounds[existingIndex] = roundResult;
  } else {
    updatedRounds.push(roundResult);
  }
  
  const updatedTournament = {
    ...tournament,
    rounds: updatedRounds,
    currentRound: roundNumber
  };
  
  // Determine outcome
  const outcome = determineTournamentOutcome(updatedTournament);
  
  // Update tournament status
  updatedTournament.status = outcome.status;
  if (outcome.winner) {
    updatedTournament.winner = outcome.winner;
    updatedTournament.winnerName = outcome.winnerName;
    updatedTournament.finalScore = outcome.finalScore;
  } else if (outcome.tied) {
    updatedTournament.tied = outcome.tied;
  }
  
  res.json({
    success: true,
    data: {
      tournament: updatedTournament,
      roundResult,
      outcome
    }
  });
}

/**
 * POST /api/v1/tournaments/:tournamentId/score/validate
 * Validate a shot input
 */
export function validateShot(req, res) {
  const { circle, roundNumber } = req.body;
  
  if (!circle) {
    throw new ValidationError('circle is required');
  }
  
  if (!roundNumber || !Number.isInteger(roundNumber) || roundNumber < 1) {
    throw new ValidationError('roundNumber must be a positive integer');
  }
  
  const normalizedCircle = String(circle).trim().toUpperCase();
  
  if (!CIRCLES.includes(normalizedCircle)) {
    throw new ValidationError(`Invalid circle: ${circle}. Must be one of: ${CIRCLES.join(', ')}`);
  }
  
  res.json({
    success: true,
    data: {
      valid: true,
      normalizedCircle
    }
  });
}
