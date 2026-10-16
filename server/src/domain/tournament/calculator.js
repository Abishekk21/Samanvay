/**
 * Tournament calculation engine
 * Deterministic scoring and standings calculation
 */

import { calculateShotPoints, calculateRoundBonuses, WINNING_THRESHOLD } from '../scoring/rules.js';

/**
 * Calculate individual cumulative scores from tournament history
 * 
 * @param {Object} tournament - Tournament with rounds
 * @returns {Map<string, number>} Map of archerId -> cumulative points
 */
export function calculateIndividualTotals(tournament) {
  const totals = new Map();
  
  // Initialize all archers to 0
  for (const team of tournament.teams) {
    for (const archer of team.archers) {
      totals.set(archer.id, 0);
    }
  }
  
  // Sum up all completed rounds
  if (tournament.rounds) {
    for (const round of tournament.rounds) {
      if (round.status === 'completed' && round.shots) {
        for (const shot of round.shots) {
          const current = totals.get(shot.archerId) || 0;
          totals.set(shot.archerId, current + shot.points);
        }
      }
    }
  }
  
  return totals;
}

/**
 * Calculate team cumulative bonuses from tournament history
 * 
 * @param {Object} tournament - Tournament with rounds
 * @returns {Map<string, number>} Map of teamId -> cumulative bonus
 */
export function calculateTeamBonuses(tournament) {
  const bonuses = new Map();
  
  // Initialize all teams to 0
  for (const team of tournament.teams) {
    bonuses.set(team.id, 0);
  }
  
  // Sum up all completed rounds
  if (tournament.rounds) {
    for (const round of tournament.rounds) {
      if (round.status === 'completed' && round.bonuses) {
        for (const bonus of round.bonuses) {
          const current = bonuses.get(bonus.teamId) || 0;
          bonuses.set(bonus.teamId, current + bonus.bonus);
        }
      }
    }
  }
  
  return bonuses;
}

/**
 * Calculate team totals (individual scores + bonuses)
 * 
 * @param {Object} tournament - Tournament object
 * @param {Map<string, number>} individualTotals - Individual cumulative scores
 * @param {Map<string, number>} teamBonuses - Team cumulative bonuses
 * @returns {Map<string, number>} Map of teamId -> total score
 */
export function calculateTeamTotals(tournament, individualTotals, teamBonuses) {
  const teamTotals = new Map();
  
  for (const team of tournament.teams) {
    let teamTotal = 0;
    
    // Sum both archers' individual scores
    for (const archer of team.archers) {
      teamTotal += individualTotals.get(archer.id) || 0;
    }
    
    // Add team bonuses
    teamTotal += teamBonuses.get(team.id) || 0;
    
    teamTotals.set(team.id, teamTotal);
  }
  
  return teamTotals;
}

/**
 * Calculate standings with ranking
 * 
 * @param {Object} tournament - Tournament object
 * @returns {Array<Object>} Sorted standings
 */
export function calculateStandings(tournament) {
  const individualTotals = calculateIndividualTotals(tournament);
  const teamBonuses = calculateTeamBonuses(tournament);
  const teamTotals = calculateTeamTotals(tournament, individualTotals, teamBonuses);
  
  const standings = tournament.teams.map(team => {
    const archer1 = team.archers[0];
    const archer2 = team.archers[1];
    
    return {
      teamId: team.id,
      teamName: team.name,
      archer1Name: archer1.name,
      archer1Score: individualTotals.get(archer1.id) || 0,
      archer2Name: archer2.name,
      archer2Score: individualTotals.get(archer2.id) || 0,
      bonusTotal: teamBonuses.get(team.id) || 0,
      teamTotal: teamTotals.get(team.id) || 0,
      pointsToWin: Math.max(0, WINNING_THRESHOLD - (teamTotals.get(team.id) || 0))
    };
  });
  
  // Sort by team total descending, then by registration order (stable sort)
  standings.sort((a, b) => b.teamTotal - a.teamTotal);
  
  // Add rank
  standings.forEach((standing, index) => {
    standing.rank = index + 1;
  });
  
  return standings;
}

