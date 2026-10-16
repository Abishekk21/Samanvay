/**
 * Simple ID generator
 */

export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

export function generateTournamentId() {
  return generateId('tournament');
}

export function generateTeamId() {
  return generateId('team');
}

export function generateArcherId() {
  return generateId('archer');
}
