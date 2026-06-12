import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, BookOpen, GitCompare, Menu, Trophy, X, Zap, Home, Info } from 'lucide-react';

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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = loc.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome ? 'glass-ultra border-b border-gold-royal/8' : 'bg-transparent'}`}
        style={{ height: 56 }}
      >
        <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mr-6 shrink-0 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg border border-gold-royal/40 flex items-center justify-center bg-black/60 group-hover:border-gold-royal/70 transition-colors">
                <span className="text-sm font-black gold-text-static">R</span>
              </div>
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{boxShadow:'0 0 20px rgba(255,215,0,0.4)'}} />
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
                <Link key={path} to={path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200
                    ${active
                      ? 'text-[#FFD700] bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.2)]'
                      : 'text-[#636366] hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  <Icon size={12} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Status pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-auto text-[10px] font-semibold text-green-400 bg-green-400/8 border border-green-400/15 px-2.5 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(v => !v)} className="lg:hidden ml-auto text-gray-400 hover:text-white transition-colors p-1">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 glass-ultra border-b border-gold-royal/10 p-4 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {links.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all
                    ${loc.pathname === path ? 'text-[#FFD700] bg-[rgba(255,215,0,0.1)]' : 'text-[#8E8E93] hover:text-white hover:bg-white/5'}`}
                >
                  <Icon size={13} /> {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
