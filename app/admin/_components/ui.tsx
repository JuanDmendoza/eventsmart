/* =========================================================
   Piezas de UI reutilizadas en las vistas del panel admin.
   ========================================================= */

export const fmt = (n: number) => n.toLocaleString("en-US");
export const pct = (a: number, b: number) => Math.round((a / b) * 1000) / 10;

export function PageHeader({
  lead,
  script,
  subtitle,
  actions,
}: {
  lead: string;
  script: string;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.02em] text-ink">
          {lead}{" "}
          <span className="inline-block align-[-3px] font-script text-[1.4em] font-normal tracking-normal text-brand">
            {script}
          </span>
        </h1>
        <div className="mt-0.5 text-[13px] text-muted">{subtitle}</div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

export function CardTitle({ title, subtitle, right }: { title: React.ReactNode; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-[16px] font-extrabold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Progress({ value, color = "bg-brand", track = "bg-slate-100" }: { value: number; color?: string; track?: string }) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${track}`}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Kpi({
  label,
  badge,
  value,
  valueClass = "text-ink",
  unit,
  children,
}: {
  label: string;
  badge?: React.ReactNode;
  value: string;
  valueClass?: string;
  unit?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10.5px] font-extrabold tracking-[0.06em] text-muted">{label}</span>
        {badge}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={`text-[34px] font-extrabold leading-none tracking-tight ${valueClass}`}>{value}</span>
        {unit && <span className="text-[13px] font-semibold text-muted">{unit}</span>}
      </div>
      {children && <div className="mt-3 space-y-2.5">{children}</div>}
    </div>
  );
}

const badgeTones = {
  blue: "bg-brand-surface text-brand border-brand-border",
  green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-rose-50 text-rose-600 border-rose-200",
  gray: "bg-slate-100 text-muted border-slate-200",
  purple: "bg-violet-50 text-violet-600 border-violet-200",
};

export type Tone = keyof typeof badgeTones;

export function Badge({ tone = "gray", children, dot = false }: { tone?: Tone; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-bold ${badgeTones[tone]}`}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "outline",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "danger" | "success" | "dark";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-[0_4px_12px_rgba(37,99,235,0.25)]",
    outline: "border border-slate-200 bg-white text-ink hover:bg-slate-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    dark: "bg-slate-800 text-white hover:bg-ink",
  };
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[12.5px] font-bold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="-mx-5 overflow-x-auto px-5">{children}</div>;
}

export function Pagination({ summary, pages = [1] }: { summary: React.ReactNode; pages?: number[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[12px] text-muted">
      <span>{summary}</span>
      <div className="flex items-center gap-1.5">
        <button type="button" className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 font-semibold text-ink hover:bg-slate-50">
          Anterior
        </button>
        {pages.map((p, i) => (
          <button
            key={p}
            type="button"
            className={`size-7 cursor-pointer rounded-md font-bold ${i === 0 ? "bg-brand text-white" : "border border-slate-200 text-ink hover:bg-slate-50"}`}
          >
            {p}
          </button>
        ))}
        <button type="button" className="cursor-pointer rounded-md border border-slate-200 px-2.5 py-1 font-semibold text-ink hover:bg-slate-50">
          Siguiente
        </button>
      </div>
    </div>
  );
}
