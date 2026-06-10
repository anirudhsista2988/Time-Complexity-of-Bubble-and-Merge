import { useState, useEffect, useRef, useCallback } from 'react';
import type { SortFrame } from '../types/sorting';

export function useSortPlayer(frames: SortFrame[], defaultSpeed = 80) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setPlaying(false);
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  }, []);

  const play = useCallback(() => {
    if (frames.length === 0) return;
    if (idx >= frames.length - 1) setIdx(0);
    setPlaying(true);
  }, [frames.length, idx]);

  const pause = stop;

  const stepFwd = useCallback(() => {
    stop(); setIdx(p => Math.min(p+1, frames.length-1));
  }, [stop, frames.length]);

  const stepBwd = useCallback(() => {
    stop(); setIdx(p => Math.max(p-1, 0));
  }, [stop]);

  const reset = useCallback(() => {
    stop(); setIdx(0);
  }, [stop]);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIdx(p => {
        if (p >= frames.length - 1) { stop(); return p; }
        return p + 1;
      });
    }, speed);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, speed, frames.length, stop]);

  return {
    frame: frames[idx] ?? null,
    idx,
    total: frames.length,
    playing,
    speed, setSpeed,
    play, pause, stepFwd, stepBwd, reset,
  };
}
