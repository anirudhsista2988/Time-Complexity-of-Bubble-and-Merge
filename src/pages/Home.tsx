import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AmbientCanvas } from '../components/AmbientCanvas';
import { GlassSculptureCanvas } from '../components/GlassSculptureCanvas';
import { 
  ArrowRight, Beaker, Trophy, 
  GitCompare, Play, Sparkles, ChevronRight
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 font-general relative selection:bg-gold-royal/20 selection:text-[#FFD700]">
      <AmbientCanvas />

      {/* ──── HERO SECTION (FIRST FOLD) ──────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        
        {/* Soft background light blooms */}
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] rounded-full filter blur-[120px] pointer-events-none opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full filter blur-[100px] pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.03) 0%, transparent 70%)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center w-full relative z-10">
          
          {/* LEFT SIDE: Copy & Call-to-Actions */}
          <div className="lg:col-span-6 flex flex-col text-left max-w-xl lg:max-w-none">
            {/* Label badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit mb-6 text-[10px] font-bold uppercase tracking-[0.2em] font-space bg-gold-royal/5 border border-gold-royal/15 text-[#FFD700]/95"
            >
              <Sparkles size={11} className="animate-pulse text-[#FFD700]" />
              The Future of Algorithm Visualization
            </motion.div>

            {/* Massive headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-clash font-black text-5xl sm:text-7xl xl:text-8xl text-white leading-[0.9] tracking-tighter uppercase mb-6"
            >
              MASTER<br />
              <span className="gold-text gold-glow">SORTING</span><br />
              ALGORITHMS
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-10 font-satoshi max-w-lg"
            >
              Visualize, compare, and master sorting algorithms through immersive interactive experiences. Engineered for depth, speed, and precision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8"
            >
              <Link to="/dashboard" 
                className="px-8 py-4 rounded-xl bg-gold-royal/10 border border-gold-royal/30 text-[#FFD700] text-xs font-bold uppercase tracking-[0.15em] font-space flex items-center justify-center gap-2 hover:bg-gold-royal/20 hover:border-[#FFD700]/55 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Exploring <ArrowRight size={13} />
              </Link>
              <Link to="/lab" 
                className="px-8 py-4 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300 hover:text-white hover:bg-white/[0.05] hover:border-white/15 text-xs font-bold uppercase tracking-[0.15em] font-space flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Play size={12} className="fill-current" /> Watch Demo
              </Link>
            </motion.div>

            {/* Trust Copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex items-center gap-2.5 text-[10px] text-gray-500 uppercase tracking-widest font-space font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Trusted by thousands of students and developers worldwide
            </motion.div>
          </div>

          {/* RIGHT SIDE: Visual Masterpiece */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[350px] lg:min-h-[500px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Outer soft reflection mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-10 pointer-events-none" />
              
              <GlassSculptureCanvas />
            </motion.div>
          </div>

        </div>

        {/* Scroll indicator chevron */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40 hover:opacity-80 transition-opacity pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.3em] font-space text-gray-500">Scroll to inspect</span>
          <ChevronRight size={12} className="rotate-90 text-gray-500 animate-bounce" />
        </div>
      </section>

      {/* ──── PRODUCT SHOWCASES (SCROLL-DOWN FOLD) ──────────────────────────────── */}
      <section className="relative z-10 py-32 px-6 md:px-12 max-w-screen-2xl mx-auto space-y-40">
        
        {/* Separator Line */}
        <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-gold-royal/30 to-transparent mx-auto" />

        {/* Showcase 1: Sort Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col text-left justify-center order-2 lg:order-1">
            <div className="w-10 h-10 rounded-xl bg-gold-royal/5 border border-gold-royal/15 flex items-center justify-center mb-6">
              <Beaker size={18} className="text-[#FFD700]" />
            </div>
            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em] font-space mb-2">Module 01</p>
            <h2 className="font-clash font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-tight mb-4">
              VISUAL EXPERIMENTATION.<br />
              ENGINEERED FOR DEPTH.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-satoshi">
              Deploy 10 classic and modern sorting algorithms across multiple visual modes, polar mappings, and 3D coordinate grids. Trace swaps with precision and capture operational steps instantly.
            </p>
            <Link to="/lab" className="text-xs font-bold font-space uppercase tracking-wider text-[#FFD700] hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
              Explore Sort Lab <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-royal/20 to-transparent" />
              {/* Mock visualization mockup */}
              <div className="h-64 rounded-xl bg-black/60 border border-white/[0.04] p-6 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute inset-0 flex items-end gap-1.5 px-6 pb-6 pt-12">
                  {Array.from({ length: 26 }).map((_, idx) => {
                    const h = 20 + Math.sin(idx * 0.3) * 35 + (idx / 26) * 45;
                    const isActive = idx === 12 || idx === 13;
                    return (
                      <div key={idx} className="flex-1 rounded-t-sm transition-all duration-300"
                        style={{ 
                          height: `${h}%`, 
                          background: isActive 
                             ? 'linear-gradient(to top, #FF453A, #FF9500)' 
                            : 'linear-gradient(to top, rgba(255,215,0,0.05), rgba(255,215,0,0.35))',
                          boxShadow: isActive ? '0 0 15px rgba(255,69,58,0.4)' : 'none'
                        }} 
                      />
                    );
                  })}
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Active Sort Stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase 2: Race Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-royal/20 to-transparent" />
              {/* Mock Speedway chart */}
              <div className="h-64 rounded-xl bg-black/60 border border-white/[0.04] p-5 flex flex-col justify-between relative">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-space">
                  <span>TELEMETRY RATIO</span>
                  <span className="text-[#FFD700]">RACE ENGINE ACTIVE</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Quick Sort', color: '#FFD700', w: '92%', speed: '0.24ms' },
                    { name: 'Merge Sort', color: '#0A84FF', w: '78%', speed: '0.42ms' },
                    { name: 'Bubble Sort', color: '#FF453A', w: '24%', speed: '12.8ms' }
                  ].map(algo => (
                    <div key={algo.name} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-space">
                        <span className="text-gray-300 font-bold">{algo.name}</span>
                        <span className="font-mono text-gray-400">{algo.speed}</span>
                      </div>
                      <div className="h-2 bg-white/5 border border-white/[0.04] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: algo.w, background: algo.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col text-left justify-center">
            <div className="w-10 h-10 rounded-xl bg-gold-royal/5 border border-gold-royal/15 flex items-center justify-center mb-6">
              <Trophy size={18} className="text-[#FFD700]" />
            </div>
            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em] font-space mb-2">Module 02</p>
            <h2 className="font-clash font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-tight mb-4">
              SIMULTANEOUS TELEMETRY.<br />
              VIRTUAL SPEEDWAY.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-satoshi">
              Launch F1-style battles pitting sorting configurations against each other. Gather live performance logs, comparison ratios, and victory vectors in real-time.
            </p>
            <Link to="/race" className="text-xs font-bold font-space uppercase tracking-wider text-[#FFD700] hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
              Enter Race Arena <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Showcase 3: Complexity Universe & Learning Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col text-left justify-center order-2 lg:order-1">
            <div className="w-10 h-10 rounded-xl bg-gold-royal/5 border border-gold-royal/15 flex items-center justify-center mb-6">
              <GitCompare size={18} className="text-[#FFD700]" />
            </div>
            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em] font-space mb-2">Module 03</p>
            <h2 className="font-clash font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-tight mb-4">
              FROM COMPLEXITY<br />
              TO INTUITION.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-satoshi">
              Demystify O-notation curves, stability properties, auxiliary space overheads, and design patterns. Build engineering confidence with cheat sheets designed for FAANG technical reviews.
            </p>
            <Link to="/complexity" className="text-xs font-bold font-space uppercase tracking-wider text-[#FFD700] hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
              Open Complexity Universe <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-royal/20 to-transparent" />
              {/* Mock Complexity Info */}
              <div className="h-64 rounded-xl bg-black/60 border border-white/[0.04] p-5 flex flex-col justify-center gap-3 relative">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-clash">Growth Hierarchy</span>
                  <span className="text-[9px] font-mono text-[#FFD700]">THEORY SCAN</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-space">
                  {[
                    { c: 'O(1)', label: 'Optimal Constant' },
                    { c: 'O(log N)', label: 'Logarithmic Divide' },
                    { c: 'O(N)', label: 'Linear Traversal' },
                    { c: 'O(N log N)', label: 'Efficient Sorted limit' },
                  ].map(x => (
                    <div key={x.c} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                      <span className="text-[#FFD700] font-black text-sm block font-mono">{x.c}</span>
                      <span className="text-gray-500 mt-1 block">{x.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase 4: Interview Prep */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-royal/20 to-transparent" />
              {/* Mock Interview Master Info */}
              <div className="h-64 rounded-xl bg-black/60 border border-white/[0.04] p-5 flex flex-col justify-center gap-3 relative">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-2.5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-clash">Interview Readiness</span>
                  <span className="text-[9px] font-mono text-[#FFD700]">FAANG DRILL</span>
                </div>
                <div className="space-y-2.5 font-space text-[10px] text-white/70">
                  <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <span>Q1: Search in Rotated Sorted Array</span>
                    <span className="text-red-400 font-bold uppercase">HARD</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <span>Q2: Merge k Sorted Lists</span>
                    <span className="text-red-400 font-bold uppercase">HARD</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <span>Q3: Kth Largest Element in an Array</span>
                    <span className="text-gold-royal font-bold uppercase">MEDIUM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col text-left justify-center">
            <div className="w-10 h-10 rounded-xl bg-gold-royal/5 border border-gold-royal/15 flex items-center justify-center mb-6">
              <Sparkles size={18} className="text-[#FFD700]" />
            </div>
            <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em] font-space mb-2">Module 04</p>
            <h2 className="font-clash font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-tight mb-4">
              TECHNICAL DRILLS.<br />
              FAANG READY.
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 font-satoshi">
              Hone your skills on sorting and binary search interview questions. Read clear solutions, visualize execution tracks, and drill key patterns expected in technical reviews.
            </p>
            <Link to="/interview" className="text-xs font-bold font-space uppercase tracking-wider text-[#FFD700] hover:text-white transition-colors flex items-center gap-1.5 group w-fit">
              Explore Interview Prep <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ──── MINIMAL FOOTER ──────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-[#020202] py-16 text-center px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg border border-gold-royal/30 flex items-center justify-center bg-black/40">
              <span className="text-xs font-black font-clash text-[#FFD700]">R</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-space text-white font-bold">RRR Telemetry Engine</span>
          </div>
          <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-space">
            &copy; 2026 RRR · FROM CHAOS TO ORDER · INTERNATIONALLY REGISTERED
          </p>
        </div>
      </footer>
    </div>
  );
};
