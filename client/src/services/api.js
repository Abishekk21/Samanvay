/**
 * API service for communicating with backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    const code = error.response?.data?.error?.code || 'NETWORK_ERROR';
    
    return Promise.reject({
      message,
      code,
      status: error.response?.status,
      details: error.response?.data?.error?.details
    });
  }
);

/**
 * Health check
 */
export async function checkHealth() {
  return api.get('/health');
}

/**
 * Get tournament rules
 */
export async function getRules() {
  return api.get('/rules');
}

/**
 * Validate tournament configuration
 */
export async function validateTournament(tournament) {
  return api.post('/tournaments/validate', { tournament });
}

/**
 * Preview round result
 */
export async function previewRound(tournament, roundNumber, shots) {
  return api.post(`/tournaments/${tournament.id}/rounds/preview`, {
    tournament,
    roundNumber,
    shots
  });
}

/**
 * Complete a round
 */
export async function completeRound(tournament, roundNumber, shots) {
  return api.post(`/tournaments/${tournament.id}/rounds/complete`, {
    tournament,
    roundNumber,
    shots
  });
}

/**
 * Validate shot
 */
export async function validateShot(circle, roundNumber) {
  return api.post('/tournaments/validate-shot/score/validate', {
    circle,
    roundNumber
  });
}

export default api;
