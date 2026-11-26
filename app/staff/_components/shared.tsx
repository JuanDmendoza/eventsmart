import type { PassType } from "../_lib/tickets";
import type { Status, Validation } from "../_lib/useValidator";

/* =========================================================
   Piezas compartidas por la vista de escritorio y la móvil.
   ========================================================= */

export const statusMeta: Record<
  Status,
  { title: string; short: string; sub: string; bg: string; soft: string; text: string; icon: string; instruction: (v: Validation) => string }
> = {
  valid: {
    title: "¡ACCESO PERMITIDO!",
    short: "Permitido",
    sub: "Entrada Permitida",
    bg: "bg-emerald-500",
    soft: "bg-emerald-50 border-emerald-200 text-emerald-700",
    text: "text-emerald-600",
    icon: "✓",
    instruction: (v) =>
      v.ticket?.pass.startsWith("VIP")
        ? "¡Bienvenido! Entregar pulsera dorada y dirigir al acceso VIP."
        : "¡Bienvenido al festival! Entregar pulsera verde oficial.",
  },
  used: {
    title: "YA UTILIZADO",
    short: "Ya Utilizado",
    sub: "Alerta Duplicado",
    bg: "bg-amber-500",
    soft: "bg-amber-50 border-amber-200 text-amber-700",
    text: "text-amber-600",
    icon: "!",
    instruction: (v) =>
      `No permitir ingreso. Primer ingreso: ${v.firstUse?.time ?? "--"} hrs en ${v.firstUse?.gate ?? "otra puerta"}. Solicitar documento y avisar a supervisor.`,
  },
  invalid: {
    title: "DENEGADO",
    short: "Denegado",
    sub: "Boleto Inválido",
    bg: "bg-rose-500",
    soft: "bg-rose-50 border-rose-200 text-rose-700",
    text: "text-rose-600",
    icon: "✕",
    instruction: () => "No permitir ingreso. Código no registrado: verificar con ingreso manual por documento.",
  },
};

const passTone: Record<PassType, string> = {
  General: "bg-brand-surface text-brand border-brand-border",
  "VIP Lounge": "bg-violet-50 text-violet-600 border-violet-200",
  "VIP Gold": "bg-amber-50 text-amber-700 border-amber-200",
  "Fast-Track / Palco": "bg-amber-50 text-amber-700 border-amber-200",
};

export function PassBadge({ pass }: { pass?: PassType }) {
  if (!pass) {
    return <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-muted">Desconocido</span>;
  }
  return <span className={`whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${passTone[pass]}`}>{pass}</span>;
}

export function StatusTag({ status, firstGate }: { status: Status; firstGate?: string }) {
  const m = statusMeta[status];
  const label = status === "used" && firstGate ? `${m.short} (${firstGate})` : status === "invalid" ? "Denegado" : m.short;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${m.soft}`}>
      {m.icon} {label}
    </span>
  );
}

/** "18492102k" → "18.492.102-K" */
export function formatDoc(raw: string) {
  const s = raw.toUpperCase().replace(/[^0-9K]/g, "");
  if (s.length < 2) return s;
  const body = s.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${body}-${s.slice(-1)}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <span className="flex select-none items-center gap-0.5">
      <span className={`inline-block -translate-y-0.5 font-script leading-[0.65] text-ink ${small ? "text-[34px]" : "text-[42px]"}`}>E</span>
      <span className={`flex flex-col font-display uppercase leading-[0.82] tracking-[0.04em] text-ink ${small ? "text-[11px]" : "text-[13px]"}`}>
        <span>VENT</span>
        <span>SMART</span>
      </span>
    </span>
  );
}
