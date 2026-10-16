# Archeville - Super-Archy Tournament Control Console

A complete, production-quality tournament scoring application for team-based archery competitions. Built with React, Express, and localStorage persistence.

## Features

### Tournament Management
- Create and configure tournaments with multiple teams
- Register teams with exactly two archers per team
- Configure shooting order with intuitive controls
- Support for Unicode names (accented characters, non-English names)
- Persistent storage across browser sessions

### Interactive Scoring
- Guided shooting desk workflow
- Visual target circle selection with real-time point calculation
- Shot confirmation to prevent errors
- Progress indicators showing completion status
- Active archer display with team context

### Automatic Calculations
- Dynamic point calculation based on circle and round (A-E increase by 1 each round, F always 0)
- Synchrony bonus detection (2 points when both team archers hit the same circle)
- Real-time team and individual score totals
- Automatic winner detection at 60 points
- Tie handling when multiple teams reach threshold with equal scores

### Live Scoreboard
- Real-time standings with ranks
- Individual archer scores
- Team bonuses and totals
- Points remaining to win
- Visual highlighting of leading team

### Results and History
- Round-by-round breakdown
- Complete shot history with circles and points
- Synchrony bonus tracking
- Final results with winner announcement
- Tournament completion handling

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Bootstrap 5** - Responsive styling and components
- **Bootstrap Icons** - Icon library
- **Axios** - HTTP client
- **Vitest + React Testing Library** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **ES Modules** - Modern JavaScript syntax
- **Node Test Runner** - Built-in testing

### Persistence
- **LocalStorage** - Browser-based persistence (temporary solution)
- Designed for future PostgreSQL migration

## Prerequisites

- Node.js 18+ and npm
- Modern web browser with localStorage support
- Terminal/command line access

## Installation

### 1. Clone or download the project

