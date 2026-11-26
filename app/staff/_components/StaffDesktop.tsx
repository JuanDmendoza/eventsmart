"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { station } from "../_lib/tickets";
import { feedback, type Status, type useValidator, type Validation } from "../_lib/useValidator";
import Scanner from "./Scanner";
import { Logo, PassBadge, StatusTag, formatDoc, statusMeta } from "./shared";

/* =========================================================
   Staff — escritorio (puesto fijo con webcam / lector USB).
   Un lector USB de QR "teclea" el código + Enter: el campo
   manual queda enfocado para recibirlo directamente.
   ========================================================= */

type V = ReturnType<typeof useValidator>;

const RESUME_MS = 3000;
const fmt = (n: number) => n.toLocaleString("en-US");

export default function StaffDesktop({ v }: { v: V }) {
  const [last, setLast] = useState<Validation | null>(null);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState("");
  const { validate } = v;

  const run = useCallback(
    (input: string, method: Validation["method"]) => {
      const r = validate(input, method);
      feedback(r.status);
      setLast(r);
      setPaused(true);
    },
    [validate],
  );

  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), RESUME_MS);
    return () => clearTimeout(t);
  }, [paused, last]);

  const occ = station.occupancy;
  const occPct = Math.round((occ.current / occ.max) * 100);

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" title="Volver al panel">
              <Logo />
            </Link>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-[14px] font-extrabold text-ink">EventSmart Access — {station.gate}</p>
              <p className="text-[11.5px] text-muted">
                {station.event} • <span className="font-semibold text-brand">{station.turnstile}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-1.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">{station.operator.initials}</span>
            <span className="leading-tight">
              <span className="block text-[12.5px] font-bold text-ink">{station.operator.name}</span>
              <span className="block text-[10.5px] text-muted">{station.operator.shift}</span>
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1320px] gap-5 px-6 py-6 lg:grid-cols-[400px_1fr]">
        {/* Columna izquierda: cámara + manual */}
        <div className="space-y-5">
          <Scanner
            onDetect={(t) => run(t, "qr")}
            paused={paused}
            flash={paused ? last?.status : null}
            hint="Acerque el código QR del boleto al lector"
            label="Cámara del puesto • Molinete"
            className="aspect-square w-full"
          />

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14px] font-extrabold text-ink">Validación Manual por Cédula / DNI</h3>
                <p className="text-[11.5px] text-muted">Para pulseras rotas, celulares sin batería o contingencias.</p>
              </div>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700">FALLBACK</span>
            </div>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!manual.trim()) return;
                run(manual, "manual");
                setManual("");
              }}
            >
              <input
                autoFocus
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="10.892.441-K o código AA-094"
                className="min-w-0 flex-1 rounded-lg border-2 border-slate-200 px-3 py-2.5 font-mono text-[14px] font-bold text-ink outline-none placeholder:font-sans placeholder:text-[12.5px] placeholder:font-normal placeholder:text-faint focus:border-brand"
              />
              <button type="submit" className="cursor-pointer rounded-lg bg-brand px-4 text-[12.5px] font-bold text-white hover:bg-brand-dark">
                ✓ Validar
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted">
              <span className="font-semibold">Búsqueda rápida:</span>
              {["10892441K", "AA-094", "VIP-103", "TKT-99214"].map((s) => (
                <button key={s} type="button" onClick={() => setManual(s.includes("-") ? s : formatDoc(s))} className="cursor-pointer rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono hover:bg-slate-100">
                  {s.includes("-") ? s : formatDoc(s)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-right text-[10.5px] text-faint">Base Local Caché: {fmt(station.cacheSize)} pases</p>
          </section>
        </div>

        {/* Columna derecha: resultado + historial */}
        <div className="min-w-0 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {(["valid", "used", "invalid"] as Status[]).map((s) => {
              const m = statusMeta[s];
              const on = last?.status === s;
              return (
                <div key={s} className={`rounded-xl border-2 px-3 py-2 transition-all ${on ? `${m.soft} border-current shadow-sm` : "border-slate-200 bg-white text-faint"}`}>
                  <p className="text-[11px] font-extrabold">
                    {m.icon} {s === "valid" ? "VÁLIDO" : s === "used" ? "YA UTILIZADO" : "DENEGADO"}
                  </p>
                  <p className="text-[10.5px] font-semibold opacity-80">{m.sub}</p>
                </div>
              );
            })}
          </div>

          {last ? <BigResult r={last} /> : <Waiting />}

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-extrabold text-ink">
                Historial en Vivo de Validaciones <span className="rounded bg-slate-100 px-1.5 text-[10px] font-bold text-muted">Últimos 6</span>
              </h3>
              <button type="button" onClick={() => exportCsv(v.history)} className="cursor-pointer text-[11.5px] font-bold text-rose-600 hover:underline">
                ⤓ Exportar Auditoría CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-extrabold tracking-[0.06em] text-muted">
                    <th className="py-2">HORA</th>
                    <th>CÓDIGO BOLETO</th>
                    <th>NOMBRE ASISTENTE</th>
                    <th>TIPO PASE</th>
                    <th>ESTADO / RESULTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {v.history.slice(0, 6).map((h) => (
                    <tr key={h.id} className={h.status === "used" ? "bg-amber-50/60" : h.status === "invalid" ? "bg-rose-50/60" : ""}>
                      <td className="py-2 font-mono font-bold text-ink">{h.time}</td>
                      <td className="font-mono text-muted">{h.ticket?.code ?? h.input.slice(0, 14)}</td>
                      <td className={`font-bold ${h.ticket ? "text-ink" : "text-rose-600"}`}>{h.ticket?.holder ?? "Código No Registrado"}</td>
                      <td>
                        <PassBadge pass={h.ticket?.pass} />
                      </td>
                      <td>
                        <StatusTag status={h.status} firstGate={h.firstUse?.gate} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-[11px]">
              <span className="font-extrabold tracking-[0.06em] text-muted">OCUPACIÓN PUERTA NORTE:</span>
              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <span className="h-full bg-emerald-500" style={{ width: `${Math.min(occPct, 50)}%` }} />
                <span className="h-full bg-amber-400" style={{ width: `${Math.max(0, occPct - 50)}%` }} />
              </div>
              <span className="font-bold text-ink">
                {fmt(occ.current)} / {fmt(occ.max)} ({occPct}%)
              </span>
              <span className="flex items-center gap-1 text-muted">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Molinete sincronizado
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Waiting() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-center">
      <span className="text-3xl">⌁</span>
      <p className="mt-2 text-[15px] font-extrabold text-ink">Esperando lectura…</p>
      <p className="text-[12px] text-muted">Escanee un QR o ingrese un documento manualmente.</p>
    </div>
  );
}

function BigResult({ r }: { r: Validation }) {
  const m = statusMeta[r.status];
  const t = r.ticket;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-live="assertive">
      <div className={`flex items-center justify-between px-6 py-5 text-white ${m.bg}`}>
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/25 text-3xl font-black">{m.icon}</span>
          <div>
            <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9.5px] font-extrabold tracking-[0.06em]">
              CONFIRMACIÓN EN {(r.ms / 1000).toFixed(2)}s • {r.method === "qr" ? "QR" : "MANUAL"}
            </span>
            <p className="mt-1 text-[26px] font-extrabold leading-none">{r.status === "valid" ? "ACCESO VÁLIDO" : m.title}</p>
            <p className="mt-1 text-[12.5px] font-semibold text-white/85">{t ? `${t.pass === "General" ? "Entrada General" : t.pass} ${t.code}` : m.sub}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-white/80">HORA EXACTA</p>
          <p className="font-mono text-[24px] font-bold">{r.time}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-6 py-5">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.06em] text-faint">TITULAR DEL BOLETO</p>
          <p className="text-[19px] font-extrabold text-ink">{t?.holder ?? "No registrado"}</p>
          <p className="text-[12px] text-muted">{t ? <>Documento: <strong className="font-mono text-ink">{t.doc}</strong></> : <span className="font-mono">Leído: {r.input.slice(0, 40)}</span>}</p>
          {t && (
            <span className={`mt-2 inline-block rounded-md border px-2 py-0.5 text-[10.5px] font-bold ${t.adult ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              {t.adult ? "✓ Mayor de Edad (+18)" : "⚠ Menor de edad"}
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.06em] text-faint">ZONA ASIGNADA</p>
          <p className="text-[16px] font-extrabold text-brand">{t?.zone ?? "—"}</p>
          <p className="text-[12px] text-muted">{t?.gate}</p>
          {r.firstUse && (
            <p className="mt-2 text-[11.5px] font-bold text-amber-700">
              Primer ingreso: {r.firstUse.time} hrs en {r.firstUse.gate}
            </p>
          )}
        </div>
      </div>

      <div className={`mx-6 mb-5 rounded-xl border px-4 py-3 ${m.soft}`}>
        <p className="text-[10px] font-extrabold tracking-[0.06em]">INSTRUCCIÓN PARA EL PERSONAL DE PUERTA:</p>
        <p className="text-[13px] font-bold">{m.instruction(r)}</p>
      </div>
    </article>
  );
}

function exportCsv(rows: Validation[]) {
  const header = "hora,codigo,titular,documento,pase,estado,metodo";
  const body = rows.map((h) =>
    [h.time, h.ticket?.code ?? h.input, h.ticket?.holder ?? "", h.ticket?.doc ?? "", h.ticket?.pass ?? "", statusMeta[h.status].short, h.method]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header, ...body].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `auditoria-${station.gate.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
