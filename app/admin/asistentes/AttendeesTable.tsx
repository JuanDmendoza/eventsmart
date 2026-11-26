"use client";

import { useState } from "react";
import { Badge, Card, Pagination, TableShell, fmt, type Tone } from "../_components/ui";
import { attendeeTotals as totals, attendees, currentEvent, type AccessType, type AttendeeStatus } from "../_data";

type Filter = "all" | AttendeeStatus;

const filters: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "Todos", count: totals.all },
  { id: "Confirmado", label: "Pendiente de Ingreso", count: totals.pending },
  { id: "Ingresado", label: "Ingresado en Puerta", count: totals.checkedIn },
  { id: "Cancelado", label: "Cancelado / No Asistió", count: totals.cancelled },
];

const accessTone: Record<AccessType, Tone> = { VIP: "purple", General: "blue", "Fast-Track / Palco": "amber" };

export default function AttendeesTable() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const rows = attendees.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (!query || `${a.name} ${a.doc} ${a.code}`.toLowerCase().includes(query)),
  );

  return (
    <>
      <Card className="mb-5">
        <div className="flex flex-wrap gap-3">
          <label className="relative flex min-w-[240px] flex-1 items-center">
            <svg className="pointer-events-none absolute left-3.5 text-faint" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre, documento de identidad o código de boleto..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-[12.5px] outline-none placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/12"
            />
          </label>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-6 rounded-lg border border-slate-200 px-3.5 py-2.5 text-[12.5px] text-muted hover:border-slate-300"
          >
            <span>
              Evento: <strong className="text-ink">{currentEvent.name}</strong>
            </span>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                  filter === f.id ? "border-brand bg-brand text-white" : "border-slate-200 bg-slate-50 text-ink hover:bg-slate-100"
                }`}
              >
                {f.label} ({fmt(f.count)})
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-emerald-600">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" /> Auto-actualización activa
          </span>
        </div>
      </Card>

      <Card>
        <TableShell>
          <table className="w-full min-w-[860px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10.5px] font-extrabold tracking-[0.06em] text-muted">
                <th className="py-2.5">CÓDIGO DE BOLETO</th>
                <th>NOMBRE DEL TITULAR</th>
                <th>DOCUMENTO (CÉDULA)</th>
                <th>TIPO DE ACCESO</th>
                <th>FECHA DE EMISIÓN</th>
                <th>ESTADO</th>
                <th className="text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((a) => (
                <tr key={a.code} className="transition-colors hover:bg-slate-50/70">
                  <td className="py-3">
                    <p className="font-extrabold text-brand">{a.code}</p>
                    <span className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 font-mono text-[10px] text-muted">{a.hash}</span>
                  </td>
                  <td className="font-bold text-ink">{a.name}</td>
                  <td className="font-mono text-slate-600">{a.doc}</td>
                  <td>
                    <Badge tone={accessTone[a.access]}>{a.access}</Badge>
                  </td>
                  <td className="text-[12px] text-muted">{a.issued}</td>
                  <td>
                    <Badge tone={a.status === "Ingresado" ? "green" : a.status === "Confirmado" ? "blue" : "red"} dot={a.status === "Ingresado"}>
                      {a.status}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      title="Ver detalles"
                      className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-muted transition-colors hover:bg-brand-surface hover:text-brand"
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted">
                    Sin resultados en esta página.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableShell>
        <Pagination
          pages={[1, 2]}
          summary={
            <>
              Mostrando <strong className="text-ink">1 - {rows.length}</strong> de <strong className="text-ink">{fmt(totals.all)}</strong> registros
            </>
          }
        />
      </Card>
    </>
  );
}
