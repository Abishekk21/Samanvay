/**
 * Custom hook for tournament operations
 */

import { useState, useEffect, useCallback } from 'react';
import { getTournamentById, saveTournament } from '../storage/localStorage';

export function useTournament(tournamentId) {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tournament
  const loadTournament = useCallback(() => {
    if (!tournamentId) {
      setLoading(false);
      return;
    }

    try {
      const loaded = getTournamentById(tournamentId);
      if (!loaded) {
        setError('Tournament not found');
      } else {
        setTournament(loaded);
      }
    } catch (err) {
      setError(err.message || 'Failed to load tournament');
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    loadTournament();
  }, [loadTournament]);

  // Update tournament
  const updateTournament = useCallback(async (updates) => {
    if (!tournament) {
      throw new Error('No tournament loaded');
    }

    try {
      const updated = {
        ...tournament,
        ...updates
      };
      
      const saved = saveTournament(updated);
      setTournament(saved);
      return saved;
    } catch (err) {
      throw new Error(err.message || 'Failed to update tournament');
    }
  }, [tournament]);

  // Refresh tournament from storage
  const refresh = useCallback(() => {
    loadTournament();
  }, [loadTournament]);

  return {
    tournament,
    loading,
    error,
    updateTournament,
    refresh
  };
}
