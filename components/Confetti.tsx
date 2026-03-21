import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  onDone: () => void;
}

const COLORS = ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const Confetti: React.FC<ConfettiProps> = ({ active, onDone }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 3500;

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];

    for (let i = 0; i < 120; i++) {
      const fromLeft = i < 60;
      particles.push({
        x: fromLeft ? randomBetween(-20, 0) : randomBetween(canvas.width, canvas.width + 20),
        y: randomBetween(0, canvas.height * 0.6),
        vx: fromLeft ? randomBetween(4, 12) : randomBetween(-12, -4),
        vy: randomBetween(-8, 2),
        gravity: randomBetween(0.18, 0.35),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: randomBetween(6, 12),
        rotation: randomBetween(0, Math.PI * 2),
        rotSpeed: randomBetween(-0.15, 0.15),
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
        opacity: 1,
      });
    }

    particlesRef.current = particles;
    startTimeRef.current = performance.now();

    const draw = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotSpeed;
        p.opacity = Math.max(0, 1 - progress * 1.4);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onDone();
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Confetti;
