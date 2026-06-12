import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// HERO SEQUENCE — Scroll-Driven Canvas Frame Player
// 240 frames from /frames/ezgif-frame-001.jpg … 240.jpg
// Tied to scroll progress. After completion, reveals the homepage hero.
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 240;
const SCROLL_DISTANCE = 2400; // px of scroll to consume the full animation
const PRELOAD_BATCH = 40;     // how many frames to preload initially before showing

function padFrame(n: number) {
  return String(n).padStart(3, '0');
}

function frameUrl(n: number) {
  return `/frames/ezgif-frame-${padFrame(n)}.jpg`;
}

interface Props {
  onComplete: () => void;
}

export const HeroSequence: React.FC<Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const frameRef = useRef(0);
  const scrollRef = useRef(0);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0); // 0→1 hero reveal after animation

  // ── Preload all frames (batch for quick initial display) ────────────────
  const preloadAll = useCallback(() => {
    const imgs = imagesRef.current;
    const loaded = loadedRef.current;

    let firstBatchDone = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        loaded[i] = true;
        imgs[i] = img;

        // Mark ready after first batch
        if (i < PRELOAD_BATCH) {
          firstBatchDone++;
          if (firstBatchDone === PRELOAD_BATCH) setReady(true);
        }
      };
      img.onerror = () => {
        loaded[i] = false;
      };
      img.src = frameUrl(i + 1);
      imgs[i] = img;
    }

    // Fallback: if we can't load a full batch quickly, open after 1s
    setTimeout(() => {
      if (!ready) setReady(true);
    }, 1200);
  }, []);

  useEffect(() => {
    preloadAll();
  }, [preloadAll]);

  // ── Draw the current frame on canvas ────────────────────────────────────
  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Try target frame first, fall back to nearest loaded
    let idx = frameIdx;
    const imgs = imagesRef.current;
    const loaded = loadedRef.current;

    if (!loaded[idx] || !imgs[idx]) {
      // Search backward for last loaded frame
      for (let i = idx; i >= 0; i--) {
        if (loaded[i] && imgs[i]) { idx = i; break; }
      }
    }

    const img = imgs[idx];
    if (!img) return;

    const W = canvas.width;
    const H = canvas.height;

    // Cover fill: maintain aspect ratio, center crop
    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    const sx = (W - sw) / 2;
    const sy = (H - sh) / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  // ── Scroll handler ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const sticky = stickyRef.current;
    if (!sticky) return;

    let lastFrame = -1;
    let revealStarted = false;

    const onScroll = () => {
      const stickyTop = sticky.getBoundingClientRect().top + window.scrollY;
      const rawProgress = Math.max(0, window.scrollY - stickyTop);
      scrollRef.current = rawProgress;

      const progress = Math.min(rawProgress / SCROLL_DISTANCE, 1);
      const targetFrame = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      frameRef.current = targetFrame;

      // Start hero reveal when we hit the last 5% of frames
      if (progress >= 0.95 && !revealStarted) {
        revealStarted = true;
        onComplete();
      }

      // Drive hero reveal overlay opacity from 95% → 100% scroll
      if (progress >= 0.95) {
        const revealP = (progress - 0.95) / 0.05;
        setRevealProgress(Math.min(revealP, 1));
      } else {
        setRevealProgress(0);
      }

      if (targetFrame !== lastFrame) {
        lastFrame = targetFrame;
        drawFrame(targetFrame);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial draw
    drawFrame(0);

    return () => window.removeEventListener('scroll', onScroll);
  }, [ready, drawFrame, onComplete]);

  // ── Resize canvas to viewport ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [drawFrame]);

  return (
    <div
      ref={stickyRef}
      style={{
        height: `${SCROLL_DISTANCE + window.innerHeight}px`,
        position: 'relative',
      }}
    >
      {/* Sticky canvas — locks to viewport during scroll */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Frame canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            opacity: ready ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Dark vignette overlay at edges */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(2,2,2,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Scroll hint — fades out as user scrolls */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: ready ? Math.max(0, 1 - scrollRef.current / 200) : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,215,0,0.7)',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, rgba(255,215,0,0.6), transparent)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Hero reveal overlay — fades IN when animation ends, revealing hero */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(2,2,2,1)',
            opacity: revealProgress,
            transition: 'opacity 0.15s linear',
            pointerEvents: 'none',
          }}
        />

        {/* Loading pulse — shown until first batch is ready */}
        {!ready && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#020202',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid rgba(255,215,0,0.15)',
                borderTop: '2px solid rgba(255,215,0,0.85)',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
