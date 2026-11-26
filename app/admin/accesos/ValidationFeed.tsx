"use client";

import { useState } from "react";
import { validations } from "../_data";

type Filter = "all" | "ok" | "alert";

export default function ValidationFeed() {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = validations.filter((v) => filter === "all" || v.kind === filter);

  const tabs: { id: Filter; label: React.ReactNode }[] = [
    { id: "all", label: "Todos (1,453)" },
    { id: "ok", label: "Exitosos (1,450)" },
    {
      id: "alert",
      label: (
        <span className="flex items-center gap-1 text-amber-600">
          Alertas (10) <span className="size-1.5 rounded-full bg-amber-500" />
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-[16px] font-extrabold text-ink">
            Registro de Validaciones en Vivo <span className="size-2 animate-pulse-dot rounded-full bg-emerald-500" />
          </h3>
          <p className="mt-0.5 text-[12px] text-muted">Actualización en flujo continuo por WebSocket • Eventos procesados en milisegundos</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-bold transition-colors ${
                filter === t.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-2.5">
        {rows.map((v, i) =>
          v.kind === "ok" ? (
            <li key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-emerald-50 text-[13px] font-black text-emerald-600">✓</span>
                <div>
                  <p className="text-[13px]">
                    <strong className="text-ink">{v.name}</strong> <span className="text-muted">{v.verb}</span>{" "}
                    <strong className="text-ink">{v.gate}</strong>
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-faint">
                    <span className="rounded bg-slate-100 px-1.5 font-mono">{v.qr}</span> • {v.terminal} • {v.ago}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                ✓ Válido • Ingreso Permitido
              </span>
            </li>
          ) : (
            <li key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-[1.5px] border-rose-200 bg-rose-50 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-full bg-rose-100 text-[13px] font-black text-rose-600">⚠</span>
                <div>
                  <p className="text-[13px]">
                    <strong className="text-rose-600">{v.title}</strong> <span className="text-muted">en {v.gate}</span>
                  </p>
                  <p className="mt-0.5 text-[10.5px] font-semibold text-rose-700">
                    <span className="font-mono">{v.ticket}</span> • {v.detail} • {v.ago}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-rose-300 bg-white px-2.5 py-1 text-[11px] font-extrabold text-rose-600">
                ⛔ Acceso Denegado • Duplicado
              </span>
            </li>
          ),
        )}
      </ul>

      <p className="mt-4 flex items-center gap-1.5 text-[11.5px] text-muted">
        <span className="size-1.5 rounded-full bg-emerald-500" /> Canal WebSocket cifrado TLS 1.3 activo • Mostrando 1 - {rows.length} de 1,450 validaciones
      </p>
    </>
  );
}
