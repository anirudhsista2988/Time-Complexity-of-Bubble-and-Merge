# RRR Architecture & Event-Driven Telemetry Engine

This document provides a technical overview of how **RRR (Rapid Recursive Rearrangement)** separates sorting computations from visualization rendering to achieve smooth, controllable simulations.

## The Core Problem in Visualizers

Traditional sorting visualizers usually update the DOM or trigger state renders *directly* inside the sorting loop. This couples the execution speed of the sorting algorithm to the rendering loop of the browser. It makes it impossible to implement features like:
* Rewinding/Stepping backward frame-by-frame.
* Pausing and resuming cleanly at any point in time.
* Benchmarking sorting execution speeds accurately without rendering overhead.

## The RRR Solution: In-Memory Event Tracing

RRR solves this by using an **Event-Driven Telemetry Engine**. The lifecycle of a single sorting run is divided into three distinct phases:

```
[ Array Input ] ──> [ 1. Trace Generation ] ──> [ 2. State Player ] ──> [ 3. Render Engine ]
                        (In Memory)              (useSortPlayer)           (Canvas/SVG)
```

### 1. In-Memory Trace Generation

When you click "Shuffle" or change an algorithm, RRR computes the entire sorting sequence in memory first. Each sorting runner (e.g. `runQuickSort`) takes an input array of numbers and returns an array of `SortFrame` objects.

```typescript
export interface SortFrame {
  array: number[];          // Snapshot of the array at this state
  states: BarState[];       // Visual markers for each bar ('swap', 'compare', etc.)
  comparisons: number;      // Cumulative comparison count
  swaps: number;            // Cumulative swap count
  description: string;      // Human-readable step description
  activeLine?: number;      // Currently active line of pseudocode
}
```

This ensures that the calculation is extremely fast (measured in microseconds) and is decoupled entirely from React render intervals.

### 2. Time-Sliced Player Control

The `useSortPlayer` hook receives the list of computed `SortFrame`s. It exposes:
* `play()` / `pause()`
* `stepFwd()` / `stepBwd()`
* `speed` controls

It runs a simple `setInterval` matching the user's speed preference. Each tick increments or decrements the active frame index, feeding the active `SortFrame` down into the component tree.

### 3. High-Performance Canvas & SVG Rendering

Since React re-renders on every index update, RRR utilizes performance-optimized rendering:
* **Bars / Skyline**: Rendered as highly optimized CSS grid cells or flex bars using GPU-accelerated Tailwind transitions.
* **SortBarsCanvas**: Uses standard HTML5 Canvas running at 60 FPS, with pixelated rendering, gradient paths, and custom shadows for comparisons and swaps.
* **Polar Coordinate (Circular) & Particle Visuals**: Drawn as native SVG vector nodes that translate smoothly with Framer Motion transitions.

## Module Integration

The platform modules read directly from the core features/sorting engine:
* **Race Arena** maps multiple timers to run separate sorting runners in parallel, comparing frame trace indices over time.
* **Analytics Terminal** executes runners synchronously, tracking the raw execution times ($t_1 - t_0$) and counting comparisons to plot growth graphs with Chart.js.
