import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { algorithmMeta } from '../features/sorting/sortEngine';
import type { AlgorithmId } from '../types/sorting';
import { GitCompare } from 'lucide-react';

const COMPLEXITIES = [
  {
    notation: 'O(1)',
    label: 'Constant',
    color: '#30D158',
    description: 'Operations that take the same time regardless of input size. Accessing an array element, hash map lookups.',
    algos: [] as AlgorithmId[],
    points: 'Fastest possible. No loops over data.',
  },
  {
    notation: 'O(log n)',
    label: 'Logarithmic',
    color: '#5AC8FA',
    description: 'Algorithms that halve the problem each step. Binary Search, balanced BST operations.',
    algos: [] as AlgorithmId[],
    points: 'Extremely efficient. Barely felt even for huge n.',
  },
  {
    notation: 'O(n)',
    label: 'Linear',
    color: '#0A84FF',
    description: 'Algorithms that scale directly with input. Counting Sort, Radix Sort passes, linear search.',
    algos: ['counting', 'radix', 'bucket'] as AlgorithmId[],
    points: 'Efficient. Optimal for comparison-free sorting in bounded ranges.',
  },
  {
    notation: 'O(n log n)',
    label: 'Linearithmic',
    color: '#FFD700',
    description: 'The theoretical lower bound for comparison-based sorting. Merge Sort, Quick Sort, Heap Sort.',
    algos: ['merge', 'quick', 'heap', 'shell'] as AlgorithmId[],
    points: 'Optimal for general comparison-based sorting. Industry standard.',
  },
  {
    notation: 'O(n²)',
    label: 'Quadratic',
    color: '#FF9F0A',
    description: 'Algorithms with nested loops comparing each element with all others. Simple sorts.',
    algos: ['bubble', 'selection', 'insertion'] as AlgorithmId[],
    points: 'Only practical for n < 1000. Avoid on large datasets.',
  },
  {
    notation: 'O(2ⁿ)',
    label: 'Exponential',
    color: '#FF453A',
    description: 'Algorithms where each addition to input doubles the work. Exhaustive permutation search.',
    algos: [] as AlgorithmId[],
    points: 'Never for large n. Restricted to n < 20 in practice.',
  },
];

const sizes = [1, 10, 50, 100, 250, 500, 1000];
const fn: Record<string, (n:number)=>number> = {
  'O(1)': ()=>1,
  'O(log n)': n=>Math.log2(n)||0,
  'O(n)': n=>n,
  'O(n log n)': n=>n*Math.log2(n||1),
  'O(n²)': n=>n*n,
  'O(2ⁿ)': n=>Math.min(Math.pow(2,n), 1e6),
};

export const ComplexityUniverse: React.FC = () => {
  const [active, setActive] = useState<string|null>(null);

  const maxVal = Math.max(...sizes.map(n => fn['O(n²)'](n)));

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / 8;
    const rotateY = (x - centerX) / 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) translateZ(8px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) translateZ(0px)';
  };

  return (
    <div className="min-h-screen pt-20 p-6 max-w-7xl mx-auto font-general">
      <div className="mb-10">
        <p className="text-xs text-gold-royal font-bold uppercase tracking-widest font-space mb-1">Complexity Universe</p>
        <h1 className="text-3xl font-black text-white font-clash leading-none flex items-center gap-2.5">
          <GitCompare size={22} className="text-gold-royal" />
          COMPLEXITY EXPLORER
        </h1>
        <p className="text-titanium text-sm mt-2">Click any complexity class to inspect key metrics and insights</p>
      </div>

      {/* Complexity Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {COMPLEXITIES.map(({notation, label, color, description, algos, points}) => {
          const isActive = active === notation;
          return (
            <motion.div key={notation}
              onClick={() => setActive(isActive ? null : notation)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="cursor-pointer stat-card p-6 rounded-2xl border transition-all"
              style={{
                borderColor: isActive ? `${color}55` : 'rgba(255,255,255,0.06)',
                background: isActive ? `${color}08` : undefined
              }}
            >
              <div className="flex items-start justify-between mb-4 relative z-10">
                <span className="text-3xl font-black font-space" style={{color}}>{notation}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full border font-bold font-space uppercase" style={{borderColor:`${color}35`, color, background:`${color}10`}}>{label}</span>
              </div>
              <p className="text-xs text-titanium leading-relaxed mb-4 font-general relative z-10">{description}</p>
              {algos.length > 0 && (
                <div className="flex flex-wrap gap-1.5 relative z-10">
                  {algos.map(id => (
                    <span key={id} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 font-space font-bold uppercase">
                      {algorithmMeta[id].name.replace(' Sort', '')}
                    </span>
                  ))}
                </div>
              )}
              {isActive && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-4 pt-4 border-t border-white/[0.05] relative z-10">
                  <p className="text-xs font-bold font-satoshi uppercase tracking-wider" style={{color}}>Key Insight</p>
                  <p className="text-xs text-white/60 mt-1 font-general leading-relaxed">{points}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Visual Comparison Chart */}
      <div className="glass-ultra rounded-2xl p-6 border border-white/[0.05]">
        <h2 className="text-base font-bold text-white mb-6 font-satoshi uppercase tracking-wider">Growth Rate Comparison Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-space">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left text-titanium pb-3 pr-4 font-bold uppercase tracking-wider">Complexity</th>
                {sizes.map(s => (
                  <th key={s} className="text-right text-titanium pb-3 px-3 font-bold uppercase tracking-wider font-mono">n={s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPLEXITIES.map(({notation, color}) => (
                <tr key={notation} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                  <td className="py-3 pr-4 font-black text-sm uppercase" style={{color}}>{notation}</td>
                  {sizes.map(n => {
                    const val = fn[notation](n);
                    const pct = (val / maxVal) * 100;
                    return (
                      <td key={n} className="py-3 px-3 text-right font-mono font-medium">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="h-2 rounded-sm shrink-0" style={{width:`${Math.min(pct,100)*0.7}px`, background:color, minWidth:'3px'}} />
                          <span className="text-white/80">{val >= 1e6 ? '∞' : val >= 1000 ? `${(val/1000).toFixed(0)}k` : Math.round(val)}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
