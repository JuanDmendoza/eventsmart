"use client";

import { useState } from "react";
import { Badge, Progress, fmt, pct, type Tone } from "../_components/ui";
import { events, type EventStatus } from "../_data";

const statusInfo: Record<EventStatus, { label: string; tone: Tone; dot?: boolean }> = {
  live: { label: "En curso", tone: "green", dot: true },
  selling: { label: "Activo / En Venta", tone: "blue" },
  upcoming: { label: "Próximo", tone: "gray" },
  done: { label: "Finalizado", tone: "gray" },
};

const filters: { id: "all" | EventStatus; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "selling", label: "Activos / En Venta" },
  { id: "upcoming", label: "Próximos" },
  { id: "done", label: "Finalizados" },
];

// "Activos" incluye el evento en curso
const matches = (f: "all" | EventStatus, s: EventStatus) => f === "all" || f === s || (f === "selling" && s === "live");

export default function EventsList() {
  const [filter, setFilter] = useState<"all" | EventStatus>("all");
  const [q, setQ] = useState("");

  const visible = events.filter(
    (e) => matches(filter, e.status) && `${e.name} ${e.venue}`.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {filters.map((f) => {
            const count = events.filter((e) => matches(f.id, e.status)).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${
                  filter === f.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
        <label className="relative flex w-full max-w-[300px] items-center">
          <svg className="pointer-events-none absolute left-3 text-faint" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar festival por nombre o sede..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[12.5px] outline-none placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/12"
          />
        </label>
      </div>

      <div className="space-y-3">
        {visible.map((e) => {
          const p = pct(e.reserved, e.max);
          const almostFull = e.status !== "done" && p >= 90;
          const done = e.status === "done";
          const s = statusInfo[e.status];
          return (
            <article
              key={e.id}
              className={`flex flex-wrap items-center gap-5 rounded-2xl border bg-white p-4 shadow-sm ${
                almostFull ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200"
              } ${done ? "opacity-75" : ""}`}
            >
              <div
                className={`flex w-[68px] flex-col items-center rounded-xl py-3 ${
                  e.status === "live" ? "bg-brand-surface text-brand" : "bg-slate-100 text-ink"
                } ${done ? "text-faint!" : ""}`}
              >
                <span className="text-2xl font-extrabold leading-none">{e.day}</span>
                <span className="mt-1 text-[10px] font-bold tracking-[0.08em] text-muted">{e.month}</span>
              </div>

              <div className="min-w-[220px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-[16px] font-extrabold ${done ? "text-muted" : "text-ink"}`}>{e.name}</h3>
                  <Badge tone={s.tone} dot={s.dot}>
                    {s.label}
                  </Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] font-medium text-muted">
                  <span>📅 {e.dates}</span>
                  <span>📍 {e.venue}</span>
                  {e.genre && <span>🎵 {e.genre}</span>}
                </div>
              </div>

              <div className="w-full max-w-[230px] space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11.5px] text-muted">
                  {almostFull ? (
                    <Badge tone="amber">⚠ ¡{Math.round(p)}% Reservado!</Badge>
                  ) : (
                    <span className="font-semibold">{done ? "Aforo Total Completado" : "Aforo Reservado"}</span>
                  )}
                  <span>
                    <strong className={almostFull ? "text-amber-700" : "text-ink"}>{fmt(e.reserved)}</strong> / {fmt(e.max)}
                    {!almostFull && !done && <strong className="ml-1 text-brand">({p}%)</strong>}
                  </span>
                </div>
                <Progress value={p} color={done ? "bg-slate-400" : almostFull ? "bg-amber-500" : "bg-brand"} />
              </div>

              <div className="flex gap-2">
                {done ? (
                  <>
                    <ActionButton>Ver Historial</ActionButton>
                    <ActionButton>Descargar Rep.</ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton>Editar</ActionButton>
                    <ActionButton>Configurar</ActionButton>
                  </>
                )}
              </div>
            </article>
          );
        })}
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-muted">
            No hay festivales con esos filtros.
          </p>
        )}
      </div>
    </>
  );
}

function ActionButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-ink transition-colors hover:bg-slate-50"
    >
      {children}
    </button>
  );
}
