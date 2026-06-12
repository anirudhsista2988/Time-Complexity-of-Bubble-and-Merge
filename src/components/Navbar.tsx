import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, BookOpen, GitCompare, Menu, Trophy, X, Zap, Home, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { path: '/',           label: 'Home',                icon: Home },
  { path: '/lab',        label: 'Sort Lab',            icon: Beaker },
  { path: '/race',       label: 'Race Arena',          icon: Trophy },
  { path: '/learn',      label: 'Learning Hub',        icon: BookOpen },
  { path: '/complexity', label: 'Complexity Universe', icon: GitCompare },
  { path: '/interview',  label: 'Interview Prep',      icon: Zap },
  { path: '/about',      label: 'About',               icon: Info },
];

export const Navbar: React.FC = () => {
  const loc = useLocation();
  const { isDark } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = loc.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navBg = scrolled || !isHome
    ? isDark
      ? 'rgba(6,6,6,0.75)'
      : 'rgba(245,244,240,0.88)'
    : 'transparent';

  const navBorder = scrolled || !isHome
    ? isDark
      ? 'rgba(255,215,0,0.07)'
      : 'rgba(184,134,11,0.12)'
    : 'transparent';

  const inactiveText = isDark ? '#636366' : '#6E6E73';
  const activeText   = isDark ? '#FFD700'  : '#9A6F00';
  const activeBg     = isDark ? 'rgba(255,215,0,0.08)' : 'rgba(184,134,11,0.08)';
  const activeBorder = isDark ? 'rgba(255,215,0,0.20)' : 'rgba(184,134,11,0.22)';
  const hoverBg      = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const hoverText    = isDark ? '#ffffff' : '#0F0F0F';

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          height: 56,
          background: navBg,
          backdropFilter: scrolled || !isHome ? 'blur(32px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled || !isHome ? 'blur(32px) saturate(180%)' : 'none',
          borderBottom: `1px solid ${navBorder}`,
          boxShadow: scrolled || !isHome
            ? isDark
              ? '0 1px 0 rgba(255,255,255,0.02), 0 4px 24px rgba(0,0,0,0.4)'
              : '0 1px 0 rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.06)'
            : 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mr-4 shrink-0 group">
            <div className="relative">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${isDark ? 'rgba(255,215,0,0.35)' : 'rgba(184,134,11,0.35)'}`,
                  boxShadow: isDark
                    ? '0 0 0 0 rgba(255,215,0,0)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <span className="text-sm font-black gold-text-static">R</span>
              </div>
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `0 0 20px ${isDark ? 'rgba(255,215,0,0.35)' : 'rgba(184,134,11,0.25)'}` }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-[13px] font-black tracking-wider gold-text-static">RRR</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
            {links.map(({ path, label, icon: Icon }) => {
              const active = loc.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200"
                  style={{
                    color: active ? activeText : inactiveText,
                    background: active ? activeBg : 'transparent',
                    border: `1px solid ${active ? activeBorder : 'transparent'}`,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = hoverText;
                      (e.currentTarget as HTMLElement).style.background = hoverBg;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = inactiveText;
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={12} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Live status pill */}
            <div
              className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{
                color: '#30D158',
                background: 'rgba(48,209,88,0.08)',
                border: '1px solid rgba(48,209,88,0.15)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-1.5 rounded-lg transition-all duration-200"
              style={{
                color: isDark ? '#8E8E93' : '#6E6E73',
                background: mobileOpen
                  ? isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
                  : 'transparent',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-14 left-0 right-0 z-40 p-3 lg:hidden"
            style={{
              background: isDark
                ? 'rgba(6,6,6,0.92)'
                : 'rgba(245,244,240,0.96)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderBottom: `1px solid ${isDark ? 'rgba(255,215,0,0.08)' : 'rgba(184,134,11,0.12)'}`,
              boxShadow: isDark
                ? '0 16px 48px rgba(0,0,0,0.6)'
                : '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <div className="grid grid-cols-2 gap-1.5">
              {links.map(({ path, label, icon: Icon }) => {
                const active = loc.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{
                      color: active ? activeText : isDark ? '#8E8E93' : '#6E6E73',
                      background: active ? activeBg : 'transparent',
                      border: `1px solid ${active ? activeBorder : 'transparent'}`,
                    }}
                  >
                    <Icon size={13} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
