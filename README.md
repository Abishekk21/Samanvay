# Archeville - Super-Archy Tournament Control Console

A complete, production-quality tournament management application for team-based archery competitions. Built with React, Express, and localStorage persistence, featuring a modern UI with glassmorphism effects, animations, and real-time scoring.

## 🎯 Features

### Tournament Management
- **Create and configure tournaments** with multiple teams
- **Register teams** with exactly two archers per team
- **Configure shooting order** with intuitive drag-and-drop controls
- **Support for Unicode names** (accented characters, non-English names)
- **Persistent storage** across browser sessions
- **Dashboard with statistics** showing total, active, and completed tournaments
- **Team management** with cards featuring moving shape animations

### Interactive Scoring
- **Visual target board** with archery target rings (400x400px default, 280x280px on laptop screens)
- **Click-to-score** interface with instant shot recording (no confirmation modal)
- **Real-time score display** with 4-sided point labels on all rings except yellow center
- **Fixed ring scoring:** Yellow center (10), Red (9), Blue (8), Black with white text (7), White (6), Miss (0)
- **Tripod stand visualization** beneath target for enhanced realism
- **Cartoon outdoor background** with animated cloud effects
- **Progress indicators** spanning full width showing round completion percentage
- **Active archer display** with team context in responsive 2x2 grid layout
- **Instruction text** ("Click on the target to record shot") positioned above target board

### Automatic Calculations
- **Fixed point values** per ring - no round-based increment (simplified scoring model)
- **Synchrony bonus detection** - awards 2 points when both team archers hit the same circle
- **Synchrony bonus display** - always visible on all cards, shows +0 if no bonus earned
- **Real-time team and individual score totals** with yellow-highlighted round numbers
- **Automatic tournament completion** detection when any team reaches 60 points
- **SweetAlert popup** notification on tournament completion with 3-second countdown timer
- **Automatic redirect** to results page after popup dismissal

