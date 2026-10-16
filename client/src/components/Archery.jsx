'use client';

import { useEffect, useRef } from 'react';
import './Archery.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Animated archery target with arrows that fly in and stick on impact.
 *
 * Props:
 * color           Arrow / accent color (default: #f4c56a)
 * backgroundColor Canvas background (default: transparent)
 * speed           Animation speed multiplier (default: 1)
 * scale           Target size relative to container (default: 0.82)
 * arrows          Number of arrows to keep on the target (default: 7, max: 18)
 * glow            Glow intensity (default: 1)
 * paused          Pause animation
 * intro           Animate the target in on mount
 * opacity         Overall opacity
 * fade            Edge fade amount, from 0 to 1
 * lineWidth       Target line width
 * mouseInteraction Slightly aim toward the pointer
 * className       Additional container class
 */
export default function Archery({
  color = '#f4c56a',
  backgroundColor = 'transparent',
  speed = 1,
  scale = 0.82,
  arrows = 7,
  glow = 1,
  paused = false,
  intro = true,
  opacity = 1,
  fade = 0,
  lineWidth = 1,
  mouseInteraction = true,
  className = '',
  ...rest
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const settingsRef = useRef(null);
  const wakeRef = useRef(null);

  settingsRef.current = {
    color: String(color),
    backgroundColor: String(backgroundColor),
    speed: Math.max(0, Number(speed) || 0),
    scale: clamp(Number(scale) || 0.82, 0.25, 1.2),
    arrows: Math.round(clamp(Number(arrows) || 0, 0, 18)),
    glow: Math.max(0, Number(glow) || 0),
    paused,
    intro,
    opacity: clamp(Number(opacity), 0, 1),
    fade: clamp(Number(fade), 0, 1),
    lineWidth: clamp(Number(lineWidth) || 1, 0.5, 4),
    mouseInteraction
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!container || !canvas || !ctx) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      width: 1,
      height: 1,
      dpr: 1,
      time: 0,
      intro: settingsRef.current.intro && !reduceMotion ? 0 : 1,
      pointerX: 0,
      pointerY: 0,
      pointerInside: false,
      nextShot: 0.6,
      arrows: [],
      particles: [],
      last: 0,
      raf: 0,
      visible: true,
      shotIndex: 0
    };

    const parseColor = value => {
      const probe = document.createElement('canvas').getContext('2d');
      if (!probe) return [244, 197, 106];
      probe.fillStyle = value;
      const normalized = probe.fillStyle;
      const match = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
      const hex = normalized.match(/^#([0-9a-f]{6})$/i);
      if (hex) return [parseInt(hex[1].slice(0, 2), 16), parseInt(hex[1].slice(2, 4), 16), parseInt(hex[1].slice(4, 6), 16)];
      return [244, 197, 106];
    };

    const rgba = (rgb, alpha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(alpha, 0, 1)})`;

    const fit = () => {
      const rect = container.getBoundingClientRect();
      state.width = Math.max(1, rect.width);
      state.height = Math.max(1, rect.height);
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(state.width * state.dpr);
      canvas.height = Math.round(state.height * state.dpr);
      canvas.style.width = `${state.width}px`;
      canvas.style.height = `${state.height}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      draw();
    };

    const addImpact = (x, y, rgb) => {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.25;
        const velocity = 12 + Math.random() * 36;
        state.particles.push({
          x, y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 0.35 + Math.random() * 0.25,
          maxLife: 0.6,
          color: rgb
        });
      }
    };

    const spawnArrow = (s, cx, cy, radius) => {
      if (state.arrows.length >= s.arrows) {
        state.arrows.shift();
      }
      // Choose a point within the scoring area, with a slight bias toward the bullseye.
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.sqrt(Math.random()) * radius * 0.72;
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle) * distance;
      const fromX = x + (state.width * 0.42);
      const fromY = y + (state.height * 0.22) + (Math.random() - 0.5) * state.height * 0.16;
      const heading = Math.atan2(y - fromY, x - fromX);
      state.arrows.push({
        x, y, fromX, fromY, heading,
        progress: 0,
        duration: 0.62 + Math.random() * 0.3,
        hit: false,
        wobble: (Math.random() - 0.5) * 0.12,
        age: 0
      });
      state.shotIndex++;
    };

    const drawTarget = (s, cx, cy, radius, rgb, introProgress) => {
      ctx.save();
      ctx.globalAlpha *= introProgress;
      ctx.translate(cx, cy);
      const ringColors = ['#f5f2e9', '#252a33', '#e44d4d', '#e44d4d', '#f4c84a', '#f4c84a'];
      const ringRadii = [1, 0.82, 0.64, 0.46, 0.28, 0.12];
      for (let i = 0; i < ringRadii.length; i++) {
        const r = radius * ringRadii[i];
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = ringColors[i];
        ctx.fill();
        ctx.lineWidth = Math.max(1, s.lineWidth * state.dpr) / state.dpr;
        ctx.strokeStyle = 'rgba(18, 22, 28, 0.72)';
        ctx.stroke();
      }

      // Fine scoring ticks around the rim.
      ctx.strokeStyle = rgba(rgb, 0.7);
      ctx.lineWidth = 1;
      for (let i = 0; i < 60; i++) {
        const a = (i / 60) * Math.PI * 2;
        const outer = radius + 7;
        const inner = radius + (i % 5 === 0 ? 1 : 4);
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        ctx.stroke();
      }

      // Subtle center highlight.
      const gradient = ctx.createRadialGradient(-radius * 0.18, -radius * 0.2, 0, 0, 0, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,0.12)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();
    };

    const drawArrow = (arrow, rgb, alpha = 1, flight = false) => {
      const length = Math.max(26, Math.min(state.width, state.height) * 0.12);
      const angle = arrow.heading + (flight ? 0 : arrow.wobble * Math.sin(arrow.age * 18) * Math.exp(-arrow.age * 3));
      ctx.save();
      ctx.globalAlpha *= alpha;
      ctx.translate(arrow.x, arrow.y);
      ctx.rotate(angle);

      if (flight && settingsRef.current.glow > 0) {
        ctx.shadowColor = rgba(rgb, 0.8);
        ctx.shadowBlur = 12 * settingsRef.current.glow;
      }

      // Shaft
      ctx.lineCap = 'round';
      ctx.lineWidth = 2.1;
      const shaft = ctx.createLinearGradient(-length, 0, length * 0.12, 0);
      shaft.addColorStop(0, '#6d4a2b');
      shaft.addColorStop(0.7, '#d7b17a');
      shaft.addColorStop(1, '#fff0c8');
      ctx.strokeStyle = shaft;
      ctx.beginPath();
      ctx.moveTo(-length, 0);
      ctx.lineTo(length * 0.18, 0);
      ctx.stroke();

      // Arrowhead
      ctx.fillStyle = '#d9e1e8';
      ctx.strokeStyle = '#77818c';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(length * 0.36, 0);
      ctx.lineTo(length * 0.12, -4.2);
      ctx.lineTo(length * 0.12, 4.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fletching
      ctx.fillStyle = rgba(rgb, 0.95);
      ctx.beginPath();
      ctx.moveTo(-length * 0.72, 0);
      ctx.lineTo(-length, -5);
      ctx.lineTo(-length * 0.86, 0);
      ctx.lineTo(-length, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const draw = () => {
      const s = settingsRef.current;
      const w = state.width;
      const h = state.height;
      if (!w || !h) return;
      const rgb = parseColor(s.color);
      ctx.clearRect(0, 0, w, h);

      if (s.backgroundColor && s.backgroundColor !== 'transparent') {
        ctx.fillStyle = s.backgroundColor;
        ctx.fillRect(0, 0, w, h);
      }

      const cx = w * (s.mouseInteraction && state.pointerInside ? 0.5 + clamp((state.pointerX / w - 0.5) * 0.035, -0.025, 0.025) : 0.5);
      const cy = h * 0.48;
      const radius = Math.min(w, h) * 0.34 * s.scale;
      const introProgress = s.intro ? state.intro : 1;
      const eased = 1 - Math.pow(1 - introProgress, 3);

      ctx.save();
      ctx.globalAlpha = s.opacity;
      if (s.glow > 0) {
        ctx.shadowColor = rgba(rgb, 0.32);
        ctx.shadowBlur = 20 * s.glow;
      }
      drawTarget(s, cx, cy, radius * eased, rgb, eased);
      ctx.restore();

      // Bow silhouette on the lower-left edge, to establish the archery theme.
      const bowX = w * 0.12;
      const bowY = h * 0.72;
      const bowHeight = Math.min(h * 0.48, 150);
      ctx.save();
      ctx.globalAlpha = s.opacity * 0.82;
      ctx.strokeStyle = rgba(rgb, 0.78);
      ctx.lineWidth = 2;
      ctx.shadowColor = rgba(rgb, 0.45);
      ctx.shadowBlur = 8 * s.glow;
      ctx.beginPath();
      ctx.moveTo(bowX + 18, bowY - bowHeight / 2);
      ctx.quadraticCurveTo(bowX - 26, bowY, bowX + 18, bowY + bowHeight / 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(235, 224, 204, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bowX + 18, bowY - bowHeight / 2);
      ctx.lineTo(bowX + 18, bowY + bowHeight / 2);
      ctx.stroke();
      ctx.restore();

      // Shooting arrow: it travels toward the target, then remains embedded.
      state.arrows.forEach(arrow => {
        if (arrow.hit) {
          drawArrow(arrow, rgb, s.opacity, false);
        } else {
          const p = clamp(arrow.progress, 0, 1);
          const easedP = 1 - Math.pow(1 - p, 2);
          const x = arrow.fromX + (arrow.x - arrow.fromX) * easedP;
          const y = arrow.fromY + (arrow.y - arrow.fromY) * easedP;
          const flightArrow = { ...arrow, x, y, heading: Math.atan2(arrow.y - arrow.fromY, arrow.x - arrow.fromX) };
          // Short trail behind the moving arrow.
          ctx.save();
          ctx.globalAlpha = s.opacity * (1 - p) * 0.65;
          ctx.strokeStyle = rgba(rgb, 0.55);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(flightArrow.heading) * 38, y - Math.sin(flightArrow.heading) * 38);
          ctx.lineTo(x - Math.cos(flightArrow.heading) * 8, y - Math.sin(flightArrow.heading) * 8);
          ctx.stroke();
          ctx.restore();
          drawArrow(flightArrow, rgb, s.opacity, true);
        }
      });

      state.particles.forEach(particle => {
        const a = clamp(particle.life / particle.maxLife, 0, 1);
        ctx.fillStyle = rgba(particle.color, a * s.opacity);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.2 + a, 0, Math.PI * 2);
        ctx.fill();
      });

      if (s.fade > 0) {
        const edge = Math.min(w, h) * 0.24 * s.fade;
        const gradient = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.72);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${s.fade})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const frame = now => {
      state.raf = 0;
      if (!state.visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = state.last ? Math.min(0.05, (now - state.last) / 1000) : 1 / 60;
      state.last = now;

      if (!s.intro || reduceMotion) state.intro = 1;
      else state.intro = Math.min(1, state.intro + dt / 1.4);

      if (!s.paused && !reduceMotion) {
        state.time += dt * s.speed;
        state.nextShot -= dt * s.speed;
        if (state.nextShot <= 0 && s.arrows > 0 && state.intro >= 0.9) {
          const w = state.width;
          const h = state.height;
          const cx = w * 0.5;
          const cy = h * 0.48;
          const radius = Math.min(w, h) * 0.34 * s.scale;
          spawnArrow(s, cx, cy, radius);
          state.nextShot = 1.25 + Math.random() * 0.8;
        }

        state.arrows.forEach(arrow => {
          arrow.age += dt * s.speed;
          if (!arrow.hit) {
            arrow.progress += (dt * s.speed) / arrow.duration;
            if (arrow.progress >= 1) {
              arrow.progress = 1;
              arrow.hit = true;
              const rgb = parseColor(s.color);
              addImpact(arrow.x, arrow.y, rgb);
            }
          }
        });

        state.particles = state.particles.filter(particle => {
          particle.life -= dt;
          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;
          particle.vx *= 0.96;
          particle.vy *= 0.96;
          return particle.life > 0;
        });
      }

      draw();
      if (!s.paused && !reduceMotion) state.raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const wake = () => {
      if (!state.raf && state.visible && !document.hidden) state.raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;
    const onPointerMove = event => {
      const rect = container.getBoundingClientRect();
      state.pointerX = event.clientX - rect.left;
      state.pointerY = event.clientY - rect.top;
      state.pointerInside = state.pointerX >= 0 && state.pointerY >= 0 && state.pointerX <= rect.width && state.pointerY <= rect.height;
      wake();
    };
    const onPointerLeave = () => { state.pointerInside = false; };
    const onVisibility = () => { state.last = 0; wake(); };
    const observer = new ResizeObserver(fit);
    const intersection = new IntersectionObserver(entries => {
      state.visible = entries.some(entry => entry.isIntersecting);
      if (state.visible) { state.last = 0; wake(); }
      else { cancelAnimationFrame(state.raf); state.raf = 0; }
    });

    observer.observe(container);
    intersection.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    fit();
    wake();

    return () => {
      cancelAnimationFrame(state.raf);
      wakeRef.current = null;
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    // Keep the animation responsive when props change, including pause/unpause.
    wakeRef.current?.();
  });

  return (
    <div
      ref={containerRef}
      className={`archery-container${className ? ` ${className}` : ''}`}
      {...rest}
    >
      <canvas ref={canvasRef} className="archery-canvas" aria-hidden="true" />
    </div>
  );
}
