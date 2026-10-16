import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  
  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  
  // Don't show header on landing page
  if (isHome) {
    return (
      <div className="app-container">
        {children}
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div>
                <h1>
                  <i className="bi bi-bullseye me-2"></i>
                  Archeville
                </h1>
                <p className="subtitle mb-0">Super-Archy Tournament Control Console</p>
              </div>
            </Link>
            {!isDashboard && (
              <Link to="/dashboard" className="btn btn-outline-light">
                <i className="bi bi-trophy me-2"></i>
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;