\`\`\`powershell
cd d:\samanway
\`\`\`

### 2. Install root dependencies

\`\`\`powershell
npm install
\`\`\`

### 3. Install all project dependencies

\`\`\`powershell
npm run install:all
\`\`\`

This installs dependencies for both client and server.

### 4. Create environment files

Copy the example environment files:

\`\`\`powershell
Copy-Item .env.example -Destination .env
Copy-Item server/.env.example -Destination server/.env
\`\`\`

Default configuration:
- Server runs on port 3001
- Client runs on port 5173
- Client proxies API requests to server

## Running the Application

### Start both client and server (recommended)

\`\`\`powershell
npm run dev
\`\`\`

This runs both the frontend and backend concurrently.

### Or start them separately

**Terminal 1 - Backend:**
\`\`\`powershell
npm run dev:server
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`powershell
npm run dev:client
\`\`\`

### Access the application

Open your browser to: **http://localhost:5173**

The backend API runs at: **http://localhost:3001**

## Running Tests

### Run all tests

\`\`\`powershell
npm test
\`\`\`

### Run server tests only

\`\`\`powershell
npm run test:server
\`\`\`

### Run client tests only

\`\`\`powershell
npm run test:client
\`\`\`

## Tournament Setup Instructions

### 1. Create a Tournament

1. Click "New Tournament" from the dashboard
2. Enter tournament name (required)
3. Optionally enter venue/location
4. Click "Create Tournament"

### 2. Add Teams

1. Each team needs exactly 2 archers
2. Fill in team name, archer 1 name, and archer 2 name
3. Click "Add" to register the team
4. Repeat for all teams (minimum 2 teams required)
5. Remove teams if needed before starting

### 3. Configure Shooting Order

1. Click "Generate Default Order" to create initial order
2. Use up/down arrows to reorder archers
3. Ensure all archers appear exactly once

### 4. Start Tournament

1. Click "Start Tournament"
2. System validates configuration
3. If valid, shooting desk opens for Round 1

### 5. Record Shots

1. Current archer is displayed at top
2. Select the target circle they hit (A-F)
3. Confirm the shot
4. System automatically advances to next archer
5. After all archers complete, round finalizes

### 6. View Results

1. Round summary shows points and bonuses
2. Start next round or view scoreboard
3. Tournament completes when a team reaches 60 points
4. View final results and winner

## Scoring Rules

### Point Calculation

**Formula:** `points = basePoints[circle] + roundNumber - 1`

**Base points (Round 1):**
- A: 5 points
- B: 4 points
- C: 3 points
- D: 2 points
- E: 1 point
- F: 0 points (always 0, regardless of round)

**Examples:**
- Round 1, Circle A = 5 points
- Round 2, Circle A = 6 points
- Round 3, Circle C = 5 points
- Round 5, Circle E = 5 points
- Any round, Circle F = 0 points

### Synchrony Bonus

- Awarded when both archers on a team hit the **same circle** in a round
- Bonus: **+2 points** to team total
- Applies to any matching circles, including F + F
- Bonus goes to team total, not individual scores
- Maximum one bonus per team per round

### Team Scores

`Team Total = Archer 1 Score + Archer 2 Score + Synchrony Bonuses`

### Winning Condition

- **Threshold:** 60 points
- Tournament ends after a complete round where at least one team reaches 60
- If one team exceeds 60: that team wins
- If multiple teams reach 60: highest score wins
- If multiple teams tie at or above 60: tournament ends in a tie

## Architecture

### Project Structure

\`\`\`
archeville-tournament/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Shared components
│   │   ├── features/    # Feature modules
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API services
│   │   ├── storage/     # LocalStorage repository
│   │   ├── styles/      # CSS styles
│   │   ├── utils/       # Utilities
│   │   └── tests/       # Test files
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── domain/      # Business logic
│   │   ├── errors/      # Error classes
│   │   ├── middleware/  # Express middleware
│   │   └── routes/      # API routes
│   └── tests/           # Test files
└── package.json         # Root package
\`\`\`

### Domain Layer

The scoring engine (`server/src/domain/`) contains pure business logic:
- `scoring/rules.js` - Point calculation and synchrony detection
- `tournament/validation.js` - Configuration validation
- `tournament/calculator.js` - Score calculation and winner determination

**Key principle:** Domain logic has no dependencies on Express, localStorage, or React.

### API Endpoints

**Base URL:** `/api/v1`

- `GET /health` - Health check
- `GET /rules` - Get tournament rules and constants
- `POST /tournaments/validate` - Validate tournament configuration
- `POST /tournaments/:id/rounds/preview` - Preview round calculation
- `POST /tournaments/:id/rounds/complete` - Complete and finalize a round
- `POST /tournaments/:id/score/validate` - Validate shot input

### Persistence

**Current:** Browser localStorage
- Namespace: `archeville:tournaments:v1`
- Includes schema version for future migrations
- Stores complete tournament state
- Survives browser refresh

**Repository Pattern:**
- `client/src/storage/localStorage.js` implements storage interface
- Abstracts persistence details from application logic
- Ready for database replacement

## Error Handling

### Frontend
- React Error Boundary catches rendering errors
- API error interceptor provides user-friendly messages
- Loading and error states for all async operations
- Retry controls for network failures

### Backend
- Centralized error handling middleware
- Structured error responses with codes
- Request validation at API boundary
- Graceful handling of invalid state transitions

## Known Limitations

### Current Version (localStorage)
- No multi-user support
- No server-side persistence
- No authentication or authorization
- No concurrent edit protection
- Data limited to single browser
- No backup/restore beyond browser storage

### Browser Requirements
- Requires localStorage support
- Must allow JavaScript
- Tested on modern Chrome, Firefox, Safari, Edge

## Future Database Migration

### Migration Path

1. **Add PostgreSQL Schema**
   - Tables: tournaments, teams, archers, rounds, shots, bonuses
   - Foreign keys and constraints
   - Indexes on frequently queried fields

2. **Create Server-Side Repository**
   - Implement `PostgresTournamentRepository`
   - Use transactions for round finalization
   - Add concurrency control (optimistic locking)

3. **Update API**
   - Move persistence from client to server
   - Add tournament CRUD endpoints
   - Implement proper session management

4. **Add Authentication**
   - User accounts and roles
   - Operator permissions
   - Read-only spectator access

5. **Data Migration**
   - Optional: import tool for localStorage tournaments
   - Validate schema compatibility

### No Code Rewrite Needed

The domain logic in `server/src/domain/` will work unchanged. The React UI will continue to work with API responses. Only the persistence layer needs replacement.

## Sample Tournament

The application supports the sample tournament from the assignment:

**Teams:**
- Gyrhuna - János Diák and Süsü
- Achni - Meilong and Tianlong
- Bathar - Pakhangba and Poubi Lai Paphal

Create these teams in the setup interface and follow the sample shooting sequence to verify scoring behavior.

## Development

### Code Style
- ES Modules throughout
- Functional React components with hooks
- Pure domain functions
- Descriptive variable names
- Minimal comments (code should be self-documenting)

### Testing Strategy
- Unit tests for scoring rules
- Unit tests for tournament calculations
- Integration tests for API endpoints
- Component tests for critical UI flows

### Build for Production

\`\`\`powershell
npm run build
\`\`\`

Builds optimized client bundle to `client/dist/`.

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify Node.js version (18+)
- Check server/.env configuration

### Client won't start
- Check if port 5173 is already in use
- Verify all dependencies are installed
- Clear browser cache if stale data appears

### API errors
- Verify server is running
- Check browser console for network errors
- Verify CORS settings if accessing from different origin

### localStorage full
- Clear old tournaments from dashboard
- Browser typically allows 5-10MB per origin
- Consider exporting data before clearing

## Support

For issues or questions:
1. Check this README
2. Review error messages in browser console
3. Check server logs
4. Verify test results for regression detection

## License

MIT

---

**Built with precision for tournament operators.**
