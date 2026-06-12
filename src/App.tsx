import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { LuxuryParticleSystem } from './components/LuxuryParticleSystem';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SortLab } from './pages/SortLab';
import { RaceArena } from './pages/RaceArena';
import { About } from './pages/About';
import { LearningCenter } from './pages/LearningCenter';
import { ComplexityUniverse } from './pages/ComplexityUniverse';
import { InterviewMaster } from './pages/InterviewMaster';

const PageWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

function AppRoutes() {
  const loc = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/"           element={<PageWrap><Home /></PageWrap>} />
        <Route path="/dashboard"  element={<PageWrap><Dashboard /></PageWrap>} />
        <Route path="/lab"        element={<PageWrap><SortLab /></PageWrap>} />
        <Route path="/race"       element={<PageWrap><RaceArena /></PageWrap>} />
        <Route path="/about"      element={<PageWrap><About /></PageWrap>} />
        <Route path="/learn"      element={<PageWrap><LearningCenter /></PageWrap>} />
        <Route path="/complexity" element={<PageWrap><ComplexityUniverse /></PageWrap>} />
        <Route path="/interview"  element={<PageWrap><InterviewMaster /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppInner() {
  const { isDark } = useTheme();

  return (
    <BrowserRouter>
      {/* ── Global luxury particle field (behind everything) ── */}
      <LuxuryParticleSystem isDark={isDark} />

      {/* ── Ambient gradient blooms (static, layer above particles) ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(255,215,0,0.035) 0%, transparent 60%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 90% 100%, rgba(255,140,0,0.025) 0%, transparent 60%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,215,0,0.015) 0%, transparent 70%)' }} />
      </div>

      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
