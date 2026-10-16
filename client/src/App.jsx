import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './features/landing/LandingPage';
import Dashboard from './features/dashboard/Dashboard';
import CreateTournament from './features/tournament/CreateTournament';
import TournamentSetup from './features/tournament/TournamentSetup';
import ShootingDesk from './features/scoring/ShootingDesk';
import Scoreboard from './features/scoreboard/Scoreboard';
import RoundHistory from './features/scoreboard/RoundHistory';
import FinalResults from './features/scoreboard/FinalResults';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateTournament />} />
          <Route path="/setup/:tournamentId" element={<TournamentSetup />} />
          <Route path="/shooting/:tournamentId" element={<ShootingDesk />} />
          <Route path="/scoreboard/:tournamentId" element={<Scoreboard />} />
          <Route path="/history/:tournamentId" element={<RoundHistory />} />
          <Route path="/results/:tournamentId" element={<FinalResults />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
