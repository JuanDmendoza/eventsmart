"use client";

import { useRef, useState } from "react";
import type { FlowPoint } from "../_data";

/* =========================================================
   Gráficas del panel admin (SVG/HTML puro, sin librerías).
   ========================================================= */

const W = 900;
const H = 250;
const PAD = { left: 56, right: 24, top: 34, bottom: 34 };
const Y_MAX = 500;
const Y_TICKS = [0, 125, 250, 375, 500];

const minutes = (label: string) => {
  const [h, m] = label.split(":").map(Number);
  return h * 60 + m;
};

/** Curva cúbica monótona (Fritsch–Carlson): suave y sin "pasarse" de los datos. */
function monotonePath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n < 2) return "";
  const m: number[] = [];
  for (let k = 0; k < n - 1; k++) m.push((pts[k + 1].y - pts[k].y) / (pts[k + 1].x - pts[k].x));
  const t: number[] = [m[0]];
  for (let k = 1; k < n - 1; k++) t.push(m[k - 1] * m[k] <= 0 ? 0 : (m[k - 1] + m[k]) / 2);
  t.push(m[n - 2]);
  for (let k = 0; k < n - 1; k++) {
    if (m[k] === 0) {
      t[k] = t[k + 1] = 0;
      continue;
    }
    const a = t[k] / m[k];
    const b = t[k + 1] / m[k];
    const h = a * a + b * b;
    if (h > 9) {
      const s = 3 / Math.sqrt(h);
      t[k] = s * a * m[k];
      t[k + 1] = s * b * m[k];
    }
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let k = 0; k < n - 1; k++) {
    const dx = (pts[k + 1].x - pts[k].x) / 3;
    d += ` C ${pts[k].x + dx} ${pts[k].y + t[k] * dx}, ${pts[k + 1].x - dx} ${pts[k + 1].y - t[k + 1] * dx}, ${pts[k + 1].x} ${pts[k + 1].y}`;
  }
  return d;
}

export function FlowLineChart({ data }: { data: FlowPoint[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const t0 = minutes(data[0].label);
  const t1 = minutes(data[data.length - 1].label);
  const x = (label: string) => PAD.left + ((minutes(label) - t0) / (t1 - t0)) * (W - PAD.left - PAD.right);
  const y = (v: number) => H - PAD.bottom - (v / Y_MAX) * (H - PAD.top - PAD.bottom);

  const real = data.map((d) => ({ x: x(d.label), y: y(d.value) }));
  const trend = data.map((d) => ({ x: x(d.label), y: y(d.trend) }));
  const line = monotonePath(real);
  const area = `${line} L ${real[real.length - 1].x} ${y(0)} L ${real[0].x} ${y(0)} Z`;
  const peak = data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);

  const onMove = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const vx = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    real.forEach((p, i) => {
      if (Math.abs(p.x - vx) < Math.abs(real[nearest].x - vx)) nearest = i;
    });
    setHover(nearest);
  };

  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label="Ingresos por hora: pico de 420 personas por hora a las 19:30"
      >
        <defs>
          <linearGradient id="flowArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Y_TICKS.map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke={v === 0 ? "#E2E8F0" : "#F1F5F9"} strokeDasharray={v === 0 ? undefined : "4 4"} />
            <text x={PAD.left - 10} y={y(v) + 3.5} fontSize="10" fill="#94A3B8" textAnchor="end">
              {v === 0 ? "0" : `${v} p/h`}
            </text>
          </g>
        ))}

        <path d={monotonePath(trend)} stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5 5" fill="none" />
        <path d={area} fill="url(#flowArea)" />
        <path d={line} stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {hover !== null && (
          <line x1={real[hover].x} x2={real[hover].x} y1={PAD.top - 10} y2={y(0)} stroke="#94A3B8" strokeDasharray="3 3" />
        )}

        {real.map((p, i) => (
          <circle
            key={data[i].label}
            cx={p.x}
            cy={p.y}
            r={hover === i || i === peak ? 5.5 : 4.5}
            fill={i === peak ? "#2563EB" : "#FFFFFF"}
            stroke={i === peak ? "#FFFFFF" : "#2563EB"}
            strokeWidth="2.5"
          />
        ))}

        {hover === null && (
          <g transform={`translate(${real[peak].x}, ${real[peak].y - 14})`}>
            <rect x="-62" y="-20" width="124" height="20" rx="4" fill="#0F172A" />
            <text y="-6" fontSize="10" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
              Pico {data[peak].label} · {data[peak].value} p/h
            </text>
          </g>
        )}

        {data.map((d, i) => (
          <text
            key={d.label}
            x={x(d.label)}
            y={H - 10}
            fontSize="11"
            fontWeight={i === peak ? 800 : 500}
            fill={i === peak ? "#2563EB" : "#64748B"}
            textAnchor="middle"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {active && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-ink px-3 py-2 text-[11px] text-white shadow-lg"
          style={{ left: `${(real[hover].x / W) * 100}%`, top: `calc(${(real[hover].y / H) * 100}% - 12px)` }}
        >
          <p className="font-extrabold">{active.label} hrs</p>
          <p className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap">
            <span className="size-2 rounded-full bg-brand" /> Ingresos reales: <strong>{active.value} p/h</strong>
          </p>
          <p className="flex items-center gap-1.5 whitespace-nowrap text-white/70">
            <span className="h-0.5 w-2.5 bg-slate-300" /> Tendencia normal: {active.trend} p/h
          </p>
        </div>
      )}
    </div>
  );
}

export function FlowLegend() {
  return (
    <div className="flex items-center gap-4 text-[11.5px] font-semibold text-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-brand" /> Ingresos reales
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-4 border-t-2 border-dashed border-slate-300" /> Tendencia normal
      </span>
    </div>
  );
}

/** Histograma por hora; el pico se marca en ámbar ("zona crítica"). */
export function HourlyBars({ data }: { data: { label: string; value: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value));
  const peak = data.findIndex((d) => d.value === max);

  const shade = (v: number) => (v >= 260 ? "bg-blue-500" : v >= 200 ? "bg-blue-400" : v >= 130 ? "bg-blue-300" : "bg-blue-200");

  return (
    <div className="flex h-[190px] items-end justify-around gap-3 border-b border-slate-200 px-2">
      {data.map((d, i) => {
        const isPeak = i === peak;
        return (
          <div
            key={d.label}
            className="relative flex h-full max-w-[64px] flex-1 cursor-default flex-col items-center justify-end"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            {(isPeak && hover === null) || hover === i ? (
              <span className="mb-1.5 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                {isPeak ? `${d.value} PICO` : `${d.value} escaneos`}
              </span>
            ) : null}
            <div
              className={`w-full rounded-t-[4px] transition-opacity ${isPeak ? "bg-amber-500" : shade(d.value)} ${
                hover !== null && hover !== i ? "opacity-60" : ""
              }`}
              style={{ height: `${(d.value / max) * 78}%` }}
            />
            <span
              className={`absolute -bottom-6 text-[11px] ${isPeak ? "font-extrabold text-amber-700" : "font-medium text-muted"}`}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
