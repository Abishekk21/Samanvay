import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LandingPage.css';
import landingBg from '../../landing page img.jpg';

function LandingPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section with Background Image */}
      <section className="hero-section">
        {/* Background Image */}
        <div className="hero-background">
          <img 
            src={landingBg}
            alt="Archer aiming at target"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>

        {/* Content */}
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="hero-eyebrow">
                ARCHERY TOURNAMENT CONTROL
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="hero-headline">
                Every Shot<br />
                Counts.
              </motion.h1>
              
              <motion.p variants={itemVariants} className="hero-description">
                Bring every archer, every round, and every point together in one seamless tournament experience. Manage your teams, track live scores, and celebrate every victory with Archeville.
              </motion.p>
              
              <motion.div variants={itemVariants} className="hero-actions">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/create" className="btn-hero-primary">
                    Create Tournament
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/dashboard" className="btn-hero-secondary">
                    Explore Tournaments
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