### Live Scoreboard
- **Card-based layout** with centered content (70% width on laptops)
- **Real-time standings** with center-aligned table columns
- **KPI cards** with blue-black gradient backgrounds displaying total teams, rounds completed, and leading team
- **Individual archer scores** displayed prominently in center-aligned table
- **Team bonuses and totals** with color-coded status badges (solid colors for visibility)
- **Visual highlighting** of leading team with golden accents
- **Black table headers** (#000000) with white text for maximum contrast
- **Synchrony bonus** always visible on summary cards (shows +0 if none)

### Round Summary
- **Liquid glass-effect team cards** with backdrop blur and gradient borders
- **Centered card layout** (60% width on laptops for optimal readability)
- **4-sided score display** on target rings showing point values
- **Moving shape animations** (floating circles) for visual dynamism
- **Instant shot recording** without confirmation modal for streamlined workflow
- **Synchrony bonus section** in total area, always displayed regardless of value
- **Dark blue to black gradient headers** with white text throughout

### Results and History
- **Comprehensive final results** page with card wrapper (70% width on laptops)
- **Winner announcement** with golden gradient card and trophy icon
- **Proper header clearance** (6rem desktop, 5rem laptop) to prevent navbar overlap
- **Round-by-round history** with scrollable content area for long tournaments
- **Bullseye icons** (bi-bullseye) for round indicators replacing generic circles
- **Enhanced styling** with liquid glass effects, gradients, shadows, and smooth hover transitions
- **Shot details** displaying archer names, target circles hit, and points earned
- **Synchrony bonus** always displayed in round cards (shows 0 if none awarded)
- **Center-aligned tables** for consistency across all scoreboard pages

## 🎨 UI/UX Enhancements

### Design System
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** (dark blue to black theme)
- **Animated elements** (floating shapes, hover effects, transitions)
- **Responsive layout** optimized for laptop screens (1201-1600px)
- **Card-based architecture** with consistent padding and spacing
- **No scrolling** on primary pages (shooting desk, scoreboard)
- **Scrollable content** where appropriate (history page)

### Landing Page
- **Hero section** with archery-themed background
- **Gradient buttons** with hover animations
- **Left-aligned content** with proper padding (2rem left on desktop, centered on mobile)
- **Call-to-action buttons** for creating/exploring tournaments

### Dashboard
- **Statistics cards** with gradient backgrounds showing tournament counts
- **Tournament cards** with whitish-gold gradient backgrounds (#f8f9fa to #ffd700)
- **Moving shape animations** (floating circles with opacity transitions) on tournament cards
- **Icon + Name layout** - trophy icon and name side-by-side, not stacked
- **Larger, bolder tournament names** (1.5rem font size, 700 weight) for readability
- **Color-coded status badges** with readable text colors (#334155 for metadata)
- **Dense delete buttons** with solid red background (#dc2626) for clear affordance
- **"Existing Tournaments" button** for easy navigation to tournament list

### Shooting Desk
- **40/60 split layout** - info panel on left (40%), target on right (60%)
- **2x2 grid info panel** displaying: Round/Current Shooter (top row), Position/Team Score (bottom row)
- **Large round numbers** (4rem font size) with yellow color (#ffd700) for visibility
- **Team score** styled in yellow matching round style for visual consistency
- **Centered round progress bar** spanning full width at bottom (3rem height, black bold text)
- **Target board** with properly sized rings and 4-sided point labels
- **Instruction text** ("Click on the target to record shot") centered above board
- **Reduced card height** (75vh on laptops) for optimal screen usage
- **Yellow-only center** showing "10" without duplicate side labels

## 🛠 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Bootstrap 5** - Responsive styling and components
- **Bootstrap Icons** - Icon library
- **SweetAlert2** - Beautiful popup notifications
- **Axios** - HTTP client
- **Vitest + React Testing Library** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **ES Modules** - Modern JavaScript syntax
- **Node Test Runner** - Built-in testing

### Persistence
- **LocalStorage** - Browser-based persistence (current implementation)
- Designed for future PostgreSQL migration with repository pattern

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18 or higher - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning) - [Download here](https://git-scm.com/)
- **Modern web browser** with localStorage support (Chrome, Firefox, Safari, or Edge)
- **Terminal/command line** access (PowerShell on Windows, Terminal on macOS/Linux)

### Verify Prerequisites

Check your Node.js and npm versions:

```powershell
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

## 🚀 Installation

### Option 1: Clone from Git Repository

If you have the repository URL:

```powershell
# Clone the repository
git clone <repository-url> archeville-tournament

# Navigate to project directory
cd archeville-tournament
```

### Option 2: Download and Extract

If you have a zip file:

1. Extract the zip file to your desired location (e.g., `d:\samanway` or `~/projects`)
2. Open terminal/PowerShell and navigate to the extracted folder

**On Windows (PowerShell):**
```powershell
cd d:\samanway
```

**On macOS/Linux (Terminal):**
```bash
cd ~/projects/archeville-tournament
```

### Step 1: Install Root Dependencies

```powershell
npm install
```

This installs the root-level dependencies including `concurrently` for running client and server together.

### Step 2: Install All Project Dependencies

```powershell
npm run install:all
```

This command installs dependencies for both client and server in one go.

**What gets installed:**
- **Client:** React, Vite, React Router, Bootstrap, Bootstrap Icons, SweetAlert2, Axios, Vitest
- **Server:** Express, CORS, and development tools

**Alternative (if the above command fails):**

Install manually for each part:

```powershell
# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### Step 3: Create Environment Configuration Files

The project uses environment variables for configuration.

**On Windows (PowerShell):**

```powershell
# Copy root environment file (if exists)
Copy-Item .env.example -Destination .env -ErrorAction SilentlyContinue

# Copy server environment file (if exists)
Copy-Item server\.env.example -Destination server\.env -ErrorAction SilentlyContinue
```

**On macOS/Linux (Terminal):**

```bash
# Copy root environment file (if exists)
cp .env.example .env 2>/dev/null || true

# Copy server environment file (if exists)
cp server/.env.example server/.env 2>/dev/null || true
```

**Default Configuration:**
- Server runs on port **3001**
- Client runs on port **5173**
- Client proxies `/api` requests to server automatically

**Optional:** Edit environment files if you need custom ports:

**server/.env:**
```env
PORT=3001
NODE_ENV=development
```

### Step 4: Verify Installation

Check that dependencies are installed correctly:

```powershell
# List client dependencies
cd client
npm list --depth=0
cd ..

# List server dependencies
cd server
npm list --depth=0
cd ..
```

You should see no errors and a list of installed packages.

## ▶️ Running the Application

### Start Both Client and Server (Recommended)

This is the easiest way to run the full application:

```powershell
npm run dev
```

This command starts both the frontend and backend concurrently. You should see output from both servers.

### Or Start Them Separately

If you prefer more control or need to debug:

**Terminal 1 - Start Backend:**
```powershell
npm run dev:server
```

Wait for "Server running on http://localhost:3001" message.

**Terminal 2 - Start Frontend:**
```powershell
npm run dev:client
```

Wait for "Local: http://localhost:5173" message.

### Access the Application

Once both servers are running, open your browser to:

🌐 **Frontend:** http://localhost:5173

📡 **Backend API:** http://localhost:3001

The frontend will automatically proxy API requests to the backend.

### Stopping the Application

- If using `npm run dev`: Press `Ctrl+C` in the terminal to stop both servers
- If running separately: Press `Ctrl+C` in each terminal window

## 🧪 Running Tests

### Run All Tests

```powershell
npm test
```

This runs both server and client tests.

### Run Server Tests Only

```powershell
npm run test:server
```

Tests the business logic, scoring rules, and API endpoints.

### Run Client Tests Only

```powershell
npm run test:client
```

Tests React components and UI logic.

## 📖 Tournament Setup Instructions

### 1. Create a Tournament

1. From the landing page, click **"New Tournament"**
2. Enter **tournament name** (required)
3. Optionally enter **venue/location**
4. Click **"Create Tournament"**

### 2. Add Teams

1. Each team needs **exactly 2 archers**
2. Fill in:
   - Team name
   - Archer 1 name
   - Archer 2 name
3. Click **"Add"** to register the team
4. Repeat for all teams (minimum **2 teams** required)
5. Use **"Remove"** button if you need to delete a team before starting

### 3. Configure Shooting Order

1. Click **"Generate Default Order"** to create initial order
2. Use **up/down arrows** to reorder archers as needed
3. Ensure all archers appear **exactly once** in the list
4. The order determines the shooting sequence for all rounds

### 4. Start Tournament

1. Click **"Start Tournament"**
2. System validates configuration (checks teams, order, etc.)
3. If valid, you'll be redirected to the **Shooting Desk** for Round 1

### 5. Record Shots

1. **Current archer** is displayed at the top of the screen
2. **Click the target circle** they hit (A, B, C, D, E, or F)
3. Shot is recorded **instantly** (no confirmation modal)
4. System automatically advances to the **next archer**
5. After all archers complete their shot, the round finalizes automatically

### 6. View Progress and Results

1. **Round summary** displays after each round showing points and bonuses
2. Click **"Start Next Round"** to continue or **"View Scoreboard"** to see standings
3. Tournament completes automatically when a team reaches **60 points**
4. **SweetAlert popup** appears with winner announcement (auto-dismisses after 3 seconds)
5. View **final results** and round-by-round history

## 🎯 Scoring Rules

### Point Calculation

**Formula:** Fixed point values per ring (no round-based increment)

| Ring | Color | Points |
|------|-------|--------|
| **A** | Yellow (center) | **10** |
| **B** | Red | **9** |
| **C** | Blue | **8** |
| **D** | Black | **7** |
| **E** | White | **6** |
| **F** | Miss | **0** |

**Examples:**
- Any round, Circle A = 10 points
- Any round, Circle B = 9 points
- Any round, Circle C = 8 points
- Any round, Circle D = 7 points
- Any round, Circle E = 6 points
- Any round, Circle F = 0 points

**Visual Representation:**
- Target displays **4-sided point labels** on rings B, C, D, and E
- Yellow center (A) shows only **"10"** in the center
- Black ring (D) uses **white text** for visibility on dark background

### Synchrony Bonus

- Awarded when **both archers** on a team hit the **same circle** in a round
- Bonus: **+2 points** to team total
- Applies to **any matching circles**, including F + F (both miss)
- Bonus goes to **team total**, not individual archer scores
- Maximum **one bonus per team per round**
- Always displayed on scorecards (shows **+0** if no bonus earned)

### Team Scores

```
Team Total = Archer 1 Score + Archer 2 Score + Synchrony Bonuses
```

### Winning Condition

- **Threshold:** 60 points
- Tournament ends after a complete round where at least one team reaches 60
- **If one team exceeds 60:** That team wins
- **If multiple teams reach 60:** Highest score wins
- **If multiple teams tie at or above 60:** Tournament ends in a tie

## 🏗 Architecture

### Project Structure

```
archeville-tournament/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Shared UI components (Navbar, ErrorBoundary)
│   │   ├── features/    # Feature modules
│   │   │   ├── dashboard/
│   │   │   ├── scoring/      # ShootingDesk, ArcheryTarget, RoundSummary
│   │   │   ├── scoreboard/   # Scoreboard, FinalResults, RoundHistory
│   │   │   ├── setup/        # Tournament creation and configuration
│   │   │   └── landing/
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API services (axios instance, endpoints)
│   │   ├── storage/     # LocalStorage repository
│   │   ├── styles/      # Global CSS styles
│   │   ├── utils/       # Utility functions
│   │   └── tests/       # Test files
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── config/      # Configuration (ports, CORS)
│   │   ├── controllers/ # Route controllers
│   │   ├── domain/      # Pure business logic
│   │   │   ├── scoring/     # Point calculation, synchrony detection
│   │   │   └── tournament/  # Validation, winner determination
│   │   ├── errors/      # Error classes
│   │   ├── middleware/  # Express middleware (error handling, logging)
│   │   ├── routes/      # API route definitions
│   │   └── server.js    # Express app entry point
│   ├── tests/           # Test files
│   └── package.json
└── package.json         # Root package (concurrent scripts)
```

### Domain Layer

The scoring engine (`server/src/domain/`) contains **pure business logic:**
- `scoring/rules.js` - Point calculation and synchrony detection
- `tournament/validation.js` - Configuration validation
- `tournament/calculator.js` - Score calculation and winner determination

**Key principle:** Domain logic has **no dependencies** on Express, localStorage, or React. It's framework-agnostic and easily testable.

### API Endpoints

**Base URL:** `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/rules` | Get tournament rules and constants |
| `POST` | `/tournaments/validate` | Validate tournament configuration |
| `POST` | `/tournaments/:id/rounds/preview` | Preview round calculation |
| `POST` | `/tournaments/:id/rounds/complete` | Complete and finalize a round |
| `POST` | `/tournaments/:id/score/validate` | Validate shot input |

### Persistence

**Current:** Browser localStorage

- **Namespace:** `archeville:tournaments:v1`
- Includes **schema version** for future migrations
- Stores **complete tournament state**
- Survives **browser refresh**
- **Limitation:** Data is browser-specific, not shared across devices

**Repository Pattern:**
- `client/src/storage/localStorage.js` implements storage interface
- Abstracts persistence details from application logic
- Ready for **database replacement** without changing application code

## 🛡 Error Handling

### Frontend
- **React Error Boundary** catches rendering errors gracefully
- **API error interceptor** provides user-friendly messages
- **Loading and error states** for all async operations
- **Retry controls** for network failures

### Backend
- **Centralized error handling middleware**
- **Structured error responses** with codes and messages
- **Request validation** at API boundary
- **Graceful handling** of invalid state transitions

## ⚠️ Known Limitations

### Current Version (localStorage)
- ❌ No multi-user support
- ❌ No server-side persistence
- ❌ No authentication or authorization
- ❌ No concurrent edit protection
- ❌ Data limited to single browser
- ❌ No backup/restore beyond browser storage

### Browser Requirements
- ✅ Requires localStorage support
- ✅ Must allow JavaScript
- ✅ Tested on modern Chrome, Firefox, Safari, Edge

## 🔮 Future Database Migration

### Migration Path

1. **Add PostgreSQL Schema**
   - Tables: `tournaments`, `teams`, `archers`, `rounds`, `shots`, `bonuses`
   - Foreign keys and constraints
   - Indexes on frequently queried fields

2. **Create Server-Side Repository**
   - Implement `PostgresTournamentRepository`
   - Use **transactions** for round finalization
   - Add **concurrency control** (optimistic locking)

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

The domain logic in `server/src/domain/` will work **unchanged**. The React UI will continue to work with API responses. Only the **persistence layer** needs replacement.

## 🎭 Sample Tournament

The application supports the sample tournament from the assignment:

**Teams:**
- **Gyrhuna** - János Diák and Süsü
- **Achni** - Meilong and Tianlong
- **Bathar** - Pakhangba and Poubi Lai Paphal

Create these teams in the setup interface and follow the sample shooting sequence to verify scoring behavior.

## 👨‍💻 Development

### Code Style
- **ES Modules** throughout (import/export)
- **Functional React components** with hooks
- **Pure domain functions** (no side effects)
- **Descriptive variable names** (favor readability)
- **Minimal comments** (code should be self-documenting)

### Testing Strategy
- **Unit tests** for scoring rules (domain logic)
- **Unit tests** for tournament calculations
- **Integration tests** for API endpoints
- **Component tests** for critical UI flows

### Build for Production

```powershell
npm run build
```

Builds optimized client bundle to `client/dist/`. You can then serve this with any static file server or deploy to platforms like Netlify, Vercel, or AWS S3.

## 🐛 Troubleshooting

### Server won't start

**Problem:** Error message about port already in use

**Solution:**
- Check if port 3001 is already in use: `netstat -ano | findstr :3001` (Windows)
- Kill the process or change the port in `server/.env`
- Verify Node.js version is 18+: `node --version`

### Client won't start

**Problem:** Error message about port already in use

**Solution:**
- Check if port 5173 is already in use
- Vite will automatically suggest an alternative port
- Verify all dependencies are installed: `cd client && npm list --depth=0`
- Clear browser cache if stale data appears

### API errors (Network issues)

**Problem:** API calls failing with CORS or connection errors

**Solution:**
- Verify **server is running** on http://localhost:3001
- Check browser console for detailed network errors
- Verify CORS settings if accessing from different origin
- Check `vite.config.js` proxy configuration

### localStorage full

**Problem:** Cannot save tournaments, quota exceeded

**Solution:**
- Clear old tournaments from dashboard using delete buttons
- Browser typically allows 5-10MB per origin
- Check total storage usage in browser DevTools (Application > Storage)
- Consider exporting important data before clearing

### Dependency installation fails

**Problem:** `npm install` errors

**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check internet connection
- Try using `npm ci` for clean install
- Verify npm cache: `npm cache clean --force`

### Tournament won't start

**Problem:** Validation errors when starting tournament

**Solution:**
- Ensure minimum **2 teams** are registered
- Each team must have **exactly 2 archers**
- Shooting order must include **all archers exactly once**
- Click "Generate Default Order" if order is incomplete

## 📞 Support

For issues or questions:

1. **Check this README** for installation and usage instructions
2. **Review error messages** in browser console (F12 > Console tab)
3. **Check server logs** in terminal where you ran `npm run dev`
4. **Verify test results** for regression detection: `npm test`
5. **Check browser localStorage** (F12 > Application > Local Storage)

## 📄 License

MIT

---

**Built with precision for tournament operators. 🏹**

**Enjoy running your archery tournaments with Archeville!**

