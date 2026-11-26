"use client";

import { useCallback, useEffect, useRef } from "react";

/* =========================================================
   EventSmart — Preloader (Tailwind + CSS)
   Línea de tiempo 0–100 controlada con requestAnimationFrame.
   Los estilos por frame se escriben directo en el DOM (refs)
   para no re-renderizar React 60 veces por segundo.
   ========================================================= */

type CardState = { x: number; y: number; rot: number; scale: number; opacity: number; z: number };

const DURATION_MS = 4800;

// Entrada escalonada de las 4 fotos (fase 1–4)
const POP_IN = [
  { start: 5, dur: 15, fromY: 40, rot: -7, scale: 1 },
  { start: 18, dur: 16, fromY: 45, rot: 6, scale: 1 },
  { start: 32, dur: 14, fromY: 40, rot: -4, scale: 1.02 },
  { start: 44, dur: 14, fromY: 40, rot: 9, scale: 1 },
];

// Abanico final (fase 5): posición desde -> hasta
const FAN = [
  { from: [0, 0, -7], to: [-250, -14, -13], scale: 0.94, z: 1 },
  { from: [0, 0, 6], to: [-125, 14, -5], scale: 0.97, z: 2 },
  { from: [0, 0, -4], to: [0, -10, 1.5], scale: 1.08, z: 10 },
  { from: [0, 0, 9], to: [125, -14, 6], scale: 0.97, z: 3 },
  { from: [0, 40, 0], to: [250, 14, 14], scale: 0.94, z: 1 },
];

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function computeCards(p: number): CardState[] {
  const states: CardState[] = [];

  // Fases 1–4: fotos aparecen y se apilan
  POP_IN.forEach((c) => {
    if (p < c.start) {
      states.push({ x: 0, y: c.fromY, rot: 0, scale: 0.7, opacity: 0, z: 1 });
    } else if (p < c.start + c.dur) {
      const t = easeOutBack((p - c.start) / c.dur);
      states.push({ x: 0, y: c.fromY * (1 - t), rot: c.rot * t, scale: 0.7 + 0.3 * t, opacity: t, z: 1 });
    } else {
      states.push({ x: 0, y: 0, rot: c.rot, scale: c.scale, opacity: 1, z: 1 });
    }
  });
  // Ticket: oculto hasta el abanico
  states.push({ x: 0, y: 40, rot: 0, scale: 0.85, opacity: 0, z: 1 });

  // Fase 5: abanico (58% – 85%)
  if (p > 58 && p <= 85) {
    const t = easeInOutCubic(clamp01((p - 58) / 24));
    FAN.forEach((f, i) => {
      states[i] = {
        x: lerp(f.from[0], f.to[0], t),
        y: lerp(f.from[1], f.to[1], t),
        rot: lerp(f.from[2], f.to[2], t),
        scale: f.scale,
        opacity: i === 4 ? t : 1,
        z: f.z,
      };
    });
  }

  // Fase 6: las cartas se reúnen y se desvanecen (85% – 100%)
  if (p > 85) {
    const t = easeInOutCubic(clamp01((p - 85) / 15));
    FAN.forEach((f, i) => {
      states[i] = {
        x: lerp(f.to[0], 0, t),
        y: lerp(f.to[1], 20, t),
        rot: f.to[2],
        scale: f.scale * (1 - t * 0.15),
        opacity: 1 - t * 0.8,
        z: i === 2 ? 5 : f.z,
      };
    });
  }

  return states;
}

type PreloaderProps = {
  /** Se llama al llegar a 100%. */
  onFinish?: () => void;
  /** Clases extra para el contenedor (p. ej. el fundido de salida). */
  className?: string;
};

/**
 * Ocupa toda la pantalla por debajo del navbar (top-16), sobre fondo blanco.
 * Inspección: `?t=72` congela el frame, `?loop=1` lo repite.
 */
