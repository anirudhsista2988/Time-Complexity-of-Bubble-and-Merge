import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, Trophy, BookOpen, GitCompare, Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / 10;
    const rotateY = (x - centerX) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) translateZ(8px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
  };

  const pillars = [
    {
      icon: Beaker,
      label: 'Sort Lab',
      desc: 'Deploy and control 10 classic and modern sorting algorithms across multiple visual modes, polar mappings, and coordinate grids. Trace swaps with precision.',
      path: '/lab',
      color: '#FFD700',
    },
    {
      icon: Trophy,
      label: 'Race Arena',
      desc: 'Pits sorting configurations against each other in F1-style simultaneous battles. Gather live telemetry logs, victory margins, and complexity matrices.',
      path: '/race',
      color: '#FF453A',
    },
    {
      icon: GitCompare,
      label: 'Complexity Universe',
      desc: 'Demystify theoretical curves, growth hierarchies, stability matrices, and auxiliary space properties with an interactive Big O-notation chart.',
      path: '/complexity',
      color: '#5AC8FA',
    },
    {
      icon: BookOpen,
      label: 'Learning Hub',
      desc: 'Syllabus containing detailed theory breakdowns, step-by-step working protocols, common interview pitfalls, and code pseudocode for all algorithms.',
      path: '/learn',
      color: '#30D158',
    },
    {
      icon: Zap,
      label: 'Interview Prep',
      desc: 'Hone coding interview performance and build technical engineering confidence with curated FAANG questions and technical drills.',
      path: '/interview',
      color: '#FF9F0A',
    },
  ];

  return (
    <div className="min-h-screen pt-20 p-6 bg-[#020202] mesh-bg font-general relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full filter blur-[100px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full filter blur-[100px] pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(255,140,0,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">
        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <p className="text-[10px] text-gold-royal font-bold uppercase tracking-[0.25em] font-space">The Mission of SortSphere</p>
          <h1 className="text-4xl md:text-6xl font-black text-white font-clash tracking-tight leading-none uppercase">
            FROM CHAOS <br />TO <span className="gold-text gold-glow">ELEGANT ORDER</span>
          </h1>
          <p className="text-titanium text-sm md:text-base max-w-2xl mx-auto leading-relaxed mt-4 font-satoshi">
            SortSphere (Rapid Recursive Rearrangement platform) is built for developers, students, and algorithm enthusiasts who seek deep, visual, and theoretical mastery over sorting structures.
          </p>
        </motion.div>

        {/* Brand values banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl border border-gold-royal/10 bg-gold-royal/5 glass-ultra"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#FFD700]/20 bg-[#FFD700]/5 shrink-0">
              <ShieldCheck size={18} className="text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-space">Production-Grade Telemetry</h3>
              <p className="text-xs text-titanium leading-relaxed mt-1 font-general">
                Driven by a native Python engine backend, our visualizer maps true operational execution steps, comparisons, and auxiliary memory spikes with cycle-exact consistency.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#FFD700]/20 bg-[#FFD700]/5 shrink-0">
              <Heart size={18} className="text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-space">Designed for Intuition</h3>
              <p className="text-xs text-titanium leading-relaxed mt-1 font-general">
                We replace dry textbook definitions with dynamic visual waveforms, interactive speed comparisons, and clear O-notation diagrams designed to inspire learning.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-lg font-bold text-white font-satoshi uppercase tracking-wider">Core Pillars</h2>
            <p className="text-xs text-titanium font-general mt-0.5">Explore the focus areas of the SortSphere platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map(({ icon: Icon, label, desc, path, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="h-full"
              >
                <Link
                  to={path}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="block stat-card p-5 rounded-2xl group cursor-pointer h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 relative z-10"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-gold-royal transition-colors relative z-10 font-satoshi uppercase tracking-wide">
                      {label}
                    </h3>
                    <p className="text-xs text-titanium mt-2 relative z-10 font-general leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-space font-bold uppercase text-gold-royal mt-4 group-hover:translate-x-1 transition-transform relative z-10 self-start">
                    Launch Module <ArrowRight size={11} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4 glass-ultra"
        >
          <div>
            <h4 className="text-white font-bold font-satoshi text-base">Ready to start rearrangement?</h4>
            <p className="text-titanium text-xs mt-0.5 font-general">Explore the interactive sorting lab simulator right away.</p>
          </div>
          <Link to="/lab" className="btn-primary px-6 py-2.5 rounded-full text-xs font-black tracking-widest leading-none flex items-center justify-center shrink-0">
            ENTER SORT LAB
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
