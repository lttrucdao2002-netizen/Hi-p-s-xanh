import React, { useEffect, useRef } from 'react';

interface FireworksCanvasProps {
  active: boolean;
  intensity?: 'medium' | 'high';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  shape: 'circle' | 'star';
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  active,
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#facc15', // Gold
      '#22c55e', // Green
      '#38bdf8', // Blue
      '#f43f5e', // Pink
      '#a855f7', // Purple
      '#fb923c', // Orange
    ];

    const createBurst = (x: number, y: number) => {
      const count = intensity === 'high' ? 60 : 35;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 4,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          shape: Math.random() > 0.4 ? 'star' : 'circle',
        });
      }
    };

    // Trigger initial bursts
    const burstsCount = intensity === 'high' ? 6 : 3;
    for (let b = 0; b < burstsCount; b++) {
      setTimeout(() => {
        const bx = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const by = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
        createBurst(bx, by);
      }, b * 200);
    }

    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // Gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, 5, p.size, p.size / 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(loop);
      }
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [active, intensity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
