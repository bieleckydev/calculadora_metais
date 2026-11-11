import React, { useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { projectScene, DEFAULT_VIEW } from '../utils/scene3d';

// Área de desenho em unidades do viewBox; o modelo (raio 1) ocupa ~82px de raio
const WIDTH = 360;
const HEIGHT = 220;
const VIEWPORT = { cx: WIDTH / 2, cy: HEIGHT / 2, scale: 82 };

const DEG_PER_PX = 0.5;
const KEY_STEP_DEG = 10;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const TWEEN_MS = 320;

const THICKNESS_FIELDS = ['parede', 'espessura', 'espessura_alma', 'espessura_aba'];
const EDGE_COLOR = 'rgba(220, 228, 238, 0.32)';

const clampPitch = (p) => Math.max(-89, Math.min(89, p));
const clampZoom = (z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));

/**
 * Visualizador 3D livre: arrastar gira, pinça / roda do mouse dá zoom,
 * setas e +/− pelo teclado, duplo clique volta à vista inicial.
 * Só recalcula a projeção quando a vista ou o modelo mudam, no máximo uma
 * vez por quadro (requestAnimationFrame).
 * `ref` expõe animateTo(view) para os botões de vista prontos.
 */
export default function Viewer3D({ model, activeField, ariaLabel, ref }) {
  const gridId = useId();
  const svgRef = useRef(null);
  const [view, setView] = useState(DEFAULT_VIEW);
  const viewRef = useRef(DEFAULT_VIEW);
  const frameRef = useRef(0);
  const tweenRef = useRef(0);
  const pointersRef = useRef(new Map());
  const pinchRef = useRef(null);

  // Agrupa vários eventos de ponteiro num único render por quadro
  const commitView = (next) => {
    viewRef.current = next;
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      setView(viewRef.current);
    });
  };

  const stopTween = () => {
    cancelAnimationFrame(tweenRef.current);
    tweenRef.current = 0;
  };

  const animateTo = (target) => {
    stopTween();
    const from = viewRef.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      commitView(target);
      return;
    }

    // Gira pelo caminho mais curto, mesmo depois de várias voltas
    const deltaYaw = ((((target.yaw - from.yaw) % 360) + 540) % 360) - 180;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / TWEEN_MS);
      const ease = 1 - Math.pow(1 - t, 3);
      const next = {
        yaw: from.yaw + deltaYaw * ease,
        pitch: from.pitch + (target.pitch - from.pitch) * ease,
        zoom: from.zoom + (target.zoom - from.zoom) * ease
      };
      viewRef.current = next;
      setView(next);
      tweenRef.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    tweenRef.current = requestAnimationFrame(step);
  };

  useImperativeHandle(ref, () => ({ animateTo }));

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current);
    cancelAnimationFrame(tweenRef.current);
  }, []);

  // Roda do mouse: só dá zoom com Ctrl (pinça do touchpad) ou depois de
  // clicar no desenho; senão a página rola normalmente. Precisa de listener
  // não passivo para poder impedir a rolagem
  useEffect(() => {
    const el = svgRef.current;
    const onWheel = (e) => {
      if (!e.ctrlKey && document.activeElement !== el) return;
      e.preventDefault();
      cancelAnimationFrame(tweenRef.current);
      const v = viewRef.current;
      viewRef.current = { ...v, zoom: clampZoom(v.zoom * Math.exp(-e.deltaY * 0.0015)) };
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0;
          setView(viewRef.current);
        });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const pinchDistance = () => {
    const [p, q] = [...pointersRef.current.values()];
    return Math.hypot(p.x - q.x, p.y - q.y) || 1;
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
    stopTween();
    svgRef.current?.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2) {
      pinchRef.current = { distance: pinchDistance(), zoom: viewRef.current.zoom };
    }
  };

  const handlePointerMove = (e) => {
    const previous = pointersRef.current.get(e.pointerId);
    if (!previous) return;
    const current = { x: e.clientX, y: e.clientY };
    pointersRef.current.set(e.pointerId, current);

    const v = viewRef.current;
    if (pointersRef.current.size >= 2 && pinchRef.current) {
      commitView({ ...v, zoom: clampZoom(pinchRef.current.zoom * pinchDistance() / pinchRef.current.distance) });
    } else if (pointersRef.current.size === 1) {
      commitView({
        ...v,
        yaw: v.yaw + (current.x - previous.x) * DEG_PER_PX,
        pitch: clampPitch(v.pitch + (current.y - previous.y) * DEG_PER_PX)
      });
    }
  };

  const handlePointerUp = (e) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
  };

  const handleKeyDown = (e) => {
    const v = viewRef.current;
    const moves = {
      ArrowLeft: { ...v, yaw: v.yaw - KEY_STEP_DEG },
      ArrowRight: { ...v, yaw: v.yaw + KEY_STEP_DEG },
      ArrowUp: { ...v, pitch: clampPitch(v.pitch - KEY_STEP_DEG) },
      ArrowDown: { ...v, pitch: clampPitch(v.pitch + KEY_STEP_DEG) },
      '+': { ...v, zoom: clampZoom(v.zoom * 1.15) },
      '=': { ...v, zoom: clampZoom(v.zoom * 1.15) },
      '-': { ...v, zoom: clampZoom(v.zoom / 1.15) }
    };
    if (e.key === '0' || e.key === 'Home') {
      e.preventDefault();
      animateTo(DEFAULT_VIEW);
    } else if (moves[e.key]) {
      e.preventDefault();
      stopTween();
      commitView(moves[e.key]);
    }
  };

  const scene = useMemo(() => projectScene(model, view, VIEWPORT), [model, view]);

  return (
    <svg
      ref={svgRef}
      className="viewer3d"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      tabIndex={0}
      role="img"
      aria-label={ariaLabel}
      aria-roledescription="visualizador 3D interativo"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={() => animateTo(DEFAULT_VIEW)}
      onKeyDown={handleKeyDown}
    >
      <defs>
        <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${gridId})`} />

      <g>
        {scene.polys.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill={p.fill}
            fillRule="evenodd"
            // Faces curvas recebem contorno da própria cor: esconde as
            // emendas entre os segmentos sem desenhar as facetas
            stroke={p.smooth ? p.fill : EDGE_COLOR}
            strokeWidth={p.smooth ? 0.6 : 1}
            strokeLinejoin="round"
          />
        ))}
      </g>

      <g>
        {scene.dims.map((dim, i) => (
          <Dimension key={i} dim={dim} activeField={activeField} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Cota projetada: linha com traços nas pontas e rótulo afastado do centro
 */
function Dimension({ dim, activeField }) {
  const dx = dim.x2 - dim.x1;
  const dy = dim.y2 - dim.y1;
  const length = Math.hypot(dx, dy);
  if (length < 4) return null; // cota vista de topo (ex: C na vista de seção)

  const isActive = dim.fields.includes(activeField);
  const isMuted = Boolean(activeField) && !isActive;
  const color = isActive
    ? (dim.fields.some(f => THICKNESS_FIELDS.includes(f)) ? 'var(--diagram-thickness)' : 'var(--diagram-focus)')
    : 'var(--diagram-dim)';

  // Normal à linha, apontando para fora do centro do desenho
  let nx = -dy / length;
  let ny = dx / length;
  const mx = (dim.x1 + dim.x2) / 2;
  const my = (dim.y1 + dim.y2) / 2;
  if (nx * (mx - VIEWPORT.cx) + ny * (my - VIEWPORT.cy) < 0) {
    nx = -nx;
    ny = -ny;
  }
  const tick = 3.5;
  const lx = mx + nx * 11;
  const ly = my + ny * 11;
  const anchor = nx > 0.35 ? 'start' : nx < -0.35 ? 'end' : 'middle';

  return (
    <g opacity={isMuted ? 0.5 : 1}>
      <line x1={dim.x1} y1={dim.y1} x2={dim.x2} y2={dim.y2} stroke={color} strokeWidth={isActive ? 2 : 1.2} />
      <line x1={dim.x1 - nx * tick} y1={dim.y1 - ny * tick} x2={dim.x1 + nx * tick} y2={dim.y1 + ny * tick} stroke={color} strokeWidth="1.2" />
      <line x1={dim.x2 - nx * tick} y1={dim.y2 - ny * tick} x2={dim.x2 + nx * tick} y2={dim.y2 + ny * tick} stroke={color} strokeWidth="1.2" />
      <text
        x={lx}
        y={ly}
        textAnchor={anchor}
        dominantBaseline="middle"
        fill={isActive ? color : 'var(--diagram-label)'}
        fontSize={isActive ? 12 : 10.5}
        fontWeight="700"
        stroke="var(--bg-dark)"
        strokeWidth="3"
        paintOrder="stroke"
      >
        {dim.label}
      </text>
    </g>
  );
}
