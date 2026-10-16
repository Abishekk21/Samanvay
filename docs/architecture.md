# Archeville Architecture

## System Overview

Archeville is a three-tier tournament scoring application:

1. **React Frontend** - User interface and client-side state
2. **Express Backend** - REST API and business logic
3. **LocalStorage** - Temporary browser-based persistence

## Design Principles

### Separation of Concerns

- **Domain Layer** - Pure business logic, no framework dependencies
- **API Layer** - Request handling, validation, error formatting
- **UI Layer** - Rendering, user interaction, client state
- **Storage Layer** - Persistence abstraction

### Single Source of Truth

- Backend domain engine is authoritative for scoring rules
- Frontend submits actions and renders backend responses
- No duplicate scoring calculations
- No conflicting business logic

### Immutability

- Tournament state updates create new objects
- No mutation of existing rounds after completion
- Deterministic recalculation from history

## Directory Structure

### Server

\`\`\`
server/
├── src/
│   ├── domain/          # Pure business logic
│   │   ├── scoring/     # Point calculations
│   │   └── tournament/  # Tournament management
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── errors/          # Custom error classes
│   └── config/          # Configuration
└── tests/               # Test files
\`\`\`

### Client

\`\`\`
client/
├── src/
│   ├── features/        # Feature modules
│   │   ├── dashboard/   # Tournament list
│   │   ├── tournament/  # Creation & setup
│   │   ├── scoring/     # Shooting desk
│   │   └── scoreboard/  # Results & history
│   ├── components/      # Shared components
│   ├── services/        # API client
│   ├── storage/         # LocalStorage repository
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utilities
└── tests/               # Test files
\`\`\`

## Data Flow

### Tournament Creation

1. User creates tournament in UI
2. Frontend generates tournament object with stable IDs
3. Tournament saved to localStorage
4. User adds teams and configures shooting order
5. Frontend validates with backend API before starting

### Round Scoring

1. User selects target circle for active archer
2. Frontend collects all shots for the round
3. After final shot, frontend submits round to backend
4. Backend calculates points and bonuses
5. Backend determines tournament outcome
6. Frontend receives updated tournament state
7. Frontend saves to localStorage
8. UI updates immediately

### Score Calculation

All calculations happen in `server/src/domain/`:

- `calculateShotPoints()` - Individual shot points
- `calculateRoundBonuses()` - Synchrony detection
- `calculateIndividualTotals()` - Cumulative individual scores
- `calculateTeamTotals()` - Team totals including bonuses
- `determineTournamentOutcome()` - Winner or tie detection

## State Management

### Client State

React component state for:
- Current UI view
- Active form inputs
- Loading/error states
- Confirmation dialogs

### Persistent State

LocalStorage for:
- Tournament configuration
- Team and archer data
- Shooting order
- Completed rounds
- Current round number
- Tournament status

### Server State

Backend is stateless for current version:
- No session storage
- No in-memory tournament cache
- Each request is independent

## API Design

### Request/Response Format

**Success Response:**
\`\`\`json
{
  "success": true,
  "data": { ... }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description",
    "details": { ... }
  }
}
\`\`\`

### Validation Strategy

1. **Client-side validation** - Immediate feedback, UX improvement
2. **API boundary validation** - Middleware checks request structure
3. **Domain validation** - Business rule enforcement
4. **Rejection of invalid state transitions** - Prevents corruption

## Persistence Architecture

### Current: LocalStorage

**Storage Key:** `archeville:tournaments:v1`

**Schema:**
\`\`\`javascript
{
  id: string,
  name: string,
  venue: string | null,
  teams: Array<Team>,
  shootingOrder: Array<string>,
  status: 'setup' | 'active' | 'completed',
  currentRound: number,
  rounds: Array<Round>,
  winner: string | undefined,
  tied: Array<TiedTeam> | undefined,
  createdAt: string,
  updatedAt: string
}
\`\`\`

**Advantages:**
- No backend persistence needed
- Works offline
- Simple deployment
- Instant persistence

**Limitations:**
- Single user only
- No synchronization
- Limited capacity (~5-10MB)
- No backup/recovery
- Browser-specific

### Future: PostgreSQL

**Proposed Schema:**

\`\`\`sql
CREATE TABLE tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  venue TEXT,
  status TEXT NOT NULL,
  current_round INTEGER NOT NULL,
  winner_id TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id),
  name TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE archers (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id),
  name TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE rounds (
  id SERIAL PRIMARY KEY,
  tournament_id TEXT NOT NULL REFERENCES tournaments(id),
  round_number INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE(tournament_id, round_number)
);

CREATE TABLE shots (
  id SERIAL PRIMARY KEY,
  round_id INTEGER NOT NULL REFERENCES rounds(id),
  archer_id TEXT NOT NULL REFERENCES archers(id),
  circle TEXT NOT NULL,
  points INTEGER NOT NULL
);

CREATE TABLE bonuses (
  id SERIAL PRIMARY KEY,
  round_id INTEGER NOT NULL REFERENCES rounds(id),
  team_id TEXT NOT NULL REFERENCES teams(id),
  bonus INTEGER NOT NULL
);
\`\`\`

**Migration Steps:**

1. Create PostgreSQL repository implementing same interface
2. Update backend to use database instead of accepting tournament in requests
3. Add proper transaction handling for round finalization
4. Add authentication and authorization
5. Update frontend to load from API instead of localStorage
6. Implement data migration tool for existing tournaments

**No Domain Logic Changes Required**

The scoring engine in `server/src/domain/` works with plain JavaScript objects. It doesn't care about persistence. The same functions will work with data from PostgreSQL.

## Error Handling

### Frontend

- **ErrorBoundary** - Catches React rendering errors
- **API Interceptor** - Standardizes error responses
- **User Feedback** - Clear error messages and retry options

### Backend

- **Error Middleware** - Centralizes error formatting
- **Custom Error Classes** - Structured error handling
- **Status Codes** - Proper HTTP semantics

### Domain

- **Validation Errors** - Business rule violations throw descriptive errors
- **State Transition Guards** - Prevent invalid operations
- **Input Validation** - All public functions validate inputs

## Testing Strategy

### Unit Tests

- **Scoring Rules** - Every calculation formula
- **Validation** - All business rules
- **Tournament Logic** - State transitions and outcomes
- **Edge Cases** - Ties, F circles, Unicode names

### Integration Tests

- **API Endpoints** - Request/response flow
- **Error Handling** - Proper status codes and messages
- **State Consistency** - No partial updates

### Component Tests

- **Critical Flows** - Tournament creation, shot recording
- **Error States** - Network failures, validation errors
- **Storage** - Persistence and restoration

## Security Considerations

### Current Version

- No authentication (single-user browser app)
- No authorization (all operations allowed)
- No sensitive data (demo/practice tournaments)
- CORS configured for localhost development

### Future Production

- User authentication required
- Role-based access control
- Input sanitization
- CSRF protection
- Rate limiting
- Audit logging

## Performance

### Current

- Client-side rendering with React
- No backend database queries
- LocalStorage operations are synchronous
- UI updates immediately after state changes

### Optimization Opportunities

- Lazy loading of feature modules
- Memoization of expensive calculations
- Virtual scrolling for large archer lists
- Debounced search/filter inputs

### Scalability

Current version:
- Single user per browser
- ~100 teams maximum (localStorage limit)
- No concurrent access

With PostgreSQL:
- Multi-user support
- Unlimited tournaments
- Proper concurrency control
- Horizontal scaling possible

## Future Enhancements

### Database Migration

Replace localStorage with PostgreSQL without changing business logic.

### Real-time Updates

Add WebSocket support for live spectator view.

### Authentication

User accounts with role-based permissions.

### Audit Trail

Complete history of all actions and changes.

### Export/Import

Tournament data export to JSON/CSV.

### Print Support

Printable scorecards and results.

### Mobile App

Native iOS/Android apps with same backend.

## Deployment

### Current (Development)

1. Run backend: `npm run dev:server`
2. Run frontend: `npm run dev:client`
3. Access at http://localhost:5173

### Production Build

1. Build frontend: `cd client && npm run build`
2. Serve static files from `client/dist/`
3. Run backend in production mode
4. Configure reverse proxy (nginx)
5. Use environment variables for configuration

### Environment Variables

**Server:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)

**Client:**
- `VITE_API_URL` - Backend API URL

## Code Quality

### Standards

- ES Modules throughout
- Functional programming for domain logic
- Declarative React components
- Descriptive naming
- Minimal comments (self-documenting code)

### Tools

- Node.js test runner for backend
- Vitest for frontend
- ESLint (optional, not configured)
- Prettier (optional, not configured)

## Documentation

- **README.md** - Setup and usage instructions
- **architecture.md** (this file) - System design
- **scoring-rules.md** - Tournament rules reference
- **Code comments** - Only where necessary

---

**Last Updated:** October 2026