/**
 * Calculate round result from shots
 * 
 * @param {Object} tournament - Current tournament state
 * @param {number} roundNumber - Round number
 * @param {Array<{archerId: string, circle: string}>} shots - Shot inputs
 * @returns {Object} Calculated round result
 */
export function calculateRoundResult(tournament, roundNumber, shots) {
  // Validate all archers have exactly one shot
  const archerIds = new Set();
  const allArcherIds = new Set();
  
  for (const team of tournament.teams) {
    for (const archer of team.archers) {
      allArcherIds.add(archer.id);
    }
  }
  
  for (const shot of shots) {
    if (!allArcherIds.has(shot.archerId)) {
      throw new Error(`Unknown archer: ${shot.archerId}`);
    }
    
    if (archerIds.has(shot.archerId)) {
      throw new Error(`Duplicate shot for archer: ${shot.archerId}`);
    }
    
    archerIds.add(shot.archerId);
  }
  
  if (shots.length !== allArcherIds.size) {
    throw new Error(`Missing shots. Expected ${allArcherIds.size}, got ${shots.length}`);
  }
  
  // Calculate points for each shot
  const calculatedShots = shots.map(shot => ({
    archerId: shot.archerId,
    circle: shot.circle.toUpperCase().trim(),
    points: calculateShotPoints(shot.circle, roundNumber)
  }));
  
  // Calculate bonuses
  const bonuses = calculateRoundBonuses(calculatedShots, tournament.teams);
  
  return {
    roundNumber,
    shots: calculatedShots,
    bonuses,
    status: 'completed'
  };
}

/**
 * Determine tournament outcome
 * 
 * @param {Object} tournament - Tournament object
 * @returns {Object} Outcome {status: 'active'|'completed', winner?: string, tied?: Array<string>}
 */
export function determineTournamentOutcome(tournament) {
  const standings = calculateStandings(tournament);
  
  // Check if any team has reached the threshold
  const qualifyingTeams = standings.filter(s => s.teamTotal >= WINNING_THRESHOLD);
  
  if (qualifyingTeams.length === 0) {
    return { status: 'active' };
  }
  
  // Find highest score among qualifying teams
  const highestScore = Math.max(...qualifyingTeams.map(t => t.teamTotal));
  const winners = qualifyingTeams.filter(t => t.teamTotal === highestScore);
  
  if (winners.length === 1) {
    return {
      status: 'completed',
      winner: winners[0].teamId,
      winnerName: winners[0].teamName,
      finalScore: winners[0].teamTotal
    };
  } else {
    return {
      status: 'completed',
      tied: winners.map(w => ({
        teamId: w.teamId,
        teamName: w.teamName,
        finalScore: w.teamTotal
      }))
    };
  }
}

/**
 * Recalculate entire tournament from history
 * Useful after corrections or data restoration
 * 
 * @param {Object} tournament - Tournament object
 * @returns {Object} Updated tournament with recalculated state
 */
export function recalculateTournamentFromHistory(tournament) {
  // Recalculate all round results
  const updatedRounds = [];
  
  if (tournament.rounds) {
    for (const round of tournament.rounds) {
      if (round.status === 'completed' && round.shots) {
        const recalculated = calculateRoundResult(
          { ...tournament, rounds: updatedRounds }, // Use only completed rounds so far
          round.roundNumber,
          round.shots.map(s => ({ archerId: s.archerId, circle: s.circle }))
        );
        updatedRounds.push(recalculated);
      } else {
        updatedRounds.push(round);
      }
    }
  }
  
  const updatedTournament = {
    ...tournament,
    rounds: updatedRounds
  };
  
  // Determine outcome
  const outcome = determineTournamentOutcome(updatedTournament);
  
  return {
    ...updatedTournament,
    status: outcome.status,
    winner: outcome.winner,
    winnerName: outcome.winnerName,
    finalScore: outcome.finalScore,
    tied: outcome.tied
  };
}
