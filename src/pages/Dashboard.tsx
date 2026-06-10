import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, Beaker, BookOpen, Code2, GitCompare, Trophy, Zap } from 'lucide-react';
import { algorithmMeta } from '../features/sorting/sortEngine';

const modules = [
  { icon:Beaker,    label:'Sort Lab',          sub:'10 algorithms, 6 visual modes', path:'/lab',        color:'#FFD700' },
  { icon:Trophy,    label:'Race Arena',         sub:'F1-style live competition',     path:'/race',       color:'#FF453A' },
  { icon:BarChart2, label:'Analytics Terminal', sub:'Bloomberg-grade benchmarks',    path:'/analytics',  color:'#0A84FF' },
  { icon:BookOpen,  label:'Learning Center',    sub:'Theory to practice',            path:'/learn',      color:'#30D158' },
  { icon:Code2,     label:'Code Studio',        sub:'6 programming languages',       path:'/code',       color:'#BF5AF2' },
  { icon:GitCompare,label:'Complexity Universe',sub:'Interactive O-notation map',    path:'/complexity', color:'#5AC8FA' },
  { icon:Zap,       label:'Interview Master',   sub:'FAANG preparation',             path:'/interview',  color:'#FF9F0A' },
];

const algoList = Object.values(algorithmMeta);

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen pt-14 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        transition={{duration:0.5}}
        className="mb-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gold-royal font-bold uppercase tracking-widest mb-1">Command Center</p>
            <h1 className="text-3xl font-bold text-white">Rapid Recursive Rearrangement</h1>
            <p className="text-titanium mt-1">Your algorithmic intelligence hub</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Algorithms', value:'10', sub:'Fully implemented', icon:Beaker },
          { label:'Visual Modes', value:'6', sub:'Switch anytime', icon:BarChart2 },
          { label:'Languages', value:'6', sub:'Code Studio', icon:Code2 },
          { label:'Interview Qs', value:'50+', sub:'FAANG ready', icon:Zap },
        ].map(({label,value,sub,icon:Icon},i) => (
          <motion.div key={label}
            initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            transition={{delay:i*0.06}}
            className="stat-card p-5 rounded-2xl"
          >
            <div className="flex items-start justify-between mb-3">
              <Icon size={16} className="text-gold-royal/70" />
              <span className="text-3xl font-black gold-text">{value}</span>
            </div>
            <p className="text-white text-sm font-medium">{label}</p>
            <p className="text-titanium text-xs mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Module Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Platform Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map(({icon:Icon, label, sub, path, color},i) => (
            <motion.div key={label}
              initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              transition={{delay:0.1+i*0.05}}
            >
              <Link to={path} className="block stat-card p-5 rounded-2xl group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{background:`${color}15`, border:`1px solid ${color}30`}}>
                  <Icon size={16} style={{color}} />
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-gold-royal transition-colors">{label}</p>
                <p className="text-xs text-titanium mt-1">{sub}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Algorithm Library */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Algorithm Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {algoList.map(({id, name, average, space, stable, color}, i) => (
            <motion.div key={id}
              initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
              transition={{delay:0.2+i*0.04}}
              className="stat-card p-4 rounded-xl flex items-center gap-4 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                style={{background:`${color}15`, color, border:`1px solid ${color}30`}}>
                {i+1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-gold-royal transition-colors truncate">{name}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-titanium font-mono">Avg: {average}</span>
                  <span className="text-xs text-titanium font-mono">Space: {space}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stable ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {stable ? 'Stable' : 'Unstable'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick launch */}
      <motion.div
        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
        className="mt-8 p-6 rounded-2xl border border-gold-royal/15 bg-gold-royal/5 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div>
          <p className="text-white font-semibold">Ready to visualize?</p>
          <p className="text-titanium text-sm mt-0.5">Open the Sort Lab and run your first simulation.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/lab" className="btn-gold px-6 py-2.5 rounded-full text-sm font-bold">Open Sort Lab</Link>
          <Link to="/race" className="btn-ghost px-6 py-2.5 rounded-full text-sm font-semibold">Race Arena</Link>
        </div>
      </motion.div>
    </div>
  );
};
