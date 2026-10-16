/**
 * Tournament logic tests
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateIndividualTotals,
  calculateTeamBonuses,
  calculateTeamTotals,
  calculateStandings,
  calculateRoundResult,
  determineTournamentOutcome,
  recalculateTournamentFromHistory
} from '../src/domain/tournament/calculator.js';
import { WINNING_THRESHOLD } from '../src/domain/scoring/rules.js';

// Helper to create a basic tournament
function createBasicTournament() {
  return {
    id: 'tournament1',
    name: 'Test Tournament',
    teams: [
      {
        id: 'team1',
        name: 'Gyrhuna',
        archers: [
          { id: 'archer1', name: 'János Diák' },
          { id: 'archer2', name: 'Süsü' }
        ]
      },
      {
        id: 'team2',
        name: 'Achni',
        archers: [
          { id: 'archer3', name: 'Meilong' },
          { id: 'archer4', name: 'Tianlong' }
        ]
      }
    ],
    shootingOrder: ['archer1', 'archer2', 'archer3', 'archer4'],
    status: 'active',
    rounds: []
  };
}

test('calculateRoundResult - calculates points correctly for round 1', () => {
  const tournament = createBasicTournament();
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer2', circle: 'B' },
    { archerId: 'archer3', circle: 'C' },
    { archerId: 'archer4', circle: 'D' }
  ];
  
  const result = calculateRoundResult(tournament, 1, shots);
  
  assert.strictEqual(result.roundNumber, 1);
  assert.strictEqual(result.status, 'completed');
  assert.strictEqual(result.shots.length, 4);
  assert.strictEqual(result.shots[0].points, 5); // A in round 1
  assert.strictEqual(result.shots[1].points, 4); // B in round 1
  assert.strictEqual(result.shots[2].points, 3); // C in round 1
  assert.strictEqual(result.shots[3].points, 2); // D in round 1
});

test('calculateRoundResult - detects synchrony bonus', () => {
  const tournament = createBasicTournament();
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer2', circle: 'A' }, // Synchrony!
    { archerId: 'archer3', circle: 'B' },
    { archerId: 'archer4', circle: 'C' }
  ];
  
  const result = calculateRoundResult(tournament, 1, shots);
  
  assert.strictEqual(result.bonuses.length, 2);
  assert.strictEqual(result.bonuses[0].teamId, 'team1');
  assert.strictEqual(result.bonuses[0].bonus, 2);
  assert.strictEqual(result.bonuses[1].teamId, 'team2');
  assert.strictEqual(result.bonuses[1].bonus, 0);
});

test('calculateRoundResult - throws on missing shots', () => {
  const tournament = createBasicTournament();
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer2', circle: 'B' }
    // Missing archer3 and archer4
  ];
  
  assert.throws(() => calculateRoundResult(tournament, 1, shots), /Missing shots/);
});

test('calculateRoundResult - throws on duplicate shots', () => {
  const tournament = createBasicTournament();
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer1', circle: 'B' }, // Duplicate!
    { archerId: 'archer3', circle: 'C' },
    { archerId: 'archer4', circle: 'D' }
  ];
  
  assert.throws(() => calculateRoundResult(tournament, 1, shots), /Duplicate shot/);
});

test('calculateRoundResult - throws on unknown archer', () => {
  const tournament = createBasicTournament();
  
  const shots = [
    { archerId: 'archer1', circle: 'A' },
    { archerId: 'archer2', circle: 'B' },
    { archerId: 'archer3', circle: 'C' },
    { archerId: 'unknown', circle: 'D' } // Unknown!
  ];
  
  assert.throws(() => calculateRoundResult(tournament, 1, shots), /Unknown archer/);
});

test('calculateIndividualTotals - sums correctly across rounds', () => {
  const tournament = createBasicTournament();
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 5 },
        { archerId: 'archer2', circle: 'B', points: 4 },
        { archerId: 'archer3', circle: 'C', points: 3 },
        { archerId: 'archer4', circle: 'D', points: 2 }
      ]
    },
    {
      roundNumber: 2,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 6 },
        { archerId: 'archer2', circle: 'B', points: 5 },
        { archerId: 'archer3', circle: 'C', points: 4 },
        { archerId: 'archer4', circle: 'D', points: 3 }
      ]
    }
  ];
  
  const totals = calculateIndividualTotals(tournament);
  
  assert.strictEqual(totals.get('archer1'), 11);
  assert.strictEqual(totals.get('archer2'), 9);
  assert.strictEqual(totals.get('archer3'), 7);
  assert.strictEqual(totals.get('archer4'), 5);
});

test('calculateTeamBonuses - sums correctly across rounds', () => {
  const tournament = createBasicTournament();
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      bonuses: [
        { teamId: 'team1', bonus: 2 },
        { teamId: 'team2', bonus: 0 }
      ]
    },
    {
      roundNumber: 2,
      status: 'completed',
      bonuses: [
        { teamId: 'team1', bonus: 0 },
        { teamId: 'team2', bonus: 2 }
      ]
    }
  ];
  
  const bonuses = calculateTeamBonuses(tournament);
  
  assert.strictEqual(bonuses.get('team1'), 2);
  assert.strictEqual(bonuses.get('team2'), 2);
});

test('calculateStandings - calculates team totals correctly', () => {
  const tournament = createBasicTournament();
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 5 },
        { archerId: 'archer2', circle: 'A', points: 5 },
        { archerId: 'archer3', circle: 'B', points: 4 },
        { archerId: 'archer4', circle: 'C', points: 3 }
      ],
      bonuses: [
        { teamId: 'team1', bonus: 2 },
        { teamId: 'team2', bonus: 0 }
      ]
    }
  ];
  
  const standings = calculateStandings(tournament);
  
  assert.strictEqual(standings.length, 2);
  assert.strictEqual(standings[0].teamId, 'team1');
  assert.strictEqual(standings[0].teamTotal, 12); // 5 + 5 + 2
  assert.strictEqual(standings[1].teamId, 'team2');
  assert.strictEqual(standings[1].teamTotal, 7); // 4 + 3
});

test('determineTournamentOutcome - active when no team reaches threshold', () => {
  const tournament = createBasicTournament();
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 5 },
        { archerId: 'archer2', circle: 'A', points: 5 },
        { archerId: 'archer3', circle: 'B', points: 4 },
        { archerId: 'archer4', circle: 'C', points: 3 }
      ],
      bonuses: [
        { teamId: 'team1', bonus: 2 },
        { teamId: 'team2', bonus: 0 }
      ]
    }
  ];
  
  const outcome = determineTournamentOutcome(tournament);
  
  assert.strictEqual(outcome.status, 'active');
  assert.strictEqual(outcome.winner, undefined);
});

test('determineTournamentOutcome - completed at exactly 60 points', () => {
  const tournament = createBasicTournament();
  
  // Create scenario where team1 has exactly 60
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 30 },
        { archerId: 'archer2', circle: 'A', points: 30 },
        { archerId: 'archer3', circle: 'B', points: 10 },
        { archerId: 'archer4', circle: 'C', points: 10 }
      ],
      bonuses: [
        { teamId: 'team1', bonus: 0 },
        { teamId: 'team2', bonus: 0 }
      ]
    }
  ];
  
  const outcome = determineTournamentOutcome(tournament);
  
  assert.strictEqual(outcome.status, 'completed');
  assert.strictEqual(outcome.winner, 'team1');
});

test('determineTournamentOutcome - highest score wins when multiple cross threshold', () => {
  const tournament = createBasicTournament();
  
  // Both teams cross 60, but team1 has higher score
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 35 },
        { archerId: 'archer2', circle: 'A', points: 35 },
        { archerId: 'archer3', circle: 'B', points: 31 },
        { archerId: 'archer4', circle: 'C', points: 31 }
      ],
      bonuses: [
        { teamId: 'team1', bonus: 0 },
        { teamId: 'team2', bonus: 0 }
      ]
    }
  ];
  
  const outcome = determineTournamentOutcome(tournament);
  
  assert.strictEqual(outcome.status, 'completed');
  assert.strictEqual(outcome.winner, 'team1');
  assert.strictEqual(outcome.finalScore, 70);
});

test('determineTournamentOutcome - tie when equal scores above threshold', () => {
  const tournament = createBasicTournament();
  
  // Both teams have exactly 60
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A', points: 30 },
        { archerId: 'archer2', circle: 'A', points: 30 },
        { archerId: 'archer3', circle: 'B', points: 30 },
        { archerId: 'archer4', circle: 'C', points: 30 }
      ],
      bonuses: [
        { teamId: 'team1', bonus: 0 },
        { teamId: 'team2', bonus: 0 }
      ]
    }
  ];
  
  const outcome = determineTournamentOutcome(tournament);
  
  assert.strictEqual(outcome.status, 'completed');
  assert.strictEqual(outcome.winner, undefined);
  assert.ok(Array.isArray(outcome.tied));
  assert.strictEqual(outcome.tied.length, 2);
  assert.strictEqual(outcome.tied[0].finalScore, 60);
  assert.strictEqual(outcome.tied[1].finalScore, 60);
});

test('recalculateTournamentFromHistory - recalculates all scores', () => {
  const tournament = createBasicTournament();
  tournament.rounds = [
    {
      roundNumber: 1,
      status: 'completed',
      shots: [
        { archerId: 'archer1', circle: 'A' },
        { archerId: 'archer2', circle: 'A' },
        { archerId: 'archer3', circle: 'B' },
        { archerId: 'archer4', circle: 'C' }
      ]
    }
  ];
  
  const recalculated = recalculateTournamentFromHistory(tournament);
  
  assert.strictEqual(recalculated.rounds[0].shots[0].points, 5);
  assert.strictEqual(recalculated.rounds[0].shots[1].points, 5);
  assert.strictEqual(recalculated.rounds[0].bonuses[0].bonus, 2);
  assert.strictEqual(recalculated.status, 'active');
});
