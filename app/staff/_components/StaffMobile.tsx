"use client";

import { useCallback, useEffect, useState } from "react";
import { findTicket, isDocFormat, normalize, station } from "../_lib/tickets";
import { feedback, type Incident, type Status, type useValidator, type Validation } from "../_lib/useValidator";
import Scanner from "./Scanner";
import { Logo, PassBadge, StatusTag, formatDoc, initials, statusMeta } from "./shared";

/* =========================================================
   Staff — móvil. Pensado para una mano y escaneo continuo:
   botones grandes, feedback con vibración + tono, y reanudación
   automática tras un acceso válido.
   ========================================================= */

type Tab = "scan" | "manual" | "history" | "incident";
type V = ReturnType<typeof useValidator>;

// Debe coincidir con la duración de `animate-grow` en globals.css
const AUTO_NEXT_MS = 2500;

export default function StaffMobile({ v }: { v: V }) {
  const [tab, setTab] = useState<Tab>("scan");
  const [incidentPreset, setIncidentPreset] = useState<string | null>(null);

  const report = (r: Validation) => {
    setIncidentPreset(r.status === "used" ? "Reingreso / Boleto Duplicado" : "Boleto Falso / Clonado Sospechoso");
    setTab("incident");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <Logo small />
            <span className="rounded border border-brand-border bg-brand-surface px-1.5 py-0.5 text-[8.5px] font-extrabold tracking-[0.06em] text-brand">STAFF</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" /> En línea
            </span>
            <span className="flex size-7 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white" title={station.operator.name}>
              {station.operator.initials}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-1.5 text-[11px]">
          <span className="font-bold text-ink">
            ▣ {station.gate} • {station.sector}
          </span>
          <span className="font-semibold text-muted">{station.operator.shift}</span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">
        {tab === "scan" && <ScanTab v={v} onReport={report} onManual={() => setTab("manual")} onHistory={() => setTab("history")} />}
        {tab === "manual" && <ManualTab v={v} onReport={report} />}
        {tab === "history" && <HistoryTab v={v} />}
        {tab === "incident" && (
          <IncidentTab
            key={incidentPreset ?? "none"}
            preset={incidentPreset}
            incidents={v.incidents}
            onSubmit={(i) => {
              v.reportIncident(i);
              setIncidentPreset(null);
            }}
            onCancel={() => setTab("scan")}
          />
        )}
      </main>

      <TabBar tab={tab} onChange={setTab} />
    </div>
  );
}

/* ---------------- Escanear QR ---------------- */

