"use client";
import { useState, useEffect } from 'react';
import './night-sky.css';

// Pre-generated star positions
// Each entry: x, y coordinates relative to viewport (0-1)
// flare: true for larger stars with cross-shaped luminous flare
const STAR_DATA = [
  // Small pinpoint stars (most of the sky)
  [0.05, 0.85], [0.12, 0.78], [0.18, 0.72], [0.25, 0.68],
  [0.30, 0.65], [0.38, 0.60], [0.42, 0.55], [0.45, 0.50],
  [0.48, 0.45], [0.52, 0.40], [0.55, 0.35], [0.58, 0.30],
  [0.60, 0.25], [0.63, 0.20], [0.65, 0.15], [0.68, 0.10],
  [0.70, 0.05], [0.72, -0.02], [0.74, -0.08], [0.76, -0.15],
  [0.78, -0.25], [0.80, -0.35], [0.82, -0.45], [0.84, -0.55],
  [0.86, -0.65], [0.88, -0.75], [0.90, -0.85], [0.92, -0.95],
  [0.94, -1.0], [0.96, -0.9], [0.98, -0.8], [0.99, -0.7],
  // Medium-sized stars with subtle cross-flare
  [0.15, 0.70], [0.22, 0.65], [0.28, 0.60], [0.35, 0.55],
  [0.40, 0.50], [0.45, 0.45], [0.50, 0.40], [0.55, 0.35],
  [0.60, 0.30], [0.65, 0.25], [0.70, 0.20], [0.75, 0.15],
  [0.80, 0.10], [0.85, 0.05], [0.90, 0.00], [0.95, 0.05],
  // Large stars with prominent four-point/cross flares
  [0.10, 0.80], [0.25, 0.75], [0.40, 0.70], [0.55, 0.65],
  [0.70, 0.60], [0.85, 0.55], [0.95, 0.50],
  [0.05, 0.90], [0.20, 0.85], [0.35, 0.80], [0.50, 0.75],
  [0.65, 0.70], [0.80, 0.65], [0.90, 0.60],
];

function generateStars() {
  const expanded = [];
  for (let i = 0; i < 500; i++) {
    const idx = Math.floor(i * STAR_DATA.length / 500);
    const base = STAR_DATA[idx];
    expanded.push({ x: base[0], y: base[1], flare: idx % 12 === 0 });
  }
  return expanded;
}

export default function NightSky() {
  const [stars, setStars] = useState(generateStars());

  useEffect(() => {
    const handleResize = () => {
      setStars(generateStars());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="night-sky" aria-hidden="true">
      <div className="milky-way-band" />
      {stars.map((star, si) => (
        <div
          key={si}
          className={star.flare ? 'star star-flare' : 'star'}
          style={{
            left: `${star.x * 100}%`,
            top: `${star.y * 100}%`,
          }}
        />
      ))}
      <div className="mountain" />
    </div>
  );
}