export default function Preloader({ onFinish, className = "" }: PreloaderProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flourishRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const renderFrame = useCallback((p: number) => {
    if (counterRef.current) counterRef.current.textContent = `${Math.round(clamp01(p / 100) * 100)}%`;
    if (fillRef.current) fillRef.current.style.width = `${p}%`;
    if (flourishRef.current) flourishRef.current.style.transform = `scale(${1 + Math.sin(p * 0.05) * 0.02})`;

    const hovered = hoveredRef.current;
    computeCards(p).forEach((s, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const lift = hovered === i && p > 55 && p < 88;
      el.style.transform =
        `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.rot}deg) scale(${s.scale})` +
        (lift ? " scale(1.12) translateY(-10px)" : "");
      el.style.opacity = String(clamp01(s.opacity));
      el.style.zIndex = String(lift ? 50 : s.z);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const frozen = params.has("t");
    const loop = params.has("loop");
    progressRef.current = frozen ? parseFloat(params.get("t") ?? "0") || 0 : 0;
    renderFrame(progressRef.current);
    if (frozen) return;

    let raf = 0;
    let last: number | null = null;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (ts: number) => {
      const delta = last === null ? 0 : ts - last;
      last = ts;
      progressRef.current += (delta / DURATION_MS) * 100;

      if (progressRef.current >= 100) {
        if (loop) {
          progressRef.current = 0;
        } else {
          progressRef.current = 100;
          renderFrame(100);
          finishTimer = setTimeout(() => onFinishRef.current?.(), 350);
          return;
        }
      }
      renderFrame(progressRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
    };
  }, [renderFrame]);

  const hover = (i: number | null) => {
    hoveredRef.current = i;
    renderFrame(progressRef.current);
  };

  const cardBase =
    "absolute h-[225px] w-[185px] max-[900px]:h-[190px] max-[900px]:w-[155px] cursor-pointer rounded-md border border-ink/[0.08] bg-white p-[7px] pb-[22px] opacity-0 " +
    "shadow-[0_18px_40px_-10px_rgba(15,23,42,0.32),0_2px_6px_rgba(15,23,42,0.12)] transition-all duration-[450ms] ease-spring pointer-events-auto " +
    "[transform:translate3d(0,40px,0)_scale(0.85)]";

  const photos = [
    { photo: "photo-laser", tape: "tape-top", badge: "bg-brand/90 text-white", label: "AFORO EN VIVO", pulse: true },
    { photo: "photo-crowd", tape: "tape-slant", badge: "bg-amber-500/90 text-ink", label: "97% RESERVADO", pulse: false },
    { photo: "photo-dj", tape: "tape-top", badge: "bg-emerald-500/90 text-white", label: "ACCESO VALIDADO", pulse: true },
    { photo: "photo-sunset", tape: "tape-right", badge: "bg-brand/90 text-white", label: "PRÓXIMO FESTIVAL", pulse: false },
  ];

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-16 z-[100] flex select-none flex-col overflow-hidden bg-white ${className}`}
    >
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-35" />

      {/* Escenario central */}
      <section className="relative z-[5] flex flex-1 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div
            ref={flourishRef}
            className="relative z-[2] -ml-[35px] mr-2.5 flex items-center justify-center transition-transform duration-500 ease-smooth max-[900px]:h-[140px] max-[900px]:w-[90px]"
          >
            <span className="inline-block translate-y-[-24px] scale-y-[1.08] font-script text-[clamp(260px,28vw,380px)] leading-[0.65] text-ink [text-shadow:0_4px_14px_rgba(15,23,42,0.06)] max-[900px]:text-[180px]">
              E
            </span>
          </div>
          <div className="-mt-1.5 flex flex-col font-display uppercase leading-[0.82] tracking-[0.02em] text-ink text-[clamp(92px,11.5vw,155px)] max-[900px]:text-[54px]">
            <span>VENT</span>
            <span>SMART</span>
          </div>
        </div>

        {/* Cartas cinéticas */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          {photos.map((c, i) => (
            <div
              key={c.photo}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cardBase}
              onMouseEnter={() => hover(i)}
              onMouseLeave={() => hover(null)}
            >
              <span className={`tape ${c.tape}`} />
              <div className={`relative h-full w-full overflow-hidden rounded ${c.photo}`}>
                <span
                  className={`absolute inset-x-2 bottom-2 flex items-center justify-center gap-[5px] rounded-full px-2 py-[5px] text-[9px] font-extrabold tracking-[0.06em] shadow-[0_2px_6px_rgba(0,0,0,0.12)] backdrop-blur-md ${c.badge}`}
                >
                  <span className={`size-[5px] rounded-full bg-white ${c.pulse ? "animate-pulse-dot" : ""}`} />
                  {c.label}
                </span>
              </div>
            </div>
          ))}

          {/* Carta 5: ticket criptográfico */}
          <div
            ref={(el) => {
              cardRefs.current[4] = el;
            }}
            className={cardBase}
            onMouseEnter={() => hover(4)}
            onMouseLeave={() => hover(null)}
          >
            <span className="tape tape-top" />
            <div className="flex h-full w-full flex-col items-center justify-between rounded bg-white px-2.5 py-3">
              <div className="flex items-center gap-[5px] text-[8px] font-extrabold tracking-[0.08em] text-ink">
                <span className="size-[5px] rounded-full bg-brand" />
                EVENTSMART PASS
              </div>
              <div className="relative my-1.5 flex size-[108px] items-center justify-center rounded-lg border border-brand-border bg-slate-50">
                <span className="absolute left-1 top-1 size-3 border-2 border-b-0 border-r-0 border-brand" />
                <span className="absolute right-1 top-1 size-3 border-2 border-b-0 border-l-0 border-brand" />
                <span className="absolute bottom-1 left-1 size-3 border-2 border-r-0 border-t-0 border-brand" />
                <span className="absolute bottom-1 right-1 size-3 border-2 border-l-0 border-t-0 border-brand" />
                <div className="qr-matrix size-20 opacity-85" />
                <span className="absolute flex size-[22px] items-center justify-center rounded bg-brand text-[8px] font-black text-white shadow-[0_2px_4px_rgba(37,99,235,0.4)]">
                  ES
                </span>
              </div>
              <span className="font-mono text-[8px] font-bold tracking-[0.08em] text-emerald-600">
                ✔ SHA-256 VERIFICADO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between px-7 py-6 max-[900px]:py-[18px]">
        <div className="flex items-center gap-4">
          <span className="flex animate-spin-slow items-center justify-center text-ink">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.9" y1="4.9" x2="19.1" y2="19.1" />
              <line x1="19.1" y1="4.9" x2="4.9" y2="19.1" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold tracking-[0.12em] text-muted">CARGANDO EXPERIENCIA</span>
            <span ref={counterRef} className="font-mono text-xl font-bold tracking-[-0.02em] text-brand">
              0%
            </span>
          </div>
        </div>
        <p className="max-w-[440px] text-right text-[11.5px] font-medium leading-[1.45] text-muted max-[900px]:hidden">
          Festivales, aforo y accesos en tiempo real. Cada boleto validado con firma SHA-256 para que solo entre quien
          tiene que entrar.
        </p>
      </footer>

      {/* Línea de progreso */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/[0.06]">
        <div
          ref={fillRef}
          className="h-full w-0 bg-linear-to-r from-brand to-brand-glow transition-[width] duration-100 ease-linear"
        />
      </div>
    </div>
  );
}
