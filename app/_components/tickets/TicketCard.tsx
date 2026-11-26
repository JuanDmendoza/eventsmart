import QrCode, { ScanFrame } from "./QrCode";
import { activeTicket as t, client } from "./data";

/* =========================================================
   Boleto digital. Un solo componente con dos lecturas:
   - md+: horizontal, perforación vertical, QR a la derecha.
   - teléfono: vertical, banda oscura arriba, perforación horizontal.
   ========================================================= */

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const WalletIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <rect x="2" y="5" width="20" height="15" rx="2" />
    <path d="M16 12h2M2 9h20" />
  </svg>
);

function Info({
  label,
  value,
  sub,
  valueClass = "text-ink",
  subClass = "text-faint",
  className = "",
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  subClass?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[9.5px] font-extrabold tracking-[0.08em] text-faint">{label}</p>
      <p className={`mt-0.5 text-[13px] font-extrabold md:text-[15px] ${valueClass}`}>{value}</p>
      {sub && <p className={`text-[10.5px] ${subClass}`}>{sub}</p>}
    </div>
  );
}

export default function TicketCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-12px_rgba(15,23,42,0.15)] md:flex">
      {/* Banda superior (teléfono) */}
      <div className="flex items-center justify-between bg-ink px-4 py-2.5 md:hidden">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[0.06em] text-white">
          <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px]">✓</span>
          ENTRADA DIGITAL VERIFICADA
        </span>
        <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-extrabold text-ink">♛ GOLD TIER VIP</span>
      </div>

      {/* Datos */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-3 hidden items-center justify-between md:flex">
          <span className="rounded bg-brand-surface px-2 py-1 text-[9.5px] font-extrabold tracking-[0.08em] text-brand">
            ENTRADA DIGITAL VERIFICADA
          </span>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[10.5px] font-extrabold text-amber-700">
            ☆ {t.tier}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.08em] text-brand md:hidden">FESTIVAL OFICIAL</p>
            <h2 className="text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-[30px]">
              <span className="md:hidden">{t.shortName}</span>
              <span className="max-md:hidden">{t.name}</span>
            </h2>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted md:text-[12.5px]">
              <PinIcon /> {t.venue}
              <span className="max-md:hidden"> · {t.stage}</span>
            </p>
          </div>
          <span className="shrink-0 rounded-lg border border-brand-border bg-brand-surface px-2 py-1 text-center text-[8px] font-bold leading-tight text-muted md:hidden">
            ACCESO
            <br />
            <span className="text-[11px] font-extrabold text-brand">GOLD</span>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 md:mt-6 md:max-w-[520px] md:p-5">
          <Info label="TITULAR DEL BOLETO" value={client.name} sub={`DNI: ${client.dni}`} />
          <Info label="ZONA & ACCESO" value={t.zone} sub={t.zoneDetail} valueClass="text-brand" />
          <Info
            label="BRAZALETE CASHLESS"
            value={t.cashless}
            sub="Saldo cargado de cortesía"
            className="max-md:hidden"
          />
          <Info
            label="FECHA & HORARIO"
            value={t.date}
            sub={`Apertura ${t.opening}`}
            subClass="font-bold text-emerald-600 max-md:hidden"
          />
          <Info label="HORARIO ENTRADA" value={t.opening} valueClass="text-emerald-600" className="md:hidden" />
        </div>

        <div className="mt-6 hidden flex-wrap gap-3 md:flex">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:bg-brand-dark"
          >
            <DownloadIcon /> Descargar Boleto (PDF)
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[12.5px] font-bold text-ink transition-colors hover:bg-slate-50"
          >
            <WalletIcon /> Guardar en Apple / Google Wallet
          </button>
        </div>
      </div>

      {/* Perforación */}
      <div className="relative mx-5 border-t-2 border-dashed border-slate-200 md:mx-0 md:my-5 md:border-l-2 md:border-t-0">
        <span className="absolute -left-[30px] -top-[11px] size-5 rounded-full border border-slate-200 bg-slate-50 md:-left-[11px] md:-top-[31px]" />
        <span className="absolute -right-[30px] -top-[11px] size-5 rounded-full border border-slate-200 bg-slate-50 md:-bottom-[31px] md:-left-[11px] md:right-auto md:top-auto" />
      </div>

      {/* Token / QR */}
      <div className="flex flex-col items-center justify-center p-5 md:w-[280px] md:bg-brand-surface/60 md:p-6">
        <p className="mb-4 self-start text-[10px] font-extrabold tracking-[0.08em] text-muted max-md:hidden">
          TOKEN CRIPTOGRÁFICO
        </p>
        <ScanFrame className="w-full max-w-[200px]">
          <div className="rounded-xl bg-white p-4 shadow-[0_6px_18px_-6px_rgba(15,23,42,0.18)]">
            <QrCode seed={t.id} className="aspect-square w-full" />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 max-md:hidden">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
              {t.turnstile} emparejado
            </p>
          </div>
        </ScanFrame>
      </div>
    </article>
  );
}
