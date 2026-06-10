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

  return (
    <div className="min-h-screen pt-14 p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-xs text-gold-royal font-bold uppercase tracking-widest mb-1">Complexity Universe</p>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitCompare size={22} className="text-gold-royal" />
          Interactive Complexity Explorer
        </h1>
        <p className="text-titanium text-sm mt-1">Click any complexity class to deep-dive</p>
      </div>

      {/* Complexity Class Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {COMPLEXITIES.map(({notation, label, color, description, algos, points}) => {
          const isActive = active === notation;
          return (
            <motion.div key={notation}
              onClick={() => setActive(isActive ? null : notation)}
              whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              className="cursor-pointer stat-card p-5 rounded-2xl border transition-all"
              style={{borderColor: isActive ? `${color}50` : 'rgba(255,255,255,0.06)', background: isActive ? `${color}08` : undefined}}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl font-black font-mono" style={{color}}>{notation}</span>
                <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={{borderColor:`${color}30`, color, background:`${color}10`}}>{label}</span>
              </div>
              <p className="text-xs text-titanium leading-relaxed mb-3">{description}</p>
              {algos.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {algos.map(id => (
                    <span key={id} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                      {algorithmMeta[id].name}
                    </span>
                  ))}
                </div>
              )}
              {isActive && (
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs font-medium" style={{color}}>Key Insight</p>
                  <p className="text-xs text-white/60 mt-1">{points}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Visual Comparison Chart */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Growth Rate Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr>
                <th className="text-left text-titanium pb-3 pr-4 font-medium">Complexity</th>
                {sizes.map(s => (
                  <th key={s} className="text-right text-titanium pb-3 px-3 font-medium">n={s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPLEXITIES.map(({notation, color}) => (
                <tr key={notation} className="border-t border-white/5">
                  <td className="py-2 pr-4 font-bold" style={{color}}>{notation}</td>
                  {sizes.map(n => {
                    const val = fn[notation](n);
                    const pct = (val / maxVal) * 100;
                    return (
                      <td key={n} className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 rounded-full" style={{width:`${Math.min(pct,100)*0.6}px`, background:color, minWidth:'2px'}} />
                          <span className="text-white/70">{val >= 1e6 ? '∞' : val >= 1000 ? `${(val/1000).toFixed(0)}k` : Math.round(val)}</span>
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
