import React, { useRef } from 'react';
import type { AlgorithmId } from '../types/sorting';
import { algorithmMeta } from '../features/sorting/sortEngine';
import { Clock } from 'lucide-react';

interface Props {
  activeId: AlgorithmId;
  onChange: (id: AlgorithmId) => void;
}

const ALGO_IDS = Object.keys(algorithmMeta) as AlgorithmId[];

export const AlgorithmCarousel: React.FC<Props> = ({ activeId, onChange }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    if (!sliderRef.current) return;
    sliderRef.current.classList.add('cursor-grabbing');
    sliderRef.current.classList.remove('snap-x', 'snap-mandatory'); // disable snap for smooth free drag
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (!sliderRef.current) return;
    sliderRef.current.classList.remove('cursor-grabbing');
    sliderRef.current.classList.add('snap-x', 'snap-mandatory');
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (!sliderRef.current) return;
    sliderRef.current.classList.remove('cursor-grabbing');
    sliderRef.current.classList.add('snap-x', 'snap-mandatory');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2.5; // Drag speed multiplier
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="w-full relative z-20 group -mt-2 mb-2">
      {/* Edge Gradients for smooth fade out */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[rgba(6,6,6,0.9)] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[rgba(6,6,6,0.9)] to-transparent pointer-events-none z-10" />

      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-12 cursor-grab"
      >
        {ALGO_IDS.map(id => {
          const meta = algorithmMeta[id];
          const active = activeId === id;

          return (
            <div
              key={id}
              onClick={() => onChange(id)}
              className={`shrink-0 snap-center select-none rounded-[20px] p-5 border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${active 
                  ? 'scale-105 z-10' 
                  : 'scale-[0.97] opacity-60 hover:opacity-100 hover:scale-100 bg-black/40'}
              `}
              style={{
                width: 280,
                borderColor: active ? 'rgba(255,215,0,0.35)' : 'rgba(255,255,255,0.06)',
                boxShadow: active 
                  ? '0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(255,215,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 8px 24px rgba(0,0,0,0.3)',
                background: active 
                  ? 'linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(6,6,6,0.98) 100%)' 
                  : 'rgba(15,15,15,0.85)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center border transition-colors duration-500"
                  style={{ 
                    borderColor: active ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)',
                    background: active ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.02)',
                    color: active ? '#FFD700' : '#8E8E93'
                  }}
                >
                  <span className="font-space font-black text-[13px] tracking-tight">
                    {id.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Complexity Badge */}
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-500"
                  style={{
                    borderColor: active ? 'rgba(255,215,0,0.2)' : 'transparent',
                    background: active ? 'rgba(255,215,0,0.06)' : 'transparent',
                  }}
                >
                  <Clock size={10} color={active ? '#FFD700' : '#8E8E93'} />
                  <span 
                    className="text-[10px] font-space font-bold uppercase tracking-widest"
                    style={{ color: active ? '#FFD700' : '#8E8E93' }}
                  >
                    {meta.average}
                  </span>
                </div>
              </div>

              <h3 
                className="text-[17px] font-clash font-semibold tracking-tight mb-2 transition-colors duration-500"
                style={{ color: active ? '#ffffff' : 'rgba(255,255,255,0.7)' }}
              >
                {meta.name}
              </h3>
              
              <p 
                className="text-[12px] font-satoshi leading-[1.6] transition-colors duration-500"
                style={{ color: active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)' }}
              >
                {meta.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
