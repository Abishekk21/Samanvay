import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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
import './components/PageTransitionCurtain.css';

// Map routes to display names
const getPageName = (pathname) => {
  const routeNames = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/create': 'Create Tournament',
    '/setup': 'Setup',
    '/shooting': 'Shooting Desk',
    '/scoreboard': 'Scoreboard',
    '/history': 'History',
    '/results': 'Results',
  };

  // Check for exact match first
  if (routeNames[pathname]) {
    return routeNames[pathname];
  }

  // Check for partial match (for routes with params)
  for (const [route, name] of Object.entries(routeNames)) {
    if (pathname.startsWith(route) && route !== '/') {
      return name;
    }
  }

  return 'Loading';
};

function App() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('idle'); // idle, covering, revealing
  const [transitionText, setTransitionText] = useState('');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Set the text for the destination page
      setTransitionText(getPageName(location.pathname));
      setStage('covering');
    }
  }, [location, displayLocation.pathname]);

  const handleCoverComplete = () => {
    // Update route when screen is fully covered
    setDisplayLocation(location);
    setTimeout(() => {
      setStage('revealing');
    }, 50);
  };

  const handleRevealComplete = () => {
    setStage('idle');
    setTransitionText('');
  };

  const duration = shouldReduceMotion ? 0.2 : 0.55;
  const easing = [0.76, 0, 0.24, 1];

  return (
    <ErrorBoundary>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Page Content */}
        <div key={displayLocation.pathname} className="page-content-wrapper">
          <Layout>
            <Routes location={displayLocation}>
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
        </div>

        {/* Diagonal Curtain Overlay - Covering Stage */}
        {stage === 'covering' && (
          <motion.div
            className="page-transition-curtain"
            initial={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
            animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            transition={{ duration, ease: easing }}
            onAnimationComplete={handleCoverComplete}
          >
            <motion.div
              className="curtain-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {transitionText}
            </motion.div>
          </motion.div>
        )}

        {/* Diagonal Curtain Overlay - Revealing Stage */}
        {stage === 'revealing' && (
          <motion.div
            className="page-transition-curtain"
            initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
            animate={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
            transition={{ duration, ease: easing }}
            onAnimationComplete={handleRevealComplete}
          >
            <motion.div
              className="curtain-text"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {transitionText}
            </motion.div>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
