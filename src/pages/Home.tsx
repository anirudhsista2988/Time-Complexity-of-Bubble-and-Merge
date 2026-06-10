import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AmbientCanvas } from '../components/AmbientCanvas';
import { SortBarsCanvas } from '../components/SortBarsCanvas';
import { ArrowRight, BarChart2, Beaker, Trophy, TrendingUp, Zap } from 'lucide-react';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';

function useCounter(end: number, duration = 2500, start = 0) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    let current = 0;
    const steps = 80;
    const increment = end / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [end, duration]);
  return val;
}

// 3D Tilt Card
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={`transition-transform duration-100 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}

// Algorithm trading card
const AlgoCard: React.FC<{ id: AlgorithmId; index: number }> = ({ id, index }) => {
  const m = algorithmMeta[id];
  const scores: Record<AlgorithmId, { speed: number; memory: number; efficiency: number }> = {
    bubble:    { speed: 20,  memory: 98, efficiency: 25 },
    selection: { speed: 25,  memory: 98, efficiency: 28 },
    insertion: { speed: 40,  memory: 98, efficiency: 55 },
    merge:     { speed: 80,  memory: 55, efficiency: 82 },
    quick:     { speed: 92,  memory: 75, efficiency: 90 },
    heap:      { speed: 78,  memory: 97, efficiency: 80 },
    counting:  { speed: 95,  memory: 40, efficiency: 88 },
    radix:     { speed: 90,  memory: 45, efficiency: 85 },
    bucket:    { speed: 85,  memory: 50, efficiency: 80 },
    shell:     { speed: 65,  memory: 97, efficiency: 62 },
  };
  const s = scores[id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <TiltCard>
        <div className="relative rounded-2xl overflow-hidden cursor-pointer group"
          style={{
            background: `linear-gradient(135deg, rgba(15,15,15,0.95) 0%, rgba(8,8,8,0.98) 100%)`,
            border: `1px solid ${m.color}25`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03) inset`,
          }}>
          {/* Color accent bar */}
          <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />

          {/* Glow orb on hover */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle, ${m.color}, transparent)` }} />

          <div className="p-5 relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: m.color }}>
                  Algorithm #{index + 1}
                </p>
                <h3 className="text-lg font-black text-white leading-tight">{m.name}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Efficiency</p>
                <p className="text-2xl font-black" style={{ color: m.color }}>{s.efficiency}<span className="text-xs font-normal text-gray-500">/100</span></p>
              </div>
            </div>

            {/* Scores */}
            <div className="space-y-2.5 mb-4">
              {[
                { label: 'Speed', val: s.speed },
                { label: 'Memory', val: s.memory },
                { label: 'Efficiency', val: s.efficiency },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="font-mono font-bold text-gray-300">{val}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.06, ease: [0.23, 1, 0.32, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Complexities */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {[
                { k: 'Avg', v: m.average },
                { k: 'Space', v: m.space },
                { k: 'Best', v: m.best },
                { k: 'Stable', v: m.stable ? 'Yes' : 'No' },
              ].map(({ k, v }) => (
                <div key={k} className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-2 py-1.5">
                  <p className="text-[9px] text-gray-500 uppercase tracking-wider">{k}</p>
                  <p className="text-[11px] font-mono font-bold text-gray-200 mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <Link to="/lab"
              className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg transition-all duration-300"
              style={{
                background: `${m.color}15`,
                border: `1px solid ${m.color}30`,
                color: m.color,
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = `${m.color}25`;
                (e.target as HTMLElement).style.boxShadow = `0 0 20px ${m.color}30`;
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = `${m.color}15`;
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Visualize <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

const features = [
  { icon: Beaker,    title: 'Sort Lab',       desc: '10 algorithms · 6 visual modes · AI-guided explanations', path: '/lab',       color: '#FFD700' },
  { icon: Trophy,   title: 'Race Arena',      desc: 'F1-style battle · Live telemetry · Victory animations',   path: '/race',      color: '#FF453A' },
  { icon: BarChart2, title: 'Analytics',      desc: 'Bloomberg-grade benchmarks · Interactive heatmaps',       path: '/analytics', color: '#0A84FF' },
  { icon: TrendingUp,title: 'Complexity',     desc: 'Interactive O-notation universe · Visual proof',          path: '/complexity',color: '#30D158' },
  { icon: Zap,       title: 'Interview Master',desc: 'FAANG prep · Company-wise · Cheat sheets',              path: '/interview', color: '#BF5AF2' },
];

export const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 80]);

  const algoCount  = useCounter(10);
  const simCount   = useCounter(48291);
  const opsCount   = useCounter(1892043);

  const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

  return (
    <div className="min-h-screen mesh-bg grid-lines relative overflow-x-hidden">
      <AmbientCanvas />

      {/* ──── HERO ──────────────────────────────── */}
      <motion.section style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-14 overflow-hidden">
        {/* Scanning line */}
        <div className="scan-line" />

        {/* Deep glow behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)' }} />
        </div>

        {/* Live sorting canvas behind hero */}
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-25 pointer-events-none">
          <SortBarsCanvas className="w-full" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #030303 100%)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{
              background: 'rgba(255,215,0,0.06)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: 'rgba(255,215,0,0.9)',
              boxShadow: '0 0 30px rgba(255,215,0,0.08)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
            The World's Most Advanced Sorting Platform
          </motion.div>

          {/* RRR Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-black leading-none tracking-[-0.04em] mb-4 select-none gold-text gold-glow"
              style={{ fontSize: 'clamp(80px, 20vw, 200px)' }}>
              RRR
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <h2 className="text-xl md:text-3xl font-light text-white/60 tracking-[0.1em] uppercase mb-3">
              Rapid Recursive Rearrangement
            </h2>
            <div className="energy-line w-64 mx-auto mb-6" />
            <p className="text-base md:text-lg text-white/35 font-light tracking-[0.15em] uppercase mb-14">
              From Chaos to Order
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/dashboard" className="btn-primary px-8 py-3.5 rounded-full text-sm font-bold inline-flex items-center gap-2 relative overflow-hidden">
              Enter Platform <ArrowRight size={16} />
            </Link>
            <Link to="/lab" className="btn-outline px-8 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <Beaker size={15} /> Open Sort Lab
            </Link>
            <Link to="/race" className="btn-outline px-8 py-3.5 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <Trophy size={15} /> Race Arena
            </Link>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { label: 'Algorithms', value: algoCount },
              { label: 'Simulations', value: simCount.toLocaleString() },
              { label: 'Operations', value: opsCount.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-black gold-text-static stat-number">{value}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] mt-1 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ──── ALGORITHM CARDS ──────────────────────── */}
      <section className="relative z-10 py-32 px-4 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/60 mb-4">Algorithm Library</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
            10 Premium<br />
            <span className="gold-text">Algorithms</span>
          </h2>
          <p className="text-white/40 text-lg font-light max-w-xl mx-auto">
            Every algorithm engineered into an interactive experience with real-time complexity insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ALGO_IDS.map((id, i) => <AlgoCard key={id} id={id} index={i} />)}
        </div>
      </section>

      {/* ──── FEATURE SHOWCASE ──────────────────────── */}
      <section className="relative z-10 py-24 px-4 max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFD700]/60 mb-4">Platform Modules</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Built for<br />
            <span className="gold-text">Excellence</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, path, color }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <TiltCard>
                <Link to={path}
                  className="block p-6 rounded-2xl h-full glass-card glass-hover group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 relative z-10 group-hover:text-[#FFD700] transition-colors">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed relative z-10">{desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold relative z-10 transition-colors duration-200"
                    style={{ color: `${color}70` }}>
                    <span className="group-hover:text-[#FFD700] transition-colors">Explore</span>
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──── FOOTER ──────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 text-center">
        <div className="energy-line w-48 mx-auto mb-4" />
        <p className="text-white/20 text-xs uppercase tracking-[0.2em]">RRR · Rapid Recursive Rearrangement · From Chaos to Order</p>
      </footer>
    </div>
  );
};
