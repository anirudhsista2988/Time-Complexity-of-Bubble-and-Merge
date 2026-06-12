import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../context/ThemeContext';

const OPTIONS: { mode: ThemeMode; icon: React.ReactNode; label: string; sub: string }[] = [
  {
    mode: 'dark',
    icon: <Moon size={13} />,
    label: 'Dark',
    sub: 'Obsidian black',
  },
  {
    mode: 'light',
    icon: <Sun size={13} />,
    label: 'Light',
    sub: 'Warm ivory',
  },
  {
    mode: 'system',
    icon: <Monitor size={13} />,
    label: 'System',
    sub: 'Match OS',
  },
];

export const ThemeToggle: React.FC = () => {
  const { mode, isDark, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = OPTIONS.find(o => o.mode === mode) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative shrink-0">
      {/* ── Pill Toggle Button ── */}
      <button
        id="theme-toggle"
        onClick={() => setOpen(v => !v)}
        aria-label="Toggle theme"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-300 group"
        style={{
          background: isDark
            ? 'rgba(255,215,0,0.05)'
            : 'rgba(184,134,11,0.07)',
          borderColor: isDark
            ? 'rgba(255,215,0,0.18)'
            : 'rgba(184,134,11,0.25)',
          boxShadow: open
            ? isDark
              ? '0 0 20px rgba(255,215,0,0.15)'
              : '0 0 16px rgba(184,134,11,0.15)'
            : 'none',
        }}
      >
        {/* Icon track — slides between sun/moon/monitor */}
        <motion.div
          key={mode}
          initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ color: isDark ? '#FFD700' : '#B8860B' }}
        >
          {current.icon}
        </motion.div>

        <span
          className="text-[10px] font-black tracking-widest uppercase font-space hidden sm:block"
          style={{ color: isDark ? '#FFD700' : '#9A6F00' }}
        >
          {current.label}
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: isDark ? 'rgba(255,215,0,0.5)' : 'rgba(184,134,11,0.6)' }}
        >
          <ChevronDown size={10} />
        </motion.div>
      </button>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden z-[200]"
            style={{
              background: isDark
                ? 'rgba(10,10,10,0.92)'
                : 'rgba(252,251,248,0.96)',
              border: `1px solid ${isDark ? 'rgba(255,215,0,0.12)' : 'rgba(184,134,11,0.18)'}`,
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              boxShadow: isDark
                ? '0 16px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02) inset'
                : '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset',
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-2.5 border-b"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
            >
              <p
                className="text-[9px] font-black uppercase tracking-[0.2em] font-space"
                style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }}
              >
                Appearance
              </p>
            </div>

            {/* Options */}
            <div className="p-1.5 space-y-0.5">
              {OPTIONS.map(opt => {
                const isActive = mode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    onClick={() => { setMode(opt.mode); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group"
                    style={{
                      background: isActive
                        ? isDark ? 'rgba(255,215,0,0.08)' : 'rgba(184,134,11,0.08)'
                        : 'transparent',
                      border: `1px solid ${isActive
                        ? isDark ? 'rgba(255,215,0,0.2)' : 'rgba(184,134,11,0.22)'
                        : 'transparent'}`,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{
                        background: isActive
                          ? isDark ? 'rgba(255,215,0,0.12)' : 'rgba(184,134,11,0.12)'
                          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        color: isActive
                          ? isDark ? '#FFD700' : '#9A6F00'
                          : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
                        border: `1px solid ${isActive
                          ? isDark ? 'rgba(255,215,0,0.2)' : 'rgba(184,134,11,0.2)'
                          : 'transparent'}`,
                      }}
                    >
                      {opt.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold font-satoshi"
                        style={{
                          color: isActive
                            ? isDark ? '#FFD700' : '#9A6F00'
                            : isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        }}
                      >
                        {opt.label}
                      </p>
                      <p
                        className="text-[9px] font-space font-medium mt-0.5"
                        style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }}
                      >
                        {opt.sub}
                      </p>
                    </div>

                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: isDark ? '#FFD700' : '#9A6F00' }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <div
              className="px-4 py-2.5 border-t"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}
            >
              <p
                className="text-[8px] font-space font-medium leading-tight"
                style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.28)' }}
              >
                Preference saved across sessions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
