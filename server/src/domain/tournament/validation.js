/**
 * Tournament validation logic
 */

import { 
  MIN_TEAMS, 
  ARCHERS_PER_TEAM, 
  MAX_NAME_LENGTH, 
  MIN_NAME_LENGTH 
} from '../scoring/rules.js';

/**
 * Validate tournament name
 */
export function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    throw new Error(`${fieldName} is required`);
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < MIN_NAME_LENGTH) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  
  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new Error(`${fieldName} cannot exceed ${MAX_NAME_LENGTH} characters`);
  }
  
  return trimmed;
}

/**
 * Validate team structure
 */
export function validateTeam(team) {
  if (!team || typeof team !== 'object') {
    throw new Error('Invalid team object');
  }
  
  if (!team.id) {
    throw new Error('Team must have an ID');
  }
  
  validateName(team.name, 'Team name');
  
  if (!Array.isArray(team.archers)) {
    throw new Error('Team must have an archers array');
  }
  
  if (team.archers.length !== ARCHERS_PER_TEAM) {
    throw new Error(`Each team must have exactly ${ARCHERS_PER_TEAM} archers`);
  }
  
  // Validate each archer
  for (const archer of team.archers) {
    if (!archer.id) {
      throw new Error('Each archer must have an ID');
    }
    validateName(archer.name, 'Archer name');
  }
  
  // Check for duplicate archer IDs within team
  const archerIds = team.archers.map(a => a.id);
  const uniqueIds = new Set(archerIds);
  if (uniqueIds.size !== archerIds.length) {
    throw new Error(`Team ${team.name} has duplicate archer IDs`);
  }
  
  return true;
}

/**
 * Validate tournament configuration
 */
export function validateTournamentConfiguration(tournament) {
  const errors = [];
  
  // Validate tournament name
  try {
    validateName(tournament.name, 'Tournament name');
  } catch (error) {
    errors.push(error.message);
  }
  
  // Validate teams
  if (!Array.isArray(tournament.teams)) {
    errors.push('Tournament must have a teams array');
    return { valid: false, errors };
  }
  
  if (tournament.teams.length < MIN_TEAMS) {
    errors.push(`Tournament must have at least ${MIN_TEAMS} teams`);
  }
  
  // Validate each team
  const teamIds = new Set();
  const archerIds = new Set();
  
  for (const team of tournament.teams) {
    try {
      validateTeam(team);
      
      // Check for duplicate team ID
      if (teamIds.has(team.id)) {
        errors.push(`Duplicate team ID: ${team.id}`);
      }
      teamIds.add(team.id);
      
      // Check for duplicate archer IDs across all teams
      for (const archer of team.archers) {
        if (archerIds.has(archer.id)) {
          errors.push(`Archer ${archer.name} (${archer.id}) is registered to multiple teams`);
        }
        archerIds.add(archer.id);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate shooting order
 */
export function validateShootingOrder(tournament) {
  const errors = [];
  
  if (!Array.isArray(tournament.shootingOrder)) {
    errors.push('Shooting order must be an array');
    return { valid: false, errors };
  }
  
  // Collect all registered archer IDs
  const allArcherIds = new Set();
  for (const team of tournament.teams) {
    for (const archer of team.archers) {
      allArcherIds.add(archer.id);
    }
  }
  
  // Check shooting order
  const shootingOrderIds = new Set();
  
  for (const archerId of tournament.shootingOrder) {
    if (!allArcherIds.has(archerId)) {
      errors.push(`Unknown archer in shooting order: ${archerId}`);
    }
    
    if (shootingOrderIds.has(archerId)) {
      errors.push(`Duplicate archer in shooting order: ${archerId}`);
    }
    
    shootingOrderIds.add(archerId);
  }
  
  // Check if all archers are in shooting order
  for (const archerId of allArcherIds) {
    if (!shootingOrderIds.has(archerId)) {
      errors.push(`Archer missing from shooting order: ${archerId}`);
    }
  }
  
  // Check counts match
  if (tournament.shootingOrder.length !== allArcherIds.size) {
    errors.push(`Shooting order length (${tournament.shootingOrder.length}) does not match number of archers (${allArcherIds.size})`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate that tournament can start
 */
export function validateTournamentStart(tournament) {
  const configErrors = validateTournamentConfiguration(tournament);
  if (!configErrors.valid) {
    return configErrors;
  }
  
  const orderErrors = validateShootingOrder(tournament);
  if (!orderErrors.valid) {
    return orderErrors;
  }
  
  return { valid: true, errors: [] };
}
