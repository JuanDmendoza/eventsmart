import { venueCapacity } from "./data";

const fmt = (n: number) => n.toLocaleString("en-US");

function Bar({ pct, dark = false }: { pct: number; dark?: boolean }) {
  // Verde hasta 70%, ámbar desde ahí (zona de alerta de aforo)
  const green = Math.min(pct, 70);
  const amber = Math.max(0, pct - 70);
  return (
    <div className={`flex h-2 overflow-hidden rounded-full ${dark ? "bg-white/20" : "bg-slate-100"}`}>
      <span className="h-full bg-emerald-500" style={{ width: `${green}%` }} />
      <span className="h-full bg-amber-400" style={{ width: `${amber}%` }} />
    </div>
  );
}

/** Variante "glass" para el hero azul (escritorio). */
export function CapacityGlass() {
  const { current, max, activeTurnstiles } = venueCapacity;
  const pct = Math.round((current / max) * 100);
  return (
    <div className="w-full max-w-[340px] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.08em] text-white/80">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" />
          </svg>
          AFORO DEL RECINTO
        </span>
        <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">{pct}% Ocupado</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-[34px] font-extrabold tracking-tight text-white">{fmt(current)}</span>
        <span className="text-[11px] text-white/70">/ {fmt(max)} asistentes</span>
      </div>
      <Bar pct={pct} dark />
      <div className="mt-3 flex items-center justify-between text-[11px] text-white/80">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="size-1.5 rounded-full bg-emerald-400" /> Puerta A Palcos
        </span>
        <span>{activeTurnstiles} molinetes activos</span>
      </div>
    </div>
  );
}

/** Variante tarjeta blanca (teléfono). */
export function CapacityCard() {
  const { current, max, activeTurnstiles, waitMinutes } = venueCapacity;
  const pct = Math.round((current / max) * 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
          <span className="size-2 animate-pulse-dot rounded-full bg-emerald-500" /> Aforo en Vivo Recinto
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">{pct}% Ocupado</span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-ink">{fmt(current)}</span>
        <span className="text-[11px] text-faint">Capacidad: {fmt(max)}</span>
      </div>
      <div className="mt-1.5">
        <Bar pct={pct} />
      </div>
      <p className="mt-2.5 text-[11px] text-muted">
        <strong className="text-ink">Puerta A Palcos:</strong> {activeTurnstiles} molinetes activos ·{" "}
        <span className="font-bold text-emerald-600">+{waitMinutes} min espera</span>
      </p>
    </div>
  );
}
