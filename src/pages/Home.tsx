import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientCanvas } from '../components/AmbientCanvas';
import { HologramHeroCanvas } from '../components/HologramHeroCanvas';
import { 
  Layers, Beaker, Trophy, BarChart2, BookOpen, Code2, GitCompare, Zap, 
  Settings, Activity, Terminal, ArrowRight, ChevronRight,
  Sparkles, X, Shield, RefreshCw
} from 'lucide-react';

interface RaceResult {
  name: string;
  progress: number;
  color: string;
  speed: number;
}

const initialLogs = [
  "[SYS] Booting sorting engine telemetry protocols...",
  "[SYS] Direct memory access (DMA) buffers initialized.",
  "[SYS] CPU hyperthreads synchronized for parallel race simulation.",
  "[MEM] Allocated 64MB diagnostic arrays on L2 caching page.",
  "[AI] Neural helper context weights mapped for O(N log N) tutoring.",
  "[BENCH] Speed-race vector analysis ready.",
  "[GPU] WebGL hardware acceleration detected and enabled.",
  "[SYS] Status: ONLINE. Diagnostics: nominal. All 10 engines active."
];

const sidebarLinks = [
  { path: '/dashboard',  label: 'Command Center', icon: Layers, desc: 'Operational Overview' },
  { path: '/lab',        label: 'Sort Lab',        icon: Beaker, desc: 'Visual Experimentation' },
  { path: '/race',       label: 'Race Arena',      icon: Trophy, desc: 'Competitive Benchmarks' },
  { path: '/analytics',  label: 'Analytics',       icon: BarChart2, desc: 'F1 Telemetry Dashboard' },
  { path: '/learn',      label: 'Learning Hub',    icon: BookOpen, desc: 'Algorithmic Education' },
  { path: '/code',       label: 'Code Studio',     icon: Code2, desc: 'Compilation Console' },
  { path: '/complexity', label: 'Complexity Space',icon: GitCompare, desc: 'Asymptotic Universe' },
  { path: '/interview',  label: 'Interview Prep',  icon: Zap, desc: 'FAANG Strategy' },
];

