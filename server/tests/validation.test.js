/**
 * Validation tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  validateName,
  validateTeam,
  validateTournamentConfiguration,
  validateShootingOrder
} from '../src/domain/tournament/validation.js';

test('validateName - accepts valid names', () => {
  assert.strictEqual(validateName('Tournament 2026'), 'Tournament 2026');
  assert.strictEqual(validateName('  Spaces  '), 'Spaces');
  assert.strictEqual(validateName('János Diák'), 'János Diák');
});

test('validateName - rejects invalid names', () => {
  assert.throws(() => validateName(''), /required/);
  assert.throws(() => validateName('   '), /cannot be empty/);
  assert.throws(() => validateName(null), /required/);
  assert.throws(() => validateName('a'.repeat(101)), /cannot exceed/);
});

test('validateTeam - validates team structure', () => {
  const validTeam = {
    id: 'team1',
    name: 'Team A',
    archers: [
      { id: 'archer1', name: 'Archer 1' },
      { id: 'archer2', name: 'Archer 2' }
    ]
  };
  
  assert.strictEqual(validateTeam(validTeam), true);
});

test('validateTeam - rejects teams with wrong number of archers', () => {
  const invalidTeam = {
    id: 'team1',
    name: 'Team A',
    archers: [
      { id: 'archer1', name: 'Archer 1' }
    ]
  };
  
  assert.throws(() => validateTeam(invalidTeam), /exactly 2 archers/);
});

test('validateTournamentConfiguration - validates complete tournament', () => {
  const tournament = {
    name: 'Test Tournament',
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        archers: [
          { id: 'archer1', name: 'Archer 1' },
          { id: 'archer2', name: 'Archer 2' }
        ]
      },
      {
        id: 'team2',
        name: 'Team 2',
        archers: [
          { id: 'archer3', name: 'Archer 3' },
          { id: 'archer4', name: 'Archer 4' }
        ]
      }
    ]
  };
  
  const result = validateTournamentConfiguration(tournament);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('validateTournamentConfiguration - detects insufficient teams', () => {
  const tournament = {
    name: 'Test Tournament',
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        archers: [
          { id: 'archer1', name: 'Archer 1' },
          { id: 'archer2', name: 'Archer 2' }
        ]
      }
    ]
  };
  
  const result = validateTournamentConfiguration(tournament);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('at least 2 teams')));
});

test('validateShootingOrder - validates correct order', () => {
  const tournament = {
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        archers: [
          { id: 'archer1', name: 'Archer 1' },
          { id: 'archer2', name: 'Archer 2' }
        ]
      },
      {
        id: 'team2',
        name: 'Team 2',
        archers: [
          { id: 'archer3', name: 'Archer 3' },
          { id: 'archer4', name: 'Archer 4' }
        ]
      }
    ],
    shootingOrder: ['archer1', 'archer2', 'archer3', 'archer4']
  };
  
  const result = validateShootingOrder(tournament);
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('validateShootingOrder - detects missing archers', () => {
  const tournament = {
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        archers: [
          { id: 'archer1', name: 'Archer 1' },
          { id: 'archer2', name: 'Archer 2' }
        ]
      }
    ],
    shootingOrder: ['archer1'] // Missing archer2
  };
  
  const result = validateShootingOrder(tournament);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('missing')));
});

test('validateShootingOrder - detects duplicate archers', () => {
  const tournament = {
    teams: [
      {
        id: 'team1',
        name: 'Team 1',
        archers: [
          { id: 'archer1', name: 'Archer 1' },
          { id: 'archer2', name: 'Archer 2' }
        ]
      }
    ],
    shootingOrder: ['archer1', 'archer1', 'archer2'] // Duplicate archer1
  };
  
  const result = validateShootingOrder(tournament);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('Duplicate')));
});
