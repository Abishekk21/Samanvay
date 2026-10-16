/**
 * Official tournament scoring rules and constants
 */

// Valid target circles
export const CIRCLES = ['A', 'B', 'C', 'D', 'E', 'F'];

// Base points for each circle in round 1
export const BASE_POINTS = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0
};

// Synchrony bonus (awarded when both archers hit the same circle)
export const SYNCHRONY_BONUS = 2;

// Winning threshold
export const WINNING_THRESHOLD = 60;

// Validation constants
export const MIN_TEAMS = 2;
export const ARCHERS_PER_TEAM = 2;
export const MAX_NAME_LENGTH = 100;
export const MIN_NAME_LENGTH = 1;

/**
 * Calculate points for a shot based on circle and round number
 * Formula: basePoints[circle] + roundNumber - 1
 * Exception: F always scores 0
 * 
 * @param {string} circle - Target circle (A-F)
 * @param {number} roundNumber - Current round (1-based)
 * @returns {number} Points earned
 */
export function calculateShotPoints(circle, roundNumber) {
  const normalizedCircle = String(circle).trim().toUpperCase();
  
  if (!CIRCLES.includes(normalizedCircle)) {
    throw new Error(`Invalid circle: ${circle}. Must be one of: ${CIRCLES.join(', ')}`);
  }
  
  if (!Number.isInteger(roundNumber) || roundNumber < 1) {
    throw new Error(`Invalid round number: ${roundNumber}. Must be a positive integer.`);
  }
  
  // F always scores 0
  if (normalizedCircle === 'F') {
    return 0;
  }
  
  const basePoints = BASE_POINTS[normalizedCircle];
  return basePoints + roundNumber - 1;
}

/**
 * Validate circle input
 * 
 * @param {string} circle - Circle to validate
 * @returns {string} Normalized circle (uppercase, trimmed)
 */
export function validateAndNormalizeCircle(circle) {
  const normalized = String(circle).trim().toUpperCase();
  
  if (!CIRCLES.includes(normalized)) {
    throw new Error(`Invalid circle: ${circle}. Must be one of: ${CIRCLES.join(', ')}`);
  }
  
  return normalized;
}

/**
 * Check if a team earned a synchrony bonus for a round
 * Both archers must hit the same circle (including F+F)
 * 
 * @param {string} circle1 - First archer's circle
 * @param {string} circle2 - Second archer's circle
 * @returns {boolean} Whether synchrony bonus is earned
 */
export function checkSynchronyBonus(circle1, circle2) {
  const c1 = validateAndNormalizeCircle(circle1);
  const c2 = validateAndNormalizeCircle(circle2);
  
  return c1 === c2;
}

/**
 * Calculate synchrony bonuses for all teams in a round
 * 
 * @param {Array<{teamId: string, archerId: string, circle: string}>} shots - All shots in the round
 * @param {Array<{id: string, archers: Array}>} teams - Team definitions
 * @returns {Array<{teamId: string, bonus: number}>} Bonuses earned
 */
export function calculateRoundBonuses(shots, teams) {
  const bonuses = [];
  
  for (const team of teams) {
    if (team.archers.length !== ARCHERS_PER_TEAM) {
      throw new Error(`Team ${team.name} must have exactly ${ARCHERS_PER_TEAM} archers`);
    }
    
    const archer1Id = team.archers[0].id;
    const archer2Id = team.archers[1].id;
    
    const shot1 = shots.find(s => s.archerId === archer1Id);
    const shot2 = shots.find(s => s.archerId === archer2Id);
    
    if (!shot1 || !shot2) {
      throw new Error(`Missing shot data for team ${team.name}`);
    }
    
    const hasSynchrony = checkSynchronyBonus(shot1.circle, shot2.circle);
    
    bonuses.push({
      teamId: team.id,
      bonus: hasSynchrony ? SYNCHRONY_BONUS : 0
    });
  }
  
  return bonuses;
}
