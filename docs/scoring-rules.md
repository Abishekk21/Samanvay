# Tournament Scoring Rules

## Official Rules for Archeville Tournament System

### Teams and Archers

1. Each team represents a nation
2. Every team must have **exactly 2 archers**
3. Each archer has a unique identifier
4. Archer names can contain Unicode characters (accented letters, non-English characters)
5. Minimum **2 teams** required to start a tournament
6. Each archer belongs to exactly one team

### Target Circles

Six target circles available: **A, B, C, D, E, F**

### Point Calculation

#### Base Points (Round 1)

| Circle | Points |
|--------|--------|
| A      | 5      |
| B      | 4      |
| C      | 3      |
| D      | 2      |
| E      | 1      |
| F      | 0      |

#### Formula

For circles **A through E:**

\`\`\`
points = basePoints[circle] + roundNumber - 1
\`\`\`

For circle **F:**

\`\`\`
points = 0  (always, regardless of round)
\`\`\`

#### Examples

**Round 1:**
- A = 5 points
- B = 4 points
- C = 3 points
- D = 2 points
- E = 1 point
- F = 0 points

**Round 2:**
- A = 6 points (5 + 2 - 1)
- B = 5 points (4 + 2 - 1)
- C = 4 points (3 + 2 - 1)
- D = 3 points (2 + 2 - 1)
- E = 2 points (1 + 2 - 1)
- F = 0 points (always)

**Round 3:**
- A = 7 points
- B = 6 points
- C = 5 points
- D = 4 points
- E = 3 points
- F = 0 points

**Round 5:**
- A = 9 points
- E = 5 points
- F = 0 points

### Synchrony Bonus

#### When Awarded

A team earns a **synchrony bonus** when both of its archers hit the **same circle** in the same round.

#### Bonus Amount

**+2 points** added to the team's total

#### Important Rules

1. Bonus applies to **any matching circles**, including F + F
2. Bonus is added to the **team total**, not individual archer scores
3. Maximum **one bonus per team per round**
4. Bonus is calculated **after** the round completes
5. Both archers must complete their shots before bonus is awarded

#### Examples

**Synchrony Earned:**
- Archer 1 hits A, Archer 2 hits A → +2 bonus
- Archer 1 hits B, Archer 2 hits B → +2 bonus
- Archer 1 hits F, Archer 2 hits F → +2 bonus

**No Synchrony:**
- Archer 1 hits A, Archer 2 hits B → No bonus
- Archer 1 hits C, Archer 2 hits F → No bonus
- Archer 1 hits D, Archer 2 hits E → No bonus

### Team Score Calculation

\`\`\`
Team Total = Archer 1 Individual Score 
           + Archer 2 Individual Score 
           + Cumulative Synchrony Bonuses
\`\`\`

#### Important Notes

- Individual scores are the sum of that archer's points across all completed rounds
- Synchrony bonuses are cumulative across all rounds
- Bonuses do **not** count toward individual scores
- Team total = sum of both archers + all bonuses

### Round Progression

1. All archers shoot in the configured **shooting order**
2. Each archer shoots **once per round**
3. After all archers complete, the round is **finalized**
4. System calculates:
   - Individual points for each shot
   - Synchrony bonuses for each team
   - Updated cumulative scores
   - Tournament status (active or completed)
5. If no team has reached 60 points, proceed to next round
6. If at least one team has 60+ points, tournament ends

### Winning Condition

#### Threshold

**60 points** is the winning threshold

#### Rules

1. Tournament continues until at least one team reaches **60 points**
2. Tournament ends **after completing the full round** where threshold is reached
3. No more rounds after a team reaches 60

#### Winner Determination

**Single Winner:**
- If one team has 60+ points and the highest score: that team wins

**Multiple Teams Reach Threshold:**
- If multiple teams have 60+ points: the team with the **highest score** wins

**Tie:**
- If multiple teams reach 60+ with **equal scores**: tournament ends in a **tie**
- All tied teams are identified as co-winners

#### Examples

**Example 1: Single Winner**
- Team A: 62 points
- Team B: 58 points
- **Winner: Team A**

**Example 2: Highest Score Wins**
- Team A: 65 points
- Team B: 61 points
- Team C: 58 points
- **Winner: Team A** (highest score above threshold)

**Example 3: Tie**
- Team A: 60 points
- Team B: 60 points
- Team C: 58 points
- **Result: Tie between Team A and Team B**

### Important Restrictions

#### No Changes After Start

Once a tournament starts:
- Cannot add or remove teams
- Cannot modify shooting order
- Cannot change archer assignments

#### No Scoring After Completion

Once a tournament is completed:
- Cannot record additional shots
- Cannot start new rounds
- Tournament is read-only

#### Round Finalization

Once a round is finalized:
- Cannot modify shot results (in basic version)
- Scores are locked for that round
- Bonuses are locked for that round

### Shot Recording

1. Operator records each archer's result in order
2. System validates circle input (A-F only)
3. System calculates points immediately
4. Operator confirms the shot
5. System advances to next archer automatically
6. After final archer, system finalizes the round

### Data Integrity

#### Validation Rules

- Every archer must shoot exactly once per round
- No duplicate shots per round
- No unknown archers in results
- No invalid circles (only A-F accepted)
- Round number must be positive integer
- Cannot skip rounds

#### State Consistency

- Tournament status must be valid (setup, active, completed)
- Current round must match history
- All referenced IDs must exist
- Scores must be recalculable from history

### Sample Tournament

**Teams:**
1. Gyrhuna - János Diák and Süsü
2. Achni - Meilong and Tianlong
3. Bathar - Pakhangba and Poubi Lai Paphal

This sample demonstrates:
- Multiple teams
- Unicode names (János with accent)
- Synchrony bonuses
- Cumulative scoring
- Winner determination

See implementation for complete sample data.

---

**These rules are implemented in:** `server/src/domain/scoring/rules.js`

**Last Updated:** October 2026