export const Home: React.FC = () => {
  const loc = useLocation();
  const [lightPos, setLightPos] = useState({ x: 400, y: -50 });
  const logoRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Real-time counters
  const [opsCount, setOpsCount] = useState(1892043);
  const [cpuLoad, setCpuLoad] = useState(14.8);
  const [coreTemp, setCoreTemp] = useState(41.2);
  const [memoryUsed, setMemoryUsed] = useState(24.8);
  const [uptime, setUptime] = useState(0);

  // Settings mock states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particleDensity, setParticleDensity] = useState('high');
  const [bloomEnabled, setBloomEnabled] = useState(true);

  // Live Logs state
  const [logs, setLogs] = useState<string[]>(initialLogs);

  // Live Race Widget state
  const [competitors, setCompetitors] = useState<RaceResult[]>([
    { name: 'Quick Sort', progress: 0, color: '#FFD700', speed: 7 },
    { name: 'Merge Sort', progress: 0, color: '#0A84FF', speed: 4.8 },
    { name: 'Heap Sort', progress: 0, color: '#30D158', speed: 5.5 },
    { name: 'Bubble Sort', progress: 0, color: '#FF453A', speed: 1.2 },
  ]);
  const [raceWinner, setRaceWinner] = useState<string | null>(null);

  // Sparkline data state
  const [sparkValues, setSparkValues] = useState<number[]>([
    45, 52, 48, 62, 58, 72, 68, 83, 79, 94, 89, 98, 92, 102, 96, 99
  ]);

  // Handle logo lighting position based on mouse hover
  const handleLogoMouseMove = (e: React.MouseEvent) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 240;
    setLightPos({ x, y: y - 70 });
  };

  // Uptime & Operations ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    
    const opsTimer = setInterval(() => {
      setOpsCount(prev => prev + Math.floor(Math.random() * 240 - 100));
      setCpuLoad(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(5, Math.min(95, parseFloat((prev + delta).toFixed(1))));
      });
      setCoreTemp(prev => {
        const delta = (Math.random() - 0.5) * 1.5;
        return Math.max(35, Math.min(75, parseFloat((prev + delta).toFixed(1))));
      });
      setMemoryUsed(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        return Math.max(10, Math.min(128, parseFloat((prev + delta).toFixed(1))));
      });
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(opsTimer);
    };
  }, []);

  // Live Simulated Logs ticking
  useEffect(() => {
    const logPool = [
      "[SYS] Benchmarking QuickSort vs HeapSort: QuickSort leads by 14.2%.",
      "[SYS] Recalibrating heap sort tree boundary nodes.",
      "[CORE] Thread-0: executing SelectionSort swap logic.",
      "[MEM] Garbage collector released 3.12MB heap pages.",
      "[SYS] Telemetry handshake verified with Vercel edge runtime.",
      "[BENCH] BubbleSort comparison completed: 4,096 elements sorted in 81.4ms.",
      "[BENCH] QuickSort comparison completed: 4,096 elements sorted in 0.86ms.",
      "[CORE] AI tutor loading binary tree structure visualizer assets.",
      "[CORE] Dynamic simulation loop latency offset: 11.4ms.",
      "[SYS] Active core usage normal. Thermal throttling inactive.",
      "[MEM] Buffer registers mapped to address page 0x7FFF.",
      "[CORE] Forked race-telemetry node process to handle concurrent arrays.",
      "[SYS] Diagnostics scan: bubble, selection, insertion, merge online."
    ];

    const timer = setInterval(() => {
      setLogs(prev => {
        const next = [...prev];
        if (next.length > 9) next.shift();
        const randLog = logPool[Math.floor(Math.random() * logPool.length)];
        const timeStr = new Date().toTimeString().split(' ')[0];
        next.push(`[${timeStr}] ${randLog}`);
        return next;
      });
    }, 1700);

    return () => clearInterval(timer);
  }, []);

  // Live Race simulator ticking
  useEffect(() => {
    if (raceWinner) return;

    const interval = setInterval(() => {
      setCompetitors(prev => {
        const next = prev.map(c => {
          const step = Math.random() * c.speed * 2.2 + c.speed * 0.4;
          return { ...c, progress: Math.min(c.progress + step, 100) };
        });

        const completed = next.find(c => c.progress >= 100);
        if (completed) {
          setRaceWinner(completed.name);
          clearInterval(interval);
          setTimeout(() => {
            setCompetitors(p => p.map(x => ({ ...x, progress: 0 })));
            setRaceWinner(null);
          }, 3200);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [raceWinner]);

  // Sparkline data updates
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkValues(prev => {
        const next = [...prev];
        next.shift();
        const lastVal = next[next.length - 1];
        const change = (Math.random() - 0.5) * 22;
        const newVal = Math.max(15, Math.min(110, Math.round(lastVal + change)));
        next.push(newVal);
        return next;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  // Format uptime (hh:mm:ss)
  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // SVG Sparkline computation
  const sparkWidth = 400;
  const sparkHeight = 90;
  const points = sparkValues.map((val, idx) => {
    const x = (idx / (sparkValues.length - 1)) * sparkWidth;
    const y = sparkHeight - (val / 120) * (sparkHeight - 12) - 6;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${sparkWidth},${sparkHeight} L 0,${sparkHeight} Z`;

  return (
    <div className="min-h-screen lg:h-screen w-screen overflow-x-hidden lg:overflow-hidden bg-[#020202] text-gray-200 flex flex-col lg:flex-row font-general relative select-none">
      <AmbientCanvas />

      {/* ──── LEFT SIDEBAR ──────────────────────────────── */}
      <aside className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-[#050505]/75 backdrop-blur-xl flex flex-col p-5 z-20">
        {/* Core HUD Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl border border-gold-royal/30 flex items-center justify-center bg-black/60 relative group">
            <span className="text-base font-black font-clash gold-text-static">R</span>
            <div className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ boxShadow: '0 0 15px rgba(255,215,0,0.3)' }} />
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-wider font-clash text-white leading-none">RRR</h1>
            <p className="text-[9px] text-[#FFD700]/70 font-space tracking-[0.2em] font-semibold mt-1">TELEMETRY SYSTEM</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar pr-1">
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-3 pl-3">Navigation Systems</p>
          {sidebarLinks.map(({ path, label, icon: Icon, desc }) => {
            const active = loc.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 relative group
                  ${active
                    ? 'bg-gold-royal/10 border border-gold-royal/20 text-[#FFD700]'
                    : 'border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
              >
                <div className="shrink-0">
                  <Icon size={16} className={active ? 'text-[#FFD700]' : 'text-gray-500 group-hover:text-white transition-colors'} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold font-satoshi leading-tight">{label}</p>
                  <p className="text-[9px] text-gray-600 group-hover:text-gray-400 transition-colors mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={10} className="text-gray-600 group-hover:text-white transition-colors" />
                {active && (
                  <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-[#FFD700] rounded-r" />
                )}
              </Link>
            );
          })}

          <button onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.03] text-left"
          >
            <div className="shrink-0">
              <Settings size={16} className="text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold font-satoshi leading-tight">System Configuration</p>
              <p className="text-[9px] text-gray-600 mt-0.5">Adjust UI shader filters</p>
            </div>
            <ChevronRight size={10} className="text-gray-600" />
          </button>
        </nav>

        {/* Sidebar System Telemetry Footer */}
        <div className="border-t border-white/[0.06] pt-4 mt-4 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-space text-gray-500">
            <span>Uptime:</span>
            <span className="font-mono text-gray-300 font-bold">{formatUptime(uptime)}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-space text-gray-500">
            <span>Server Ping:</span>
            <span className="font-mono text-green-400 font-bold">14ms</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-400/5 border border-green-400/10 text-[9px] font-bold text-green-400 tracking-[0.1em] uppercase font-space justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Telemetry Link Stable
          </div>
        </div>
      </aside>

      {/* ──── MAIN CONTAINER ──────────────────────────────── */}
      <main className="flex-1 h-full flex flex-col p-4 gap-4 overflow-y-auto lg:overflow-hidden no-scrollbar z-10">
        
        {/* ─── TOP SECTION: HERO & STATUS TERMINAL ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[55%] shrink-0">
          
          {/* A. Dynamic Center Logo Panel */}
          <div 
            ref={logoRef}
            onMouseMove={handleLogoMouseMove}
            className="lg:col-span-8 rounded-2xl glass-card relative overflow-hidden flex flex-col items-center justify-center p-6 border border-gold-royal/10 group min-h-[300px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Holographic background canvas rendering streams */}
            <HologramHeroCanvas />

            {/* Glowing metallic border glow */}
            <div className="absolute inset-0 border border-gold-royal/15 rounded-2xl pointer-events-none group-hover:border-gold-royal/30 transition-colors duration-500" />
            <div className="scan-line pointer-events-none" />

            {/* Volumetric background radial glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] rounded-full filter blur-[80px]"
                style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)' }} />
            </div>

            {/* 3D Specular Metal SVG Logo */}
            <div className="relative z-10 w-full max-w-[550px] transition-transform duration-500 group-hover:scale-[1.02] cursor-pointer"
              style={{ transform: 'translateZ(20px)' }}
            >
              <svg viewBox="0 0 800 240" width="100%" height="100%" 
                className="drop-shadow-[0_12px_45px_rgba(212,175,55,0.22)] select-none pointer-events-none"
              >
                <defs>
                  <linearGradient id="gold-bevel-alloy" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFEE9" />
                    <stop offset="25%" stopColor="#EBC64B" />
                    <stop offset="50%" stopColor="#8F6B0B" />
                    <stop offset="75%" stopColor="#FFD95C" />
                    <stop offset="90%" stopColor="#705004" />
                    <stop offset="100%" stopColor="#FFFEE9" />
                  </linearGradient>
                  <filter id="alloy-specular" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                    <feSpecularLighting in="blur" surfaceScale="8" specularConstant="1.4" specularExponent="28" lightingColor="#FFFBDE" result="specOut">
                      <fePointLight id="light-reflector" x={lightPos.x} y={lightPos.y} z={95} />
                    </feSpecularLighting>
                    <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specIn" />
                    <feFlood floodColor="#755403" result="darkBase" />
                    <feComposite in="darkBase" in2="SourceAlpha" operator="in" result="baseIn" />
                    <feMerge>
                      <feMergeNode in="baseIn" />
                      <feMergeNode in="SourceGraphic" />
                      <feMergeNode in="specIn" />
                    </feMerge>
                  </filter>
                </defs>
                <text x="50%" y="65%" textAnchor="middle" fill="url(#gold-bevel-alloy)" filter="url(#alloy-specular)"
                  className="font-clash font-black tracking-tighter" style={{ fontSize: '165px' }}>
                  RRR
                </text>
              </svg>
            </div>

            {/* Description Subtitles */}
            <div className="relative z-10 text-center mt-3" style={{ transform: 'translateZ(10px)' }}>
              <h2 className="text-xs md:text-sm font-black text-white/80 tracking-[0.25em] uppercase font-satoshi">
                Rapid Recursive Rearrangement
              </h2>
              <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent mx-auto my-2.5" />
              <p className="text-[9px] text-[#FFD700] tracking-[0.4em] uppercase font-space font-medium opacity-80">
                Algorithm Diagnostics Dashboard
              </p>
            </div>

            {/* Platform Enter Quick Button */}
            <div className="absolute bottom-5 right-5 z-10">
              <Link to="/dashboard" 
                className="px-4 py-2 rounded-lg bg-gold-royal/10 border border-gold-royal/20 text-[#FFD700] text-[10px] font-bold uppercase tracking-[0.1em] font-space flex items-center gap-1.5 hover:bg-gold-royal/20 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all duration-300"
              >
                Launch Center <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* B. Right Panel: Bloomberg System Status & Live Logs */}
          <div className="lg:col-span-4 rounded-2xl glass-card border border-gold-royal/10 p-4 flex flex-col h-full overflow-hidden min-h-[300px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#FFD700]" />
                <span className="text-xs font-black font-clash text-white tracking-wider">SYSTEM MONITOR</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-semibold text-green-400 bg-green-400/5 px-2 py-0.5 rounded-full border border-green-400/10">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                ONLINE
              </div>
            </div>

            {/* Performance Counters Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-space">Operations/Sec</p>
                <p className="text-base font-black font-clash text-white mt-0.5 font-mono">{opsCount.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-space">CPU Core Load</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-base font-black font-clash text-white font-mono">{cpuLoad}%</p>
                  <span className="text-[9px] text-gray-500">active</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-space">Thermal Core</p>
                <p className="text-base font-black font-clash text-[#FFD700] mt-0.5 font-mono">{coreTemp}°C</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-space">Heap RAM Page</p>
                <p className="text-base font-black font-clash text-[#0A84FF] mt-0.5 font-mono">{memoryUsed}MB</p>
              </div>
            </div>

            {/* Simulated Live Console Log */}
            <div className="flex-1 flex flex-col min-h-0 bg-black/40 border border-white/[0.04] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-2">
                <Terminal size={10} className="text-[#FFD700]" />
                <span>Diagnostics Stream Output</span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar font-mono text-[9px] text-green-400/80 space-y-1.5 pr-1 leading-normal select-text">
                {logs.map((log, i) => {
                  let color = 'text-green-400/80';
                  if (log.includes('[SYS]')) color = 'text-[#FFD700]/90';
                  if (log.includes('[MEM]')) color = 'text-[#0A84FF]/90';
                  return (
                    <div key={i} className={`whitespace-pre-wrap break-all ${color}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM SECTION: TELEMETRY WIDGETS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:min-h-0 min-h-[320px]">
          
          {/* Widget 1: Live Sorting Race Telemetry */}
          <div className="lg:col-span-4 rounded-2xl glass-card border border-gold-royal/10 p-4 flex flex-col h-full overflow-hidden justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-[#FFD700]" />
                  <h3 className="text-xs font-black font-clash text-white tracking-wider">LIVE RACE SPEEDWAY</h3>
                </div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-space">SIMULATION FEED</span>
              </div>

              {/* Race Progress Bar List */}
              <div className="space-y-3 relative">
                {competitors.map(c => (
                  <div key={c.name} className="relative">
                    <div className="flex justify-between text-[10px] font-space font-medium mb-1">
                      <span className="text-gray-300 font-bold">{c.name}</span>
                      <span className="font-mono text-gray-400">{Math.round(c.progress)}%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 border border-white/[0.04] rounded-full overflow-hidden relative">
                      <motion.div
                        animate={{ width: `${c.progress}%` }}
                        transition={{ duration: 0.12, ease: 'linear' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${c.color}20, ${c.color})`, boxShadow: `0 0 10px ${c.color}40` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Victory Alert Screen */}
                <AnimatePresence>
                  {raceWinner && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-gold-royal/20"
                    >
                      <Sparkles className="text-[#FFD700] mb-2 animate-bounce" size={24} />
                      <h4 className="text-sm font-black font-clash text-[#FFD700] tracking-widest uppercase">VICTORY DETERMINED</h4>
                      <p className="text-xs font-black text-white mt-1 uppercase font-satoshi tracking-wider">{raceWinner} Leads Grid</p>
                      <div className="text-[8px] text-gray-500 mt-2 font-mono">Recalibrating workspace array indices...</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Action Navigation button */}
            <div className="border-t border-white/[0.06] pt-3 mt-3 flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-medium">Test other configurations:</span>
              <Link to="/race" className="text-[9px] font-black text-[#FFD700] hover:underline flex items-center gap-0.5">
                Open Race Arena <ChevronRight size={10} />
              </Link>
            </div>
          </div>

          {/* Widget 2: Bloomberg-grade Performance Sparkline */}
          <div className="lg:col-span-4 rounded-2xl glass-card border border-gold-royal/10 p-4 flex flex-col h-full overflow-hidden justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 size={14} className="text-[#FFD700]" />
                  <h3 className="text-xs font-black font-clash text-white tracking-wider">PERFORMANCE SPECTRUM</h3>
                </div>
                <div className="text-[9px] text-[#FFD700] font-mono font-bold">1.89M OPS</div>
              </div>
              <p className="text-[9px] text-gray-500 leading-normal mb-3 font-space">
                High-frequency algorithmic latency telemetry tracking (1000 items sorting runtime).
              </p>

              {/* Sparkline Canvas rendering */}
              <div className="relative h-24 bg-black/30 border border-white/[0.03] rounded-xl flex items-center justify-center overflow-hidden">
                <svg width="100%" height="100%" viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} preserveAspectRatio="none" className="overflow-visible">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,215,0,0.2)" />
                      <stop offset="100%" stopColor="rgba(255,215,0,0.0)" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  <motion.path
                    d={areaD}
                    fill="url(#sparkGrad)"
                    transition={{ ease: 'linear' }}
                  />
                  {/* Stroke Line */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transition={{ ease: 'linear' }}
                  />
                </svg>
                <div className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-600">GRID FREQ: 500MS</div>
              </div>
            </div>

            {/* Quick Action Navigation button */}
            <div className="border-t border-white/[0.06] pt-3 mt-3 flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-medium">Detailed sorting run analytics:</span>
              <Link to="/analytics" className="text-[9px] font-black text-[#FFD700] hover:underline flex items-center gap-0.5">
                Detailed Analytics <ChevronRight size={10} />
              </Link>
            </div>
          </div>

          {/* Widget 3: Algorithmic Complexity Hierarchy */}
          <div className="lg:col-span-4 rounded-2xl glass-card border border-gold-royal/10 p-4 flex flex-col h-full overflow-hidden justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <GitCompare size={14} className="text-[#FFD700]" />
                  <h3 className="text-xs font-black font-clash text-white tracking-wider">COMPLEXITY SPECTRUM</h3>
                </div>
                <span className="text-[9px] text-gray-500 font-bold font-space">O-NOTATION LIMITS</span>
              </div>

              {/* Hierarchy List */}
              <div className="space-y-1.5 font-space text-[10px]">
                {[
                  { label: 'O(1)', name: 'Constant Speed', status: 'Optimal', color: 'text-green-400 bg-green-400/8 border-green-400/20' },
                  { label: 'O(log N)', name: 'Logarithmic Divide', status: 'Efficient', color: 'text-green-400 bg-green-400/8 border-green-400/20' },
                  { label: 'O(N)', name: 'Linear Search', status: 'Moderate', color: 'text-[#FFD700] bg-[#FFD700]/8 border-[#FFD700]/20' },
                  { label: 'O(N log N)', name: 'Optimal Sort (Merge)', status: 'Standard', color: 'text-[#FFD700] bg-[#FFD700]/8 border-[#FFD700]/20' },
                  { label: 'O(N²)', name: 'Quadratic Loop (Bubble)', status: 'Sub-Optimal', color: 'text-red-400 bg-red-400/8 border-red-400/20' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-white text-xs w-16">{item.label}</span>
                      <span className="text-gray-400 text-[9px] font-satoshi font-semibold">{item.name}</span>
                    </div>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Navigation button */}
            <div className="border-t border-white/[0.06] pt-3 mt-3 flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-medium">Asymptotic space limits:</span>
              <Link to="/complexity" className="text-[9px] font-black text-[#FFD700] hover:underline flex items-center gap-0.5">
                Complexity Universe <ChevronRight size={10} />
              </Link>
            </div>
          </div>

        </div>

      </main>

      {/* ──── SETTINGS MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md rounded-2xl glass-ultra border border-gold-royal/25 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div className="flex items-center gap-2.5">
                  <Shield className="text-[#FFD700]" size={18} />
                  <div>
                    <h3 className="text-sm font-black font-clash text-white tracking-wider">SYSTEM CONFIGURATION</h3>
                    <p className="text-[9px] text-gray-500 font-space mt-0.5">Diagnostics v1.0.8</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-4 font-satoshi">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">Acoustic Audio FX</h4>
                    <p className="text-[9px] text-gray-500 mt-0.5">Auditory frequency representation of element swaps</p>
                  </div>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-space uppercase border transition-all duration-300
                      ${soundEnabled 
                        ? 'bg-green-400/8 border-green-400/20 text-green-400' 
                        : 'bg-white/5 border-white/10 text-gray-500'}`}
                  >
                    {soundEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">Particle Engine Load</h4>
                    <p className="text-[9px] text-gray-500 mt-0.5">Density of the vector field constellation rendering</p>
                  </div>
                  <div className="flex gap-1.5">
                    {['low', 'medium', 'high'].map(d => (
                      <button 
                        key={d}
                        onClick={() => setParticleDensity(d)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-space uppercase border transition-all duration-300
                          ${particleDensity === d 
                            ? 'bg-[#FFD700]/8 border-[#FFD700]/30 text-[#FFD700]' 
                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">Volumetric Bloom Rendering</h4>
                    <p className="text-[9px] text-gray-500 mt-0.5">High-fidelity bloom glow around active sorting points</p>
                  </div>
                  <button 
                    onClick={() => setBloomEnabled(!bloomEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-space uppercase border transition-all duration-300
                      ${bloomEnabled 
                        ? 'bg-[#FFD700]/8 border-[#FFD700]/30 text-[#FFD700]' 
                        : 'bg-white/5 border-white/10 text-gray-500'}`}
                  >
                    {bloomEnabled ? 'Online' : 'Offline'}
                  </button>
                </div>
              </div>

              {/* Reset diagnostics */}
              <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[9px] text-gray-500 font-mono">HASH: SHA-256 (0x8F9C)</span>
                <button 
                  onClick={() => {
                    setLogs(initialLogs);
                    setUptime(0);
                    setShowSettings(false);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-xs font-bold font-space flex items-center gap-1.5"
                >
                  <RefreshCw size={12} /> Reset Telemetry
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
