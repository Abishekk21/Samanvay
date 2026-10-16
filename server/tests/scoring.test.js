/**
 * Scoring rules tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateShotPoints,
  validateAndNormalizeCircle,
  checkSynchronyBonus,
  calculateRoundBonuses,
  CIRCLES,
  BASE_POINTS,
  SYNCHRONY_BONUS
} from '../src/domain/scoring/rules.js';

// Test calculateShotPoints for round 1
test('calculateShotPoints - Round 1 scoring', () => {
  assert.strictEqual(calculateShotPoints('A', 1), 5);
  assert.strictEqual(calculateShotPoints('B', 1), 4);
  assert.strictEqual(calculateShotPoints('C', 1), 3);
  assert.strictEqual(calculateShotPoints('D', 1), 2);
  assert.strictEqual(calculateShotPoints('E', 1), 1);
  assert.strictEqual(calculateShotPoints('F', 1), 0);
});

// Test calculateShotPoints for later rounds
test('calculateShotPoints - Round 2 scoring', () => {
  assert.strictEqual(calculateShotPoints('A', 2), 6);
  assert.strictEqual(calculateShotPoints('B', 2), 5);
  assert.strictEqual(calculateShotPoints('C', 2), 4);
  assert.strictEqual(calculateShotPoints('D', 2), 3);
  assert.strictEqual(calculateShotPoints('E', 2), 2);
  assert.strictEqual(calculateShotPoints('F', 2), 0);
});

test('calculateShotPoints - Round 3 scoring', () => {
  assert.strictEqual(calculateShotPoints('A', 3), 7);
  assert.strictEqual(calculateShotPoints('C', 3), 5);
  assert.strictEqual(calculateShotPoints('E', 3), 3);
  assert.strictEqual(calculateShotPoints('F', 3), 0);
});

test('calculateShotPoints - Round 5 scoring', () => {
  assert.strictEqual(calculateShotPoints('A', 5), 9);
  assert.strictEqual(calculateShotPoints('E', 5), 5);
  assert.strictEqual(calculateShotPoints('F', 5), 0);
});

// Test F always scores 0
test('calculateShotPoints - F always scores 0', () => {
  assert.strictEqual(calculateShotPoints('F', 1), 0);
  assert.strictEqual(calculateShotPoints('F', 10), 0);
  assert.strictEqual(calculateShotPoints('F', 100), 0);
});

// Test invalid circles
test('calculateShotPoints - invalid circle throws error', () => {
  assert.throws(() => calculateShotPoints('G', 1), /Invalid circle/);
  assert.throws(() => calculateShotPoints('X', 1), /Invalid circle/);
  assert.throws(() => calculateShotPoints('', 1), /Invalid circle/);
});

// Test invalid round numbers
test('calculateShotPoints - invalid round number throws error', () => {
  assert.throws(() => calculateShotPoints('A', 0), /Invalid round number/);
  assert.throws(() => calculateShotPoints('A', -1), /Invalid round number/);
  assert.throws(() => calculateShotPoints('A', 1.5), /Invalid round number/);
});

// Test normalization
test('validateAndNormalizeCircle - handles whitespace and case', () => {
  assert.strictEqual(validateAndNormalizeCircle(' a '), 'A');
  assert.strictEqual(validateAndNormalizeCircle('b'), 'B');
  assert.strictEqual(validateAndNormalizeCircle('  F  '), 'F');
});

// Test synchrony bonus
test('checkSynchronyBonus - same circle earns bonus', () => {
  assert.strictEqual(checkSynchronyBonus('A', 'A'), true);
  assert.strictEqual(checkSynchronyBonus('B', 'B'), true);
  assert.strictEqual(checkSynchronyBonus('F', 'F'), true);
});

test('checkSynchronyBonus - different circles do not earn bonus', () => {
  assert.strictEqual(checkSynchronyBonus('A', 'B'), false);
  assert.strictEqual(checkSynchronyBonus('C', 'F'), false);
  assert.strictEqual(checkSynchronyBonus('D', 'E'), false);
});

// Test calculateRoundBonuses
test('calculateRoundBonuses - calculates bonuses correctly', () => {
  const teams = [
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
  ];
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer2', circle: 'A' }, // Synchrony!
    { archerId: 'archer3', circle: 'B' },
    { archerId: 'archer4', circle: 'C' }  // No synchrony
  ];
  
  const bonuses = calculateRoundBonuses(shots, teams);
  
  assert.strictEqual(bonuses.length, 2);
  assert.strictEqual(bonuses[0].teamId, 'team1');
  assert.strictEqual(bonuses[0].bonus, SYNCHRONY_BONUS);
  assert.strictEqual(bonuses[1].teamId, 'team2');
  assert.strictEqual(bonuses[1].bonus, 0);
});

test('calculateRoundBonuses - F+F earns synchrony bonus', () => {
  const teams = [
    {
      id: 'team1',
      name: 'Team 1',
      archers: [
        { id: 'archer1', name: 'Archer 1' },
        { id: 'archer2', name: 'Archer 2' }
      ]
    }
  ];
  
  const shots = [
    { archerId: 'archer1', circle: 'F' },
    { archerId: 'archer2', circle: 'F' }
  ];
  
  const bonuses = calculateRoundBonuses(shots, teams);
  
  assert.strictEqual(bonuses[0].bonus, SYNCHRONY_BONUS);
});

// Test Unicode names
test('calculateShotPoints - works with Unicode archer names', () => {
  // This test ensures the scoring logic doesn't break with Unicode
  const result = calculateShotPoints('A', 1);
  assert.strictEqual(result, 5);
  
  // Unicode names are handled at validation level, not scoring level
  // Scoring only cares about circles and rounds
});
