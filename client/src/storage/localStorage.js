/**
 * LocalStorage repository for tournament persistence
 */

const STORAGE_KEY = 'archeville:tournaments:v1';
const ACTIVE_TOURNAMENT_KEY = 'archeville:active:v1';

/**
 * Check if localStorage is available
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get all tournaments
 */
export function getAllTournaments() {
  if (!isStorageAvailable()) {
    return [];
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading tournaments from storage:', error);
    return [];
  }
}

/**
 * Get tournament by ID
 */
export function getTournamentById(id) {
  const tournaments = getAllTournaments();
  return tournaments.find(t => t.id === id) || null;
}

/**
 * Save tournament (create or update)
 */
export function saveTournament(tournament) {
  if (!isStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }
  
  try {
    const tournaments = getAllTournaments();
    const existingIndex = tournaments.findIndex(t => t.id === tournament.id);
    
    const updatedTournament = {
      ...tournament,
      updatedAt: new Date().toISOString()
    };
    
    if (!updatedTournament.createdAt) {
      updatedTournament.createdAt = updatedTournament.updatedAt;
    }
    
    if (existingIndex >= 0) {
      tournaments[existingIndex] = updatedTournament;
    } else {
      tournaments.push(updatedTournament);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
    return updatedTournament;
  } catch (error) {
    console.error('Error saving tournament:', error);
    throw new Error('Failed to save tournament to storage');
  }
}

/**
 * Delete tournament
 */
export function deleteTournament(id) {
  if (!isStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }
  
  try {
    const tournaments = getAllTournaments();
    const filtered = tournaments.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Clear active tournament if it was deleted
    const activeId = getActiveTournamentId();
    if (activeId === id) {
      clearActiveTournament();
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw new Error('Failed to delete tournament from storage');
  }
}

/**
 * Get active tournament ID
 */
export function getActiveTournamentId() {
  if (!isStorageAvailable()) {
    return null;
  }
  
  try {
    return localStorage.getItem(ACTIVE_TOURNAMENT_KEY);
  } catch (error) {
    console.error('Error reading active tournament:', error);
    return null;
  }
}

/**
 * Set active tournament
 */
export function setActiveTournament(id) {
  if (!isStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }
  
  try {
    localStorage.setItem(ACTIVE_TOURNAMENT_KEY, id);
  } catch (error) {
    console.error('Error setting active tournament:', error);
    throw new Error('Failed to set active tournament');
  }
}

/**
 * Clear active tournament
 */
export function clearActiveTournament() {
  if (!isStorageAvailable()) {
    return;
  }
  
  try {
    localStorage.removeItem(ACTIVE_TOURNAMENT_KEY);
  } catch (error) {
    console.error('Error clearing active tournament:', error);
  }
}

/**
 * Get active tournament data
 */
export function getActiveTournament() {
  const id = getActiveTournamentId();
  if (!id) {
    return null;
  }
  return getTournamentById(id);
}