function ScanTab({ v, onReport, onManual, onHistory }: { v: V; onReport: (r: Validation) => void; onManual: () => void; onHistory: () => void }) {
  const [result, setResult] = useState<Validation | null>(null);
  const { validate } = v;

  const onDetect = useCallback(
    (text: string) => {
      const r = validate(text, "qr");
      feedback(r.status);
      setResult(r);
    },
    [validate],
  );

  // Acceso válido: vuelve a escanear solo. Alertas: esperan a que el staff confirme.
  useEffect(() => {
    if (result?.status !== "valid") return;
    const t = setTimeout(() => setResult(null), AUTO_NEXT_MS);
    return () => clearTimeout(t);
  }, [result]);

  return (
    <div className="space-y-4">
      <Scanner
        onDetect={onDetect}
        paused={!!result}
        flash={result?.status ?? null}
        onManual={onManual}
        className={`w-full transition-[height] duration-300 ${result ? "h-[26dvh] min-h-[180px]" : "h-[46dvh] min-h-[280px]"}`}
      />

      {result ? (
        <>
          <ResultCard r={result} />
          <button
            type="button"
            onClick={() => setResult(null)}
            className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand py-4 text-[15px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.5)] active:bg-brand-dark"
          >
            {result.status === "valid" && (
              <span key={result.id} className="absolute inset-y-0 left-0 animate-grow bg-white/15" />
            )}
            <span className="relative">Siguiente escaneo →</span>
          </button>
          {result.status !== "valid" && (
            <button
              type="button"
              onClick={() => onReport(result)}
              className="w-full cursor-pointer rounded-xl border border-rose-200 bg-white py-3 text-[13px] font-bold text-rose-600 active:bg-rose-50"
            >
              ⚠ Reportar incidencia
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-[12px] text-muted">Apunta la cámara al QR del boleto. La lectura es automática.</p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12.5px] font-extrabold text-ink">Últimos registros</span>
          <button type="button" onClick={onHistory} className="cursor-pointer text-[11.5px] font-bold text-brand">
            Ver historial →
          </button>
        </div>
        <ul className="divide-y divide-slate-100">
          {v.history.slice(0, 3).map((h) => (
            <li key={h.id} className="flex items-center justify-between py-2">
              <span className="flex min-w-0 items-center gap-2.5">
                <Avatar status={h.status} name={h.ticket?.holder} />
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-bold text-ink">{h.ticket?.holder ?? "Código no registrado"}</span>
                  <span className="block truncate text-[10.5px] text-faint">
                    {h.ticket?.code ?? h.input} • {h.ticket?.pass ?? "Desconocido"}
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className={`block text-[10.5px] font-bold ${statusMeta[h.status].text}`}>{statusMeta[h.status].short}</span>
                <span className="block font-mono text-[10px] text-faint">{h.time}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Avatar({ status, name }: { status: Status; name?: string }) {
  const tone = status === "valid" ? "bg-emerald-50 text-emerald-600" : status === "used" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600";
  return (
    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold ${tone}`}>
      {name ? initials(name) : "?"}
    </span>
  );
}

export function ResultCard({ r }: { r: Validation }) {
  const m = statusMeta[r.status];
  const t = r.ticket;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-live="assertive">
      <div className={`flex items-center justify-between px-4 py-3 text-white ${m.bg}`}>
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/25 text-xl font-black">{m.icon}</span>
          <div>
            <p className="text-[17px] font-extrabold leading-tight">{m.title}</p>
            <p className="text-[11.5px] font-semibold text-white/85">{t ? `${t.pass} • ${t.code}` : m.sub}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[13px] font-bold">{r.time}</p>
          <p className="text-[9.5px] text-white/80">{r.ms} ms</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div>
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">ASISTENTE</p>
          <p className="text-[14px] font-extrabold text-ink">{t?.holder ?? "No registrado"}</p>
          <p className="font-mono text-[10.5px] text-muted">{t ? `DOC ${t.doc}` : r.input.slice(0, 28)}</p>
        </div>
        <div>
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">PUERTA ASIGNADA</p>
          <p className="text-[13px] font-extrabold text-brand">{t?.zone ?? "—"}</p>
          <p className="text-[10.5px] text-muted">{t?.gate ?? ""}</p>
        </div>
        {t && !t.adult && r.status === "valid" && (
          <p className="col-span-2 rounded-lg bg-amber-50 px-3 py-2 text-[11.5px] font-bold text-amber-700">⚠ Menor de edad: verificar acompañante y no entregar pulsera de bar.</p>
        )}
        <p className={`col-span-2 rounded-lg border px-3 py-2 text-[11.5px] font-semibold ${m.soft}`}>{m.instruction(r)}</p>
      </div>
    </article>
  );
}

/* ---------------- Ingreso manual por documento ---------------- */

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "K", "0", "⌫"];

function ManualTab({ v, onReport }: { v: V; onReport: (r: Validation) => void }) {
  const [doc, setDoc] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Validation | null>(null);

  const formatted = formatDoc(doc);
  const valid = isDocFormat(doc);
  const ticket = searched ? findTicket(doc) : undefined;

  const press = (k: string) => {
    setSearched(false);
    setResult(null);
    if (k === "⌫") setDoc((d) => d.slice(0, -1));
    else setDoc((d) => (normalize(d).length >= 12 ? d : d + k));
  };

  const clear = () => {
    setDoc("");
    setSearched(false);
    setResult(null);
  };

  const confirm = () => {
    const r = v.validate(doc, "manual");
    feedback(r.status);
    setResult(r);
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[17px] font-extrabold text-ink">Ingreso Manual por ID</h2>
        <p className="text-[11.5px] text-muted">Usa el documento (RUT / cédula / DNI) si el QR no se puede leer.</p>
      </div>

      <div className={`rounded-2xl border-2 bg-white px-4 py-3 ${valid ? "border-brand" : "border-slate-200"}`}>
        <div className="flex items-center justify-between text-[9.5px] font-extrabold tracking-[0.06em]">
          <span className="text-faint">DOCUMENTO INGRESADO</span>
          {doc && <span className={valid ? "text-emerald-600" : "text-amber-600"}>{valid ? "✓ Formato válido" : "Formato incompleto"}</span>}
        </div>
        <p className="mt-1 min-h-9 font-mono text-[28px] font-bold tracking-tight text-ink">
          {formatted || <span className="text-slate-300">00.000.000-0</span>}
        </p>
      </div>

      {result ? (
        <>
          <ResultCard r={result} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={clear} className="cursor-pointer rounded-xl bg-brand py-3 text-[13px] font-bold text-white active:bg-brand-dark">
              Nuevo ingreso
            </button>
            {result.status !== "valid" ? (
              <button type="button" onClick={() => onReport(result)} className="cursor-pointer rounded-xl border border-rose-200 bg-white py-3 text-[13px] font-bold text-rose-600">
                ⚠ Reportar
              </button>
            ) : (
              <span />
            )}
          </div>
        </>
      ) : searched ? (
        ticket ? (
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-surface text-[12px] font-extrabold text-brand">{initials(ticket.holder)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-extrabold text-ink">{ticket.holder}</p>
                <p className="font-mono text-[10.5px] text-muted">DOC {ticket.doc} • Titular</p>
              </div>
              <PassBadge pass={ticket.pass} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-[11.5px]">
              <div>
                <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">SECTOR / ZONA</p>
                <p className="font-bold text-ink">{ticket.zone}</p>
                <p className="text-faint">{ticket.code}</p>
              </div>
              <div>
                <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">PUERTA ASIGNADA</p>
                <p className="font-bold text-brand">{ticket.gate}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={confirm}
              className="mt-4 w-full cursor-pointer rounded-xl bg-brand py-3.5 text-[14px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.5)] active:bg-brand-dark"
            >
              Validar e Ingresar Asistente
            </button>
          </article>
        ) : (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12.5px] font-semibold text-rose-700">
            ✕ No hay boletos asociados al documento {formatted}. Verifica el número o reporta la incidencia.
          </p>
        )
      ) : null}

      {!result && (
        <>
          <p className="pt-1 text-[10px] font-extrabold tracking-[0.06em] text-faint">TECLADO NUMÉRICO DE VALIDACIÓN</p>
          <div className="grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => press(k)}
                aria-label={k === "⌫" ? "Borrar" : k}
                className={`h-14 cursor-pointer select-none rounded-xl border text-[20px] font-bold transition-colors active:scale-[0.97] ${
                  k === "⌫"
                    ? "border-rose-100 bg-rose-50 text-rose-500 active:bg-rose-100"
                    : k === "K"
                      ? "border-brand-border bg-brand-surface text-brand active:bg-blue-100"
                      : "border-slate-200 bg-white text-ink active:bg-slate-100"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={clear} className="cursor-pointer rounded-xl border border-slate-200 bg-white py-3.5 text-[13px] font-bold text-ink active:bg-slate-100">
              Limpiar Campo
            </button>
            <button
              type="button"
              disabled={!valid}
              onClick={() => setSearched(true)}
              className="cursor-pointer rounded-xl bg-brand py-3.5 text-[13px] font-bold text-white active:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              🔍 Buscar en Base
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Historial ---------------- */

function HistoryTab({ v }: { v: V }) {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");
  const query = normalize(q);

  const rows = v.history.filter(
    (h) =>
      (filter === "all" || h.status === filter) &&
      (!query || normalize(`${h.ticket?.holder ?? ""}${h.ticket?.code ?? h.input}${h.ticket?.doc ?? ""}`).includes(query)),
  );

  const tabs: { id: "all" | Status; label: string }[] = [
    { id: "all", label: `Todos (${v.stats.total})` },
    { id: "valid", label: `Exitosos (${v.stats.ok})` },
    { id: "used", label: `Duplicados (${v.stats.duplicates})` },
    { id: "invalid", label: `Inválidos (${v.stats.invalid})` },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-extrabold tracking-[0.06em] text-faint">{station.gate.toUpperCase()} • MOLINETE 4</p>
          <h2 className="text-[17px] font-extrabold text-ink">Historial de Escaneos</h2>
        </div>
        <div className="text-right">
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">TOTAL TURNO</p>
          <p className="text-[20px] font-extrabold text-ink">{v.stats.total}</p>
        </div>
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar nombre, código o documento..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none placeholder:text-faint focus:border-brand"
      />

      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${
              filter === t.id ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {rows.map((h) => (
          <li
            key={h.id}
            className={`rounded-xl border bg-white p-3 ${h.status === "used" ? "border-amber-200" : h.status === "invalid" ? "border-rose-200" : "border-slate-200"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-extrabold text-ink">{h.ticket?.holder ?? "Código no registrado"}</p>
                <p className="font-mono text-[10.5px] text-faint">
                  {h.ticket?.code ?? h.input} {h.method === "manual" && "• Manual"}
                </p>
              </div>
              <span className="shrink-0 font-mono text-[11px] font-bold text-muted">{h.time}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-[10.5px] font-bold uppercase text-brand">{h.ticket?.zone ?? "—"}</span>
              <StatusTag status={h.status} firstGate={h.firstUse?.gate} />
            </div>
            {h.status === "used" && h.firstUse && (
              <p className="mt-1.5 text-[10.5px] font-semibold text-amber-700">
                Re-ingreso: primer uso {h.firstUse.time} hrs en {h.firstUse.gate}
              </p>
            )}
          </li>
        ))}
        {rows.length === 0 && <li className="py-8 text-center text-[12.5px] text-muted">Sin registros.</li>}
      </ul>
    </div>
  );
}

/* ---------------- Reportar incidencia ---------------- */

const INCIDENT_TYPES = [
  "Boleto Falso / Clonado Sospechoso",
  "Reingreso / Boleto Duplicado",
  "Documento no coincide con titular",
  "Menor de edad sin acompañante",
  "Falla de molinete / terminal",
  "Altercado en fila",
];
const URGENCIES: Incident["urgency"][] = ["Baja", "Media", "Alta", "Crítica"];

function IncidentTab({
  preset,
  incidents,
  onSubmit,
  onCancel,
}: {
  preset: string | null;
  incidents: Incident[];
  onSubmit: (i: Omit<Incident, "id" | "time">) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState(preset ?? INCIDENT_TYPES[0]);
  const [urgency, setUrgency] = useState<Incident["urgency"]>(preset ? "Alta" : "Media");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState(0);
  const [sent, setSent] = useState(false);

  const urgencyStyle = (u: Incident["urgency"]) =>
    urgency !== u
      ? "border-slate-200 bg-white text-muted"
      : u === "Crítica" || u === "Alta"
        ? "border-rose-500 bg-rose-500 text-white"
        : u === "Media"
          ? "border-amber-400 bg-amber-400 text-ink"
          : "border-brand bg-brand text-white";

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ type, urgency, notes });
        setNotes("");
        setFiles(0);
        setSent(true);
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-extrabold text-ink">Reportar Incidencia</h2>
        <span className={`rounded px-2 py-0.5 text-[9.5px] font-extrabold ${urgency === "Crítica" || urgency === "Alta" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"}`}>
          PRIORIDAD {urgency.toUpperCase()}
        </span>
      </div>

      {sent && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12.5px] font-bold text-emerald-700">
          ✓ Alerta enviada a Seguridad. Un supervisor fue notificado.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 text-[11.5px]">
        <div>
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">PUERTA</p>
          <p className="font-bold text-ink">{station.gate}</p>
        </div>
        <div>
          <p className="text-[9.5px] font-extrabold tracking-[0.06em] text-faint">OPERADOR</p>
          <p className="font-bold text-ink">
            {station.operator.name} ({station.operator.initials})
          </p>
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-bold text-ink">Tipo de Incidencia</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[13px] font-semibold text-ink outline-none focus:border-brand"
        >
          {INCIDENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-1.5 block text-[12px] font-bold text-ink">Nivel de Urgencia</span>
        <div className="grid grid-cols-4 gap-1.5">
          {URGENCIES.map((u) => (
            <button key={u} type="button" onClick={() => setUrgency(u)} className={`cursor-pointer rounded-lg border py-2.5 text-[12px] font-bold ${urgencyStyle(u)}`}>
              {u}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[12px] font-bold text-ink">Notas Breves de Incidencia</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Describe lo ocurrido: comportamiento, código leído, documento presentado..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[13px] outline-none placeholder:text-faint focus:border-brand"
        />
      </label>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-3 text-[12.5px] font-bold text-muted active:bg-slate-50">
        📷 {files ? `${files} foto(s) adjunta(s)` : "Tomar o subir evidencia"}
        <input type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={(e) => setFiles(e.target.files?.length ?? 0)} />
      </label>

      <button type="submit" className="w-full cursor-pointer rounded-xl bg-rose-500 py-4 text-[14px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(244,63,94,0.5)] active:bg-rose-600">
        ⚠ Emitir Alerta a Seguridad
      </button>
      <button type="button" onClick={onCancel} className="w-full cursor-pointer py-2 text-[12.5px] font-bold text-brand">
        ← Cancelar y volver al escáner
      </button>

      {incidents.length > 0 && (
        <section className="space-y-2 pt-2">
          <p className="text-[10px] font-extrabold tracking-[0.06em] text-faint">ENVIADAS EN ESTE TURNO</p>
          {incidents.map((i) => (
            <div key={i.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px]">
              <div className="flex justify-between">
                <strong className="text-ink">{i.type}</strong>
                <span className="font-mono text-[10.5px] text-faint">{i.time}</span>
              </div>
              <p className="text-[11px] text-muted">
                Urgencia {i.urgency}
                {i.notes && ` • ${i.notes}`}
              </p>
            </div>
          ))}
        </section>
      )}
    </form>
  );
}

/* ---------------- Barra inferior ---------------- */

function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "scan", label: "Escanear QR", icon: <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" /> },
    {
      id: "manual",
      label: "Ingreso ID",
      icon: (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M6 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 13h3" />
        </>
      ),
    },
    {
      id: "history",
      label: "Historial",
      icon: (
        <>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5M12 7v5l3 2" />
        </>
      ),
    },
    { id: "incident", label: "Crear Alerta", icon: <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" /> },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const active = it.id === tab;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onChange(it.id)}
                className={`flex w-full cursor-pointer flex-col items-center gap-1 py-2.5 text-[10.5px] font-bold ${active ? "text-brand" : "text-faint"}`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full ${active ? "bg-brand-surface" : ""}`}>
                  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {it.icon}
                  </svg>
                </span>
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
