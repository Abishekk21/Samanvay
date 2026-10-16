# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```powershell
npm run install:all
```

This installs everything needed for both client and server.

### 2. Start the Application
```powershell
npm run dev
```

This starts both the React frontend and Express backend.

### 3. Open Your Browser
Navigate to: **http://localhost:5173**

## Create Your First Tournament

1. Click **"New Tournament"**
2. Enter tournament name (e.g., "Spring Championship 2026")
3. Click **"Create Tournament"**

## Add Teams

1. Fill in team name (e.g., "Gyrhuna")
2. Add archer 1 name (e.g., "János Diák")
3. Add archer 2 name (e.g., "Süsü")
4. Click **"Add"**
5. Repeat for at least 2 teams

## Configure Shooting Order

1. Click **"Generate Default Order"**
2. Use arrow buttons to reorder if needed
3. Ensure all archers appear exactly once

## Start Tournament

1. Click **"Start Tournament"**
2. System validates your configuration
3. Shooting desk opens for Round 1

## Record Shots

1. Current archer is displayed at top
2. Click the target circle they hit (A-F)
3. Confirm the shot
4. System advances to next archer automatically
5. After all archers finish, round completes

## View Results

- **Scoreboard** shows current standings
- **Round History** shows past rounds
- **Final Results** appear when tournament completes

## That's It!

You're now running a professional tournament scoring system.

## Need Help?

- See **README.md** for detailed documentation
- See **docs/scoring-rules.md** for tournament rules
- See **docs/architecture.md** for technical details

## Run Tests

```powershell
npm test
```

All 35 tests should pass ✅

---

**Enjoy scoring your tournaments!** 🏹
