'use client';

import React, { useEffect, useRef } from 'react';
import { THEMES } from '@/lib/themes';
import { ThemeType } from '@/types/experience';

interface RomanticBackgroundProps {
  theme?: ThemeType;
  interactive?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'heart' | 'circle' | 'sparkle';
}

export default function RomanticBackground({
  theme = 'romantic',
  interactive = true,
}: RomanticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const themeColors = THEMES[theme]?.particleColors || ['#f43f5e', '#fb7185', '#fda4af'];
    const particles: Particle[] = [];
    const particleCount = Math.min(32, Math.floor(width / 45));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shape: Math.random() > 0.4 ? 'heart' : Math.random() > 0.5 ? 'sparkle' : 'circle',
      });
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // top left curve
      c.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
      // top right curve
      c.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      c.closePath();
      c.fillStyle = color;
      c.globalAlpha = opacity;
      c.shadowColor = color;
      c.shadowBlur = 8;
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.closePath();
      c.fillStyle = color;
      c.globalAlpha = opacity * 0.8;
      c.shadowColor = color;
      c.shadowBlur = 10;
      c.fill();
      c.restore();
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (Math.random() > 0.6) {
        particles.push({
          x: clientX + (Math.random() - 0.5) * 20,
          y: clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 10 + 6,
          speedY: -(Math.random() * 1.5 + 0.5),
          speedX: (Math.random() - 0.5) * 1.5,
          opacity: 0.9,
          color: themeColors[Math.floor(Math.random() * themeColors.length)],
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          shape: Math.random() > 0.5 ? 'heart' : 'sparkle',
        });
        if (particles.length > 50) particles.shift();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.shape === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size * 0.8, p.color, p.opacity);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
        }

        // Wrap around top or respawn
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, interactive]);

  const currentTheme = THEMES[theme] || THEMES.romantic;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic atmospheric gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentTheme.bgGradient} opacity-95`} />
      
      {/* Ambient glowing radial orbs */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[130px] opacity-25 pointer-events-none transition-colors duration-1000"
        style={{ background: currentTheme.glowColor }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[450px] h-[450px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ background: currentTheme.glowColor }}
      />

      {/* Canvas for heart & sparkle physics */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
