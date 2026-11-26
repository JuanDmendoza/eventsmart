"use client";

import { useState } from "react";
import { benefits, pastTickets } from "./data";

const toneStyles = {
  green: { icon: "bg-emerald-50 text-emerald-600 border-emerald-100", status: "text-emerald-600" },
  blue: { icon: "bg-brand-surface text-brand border-brand-border", status: "text-brand" },
};

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function TicketTabs() {
  const [tab, setTab] = useState<"activos" | "pasados">("activos");

  const tabClass = (active: boolean) =>
    `relative flex cursor-pointer items-center gap-1.5 pb-2 text-[12.5px] font-bold transition-colors ${
      active
        ? "text-brand after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded after:bg-brand"
        : "text-muted hover:text-ink"
    }`;

  return (
    <section>
      <div className="flex items-end justify-between border-b border-slate-200">
        <div className="flex items-center gap-6">
          <button type="button" className={tabClass(tab === "activos")} onClick={() => setTab("activos")}>
            Boletos Activos
            <span className="flex size-4 items-center justify-center rounded-full bg-brand text-[9px] text-white">1</span>
          </button>
          <button type="button" className={tabClass(tab === "pasados")} onClick={() => setTab("pasados")}>
            Boletos Pasados ({pastTickets.length})
          </button>
        </div>
        {tab === "activos" && (
          <span className="pb-2 text-[11px] font-semibold text-muted">Beneficios activos incluidos con tu entrada VIP</span>
        )}
      </div>

      {tab === "activos" ? (
        <div id="beneficios" className="mt-5 grid grid-cols-2 gap-5">
          {benefits.map((b, i) => (
            <div key={b.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className={`flex size-9 items-center justify-center rounded-lg border ${toneStyles[b.tone].icon}`}>
                {i === 0 ? <BoltIcon /> : <ShieldIcon />}
              </span>
              <h3 className="mt-3 text-[15px] font-extrabold text-ink">{b.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{b.text}</p>
              <p className={`mt-3 text-[10px] font-extrabold tracking-[0.06em] ${toneStyles[b.tone].status}`}>{b.status}</p>
              {b.tone === "blue" && (
                <svg className="absolute bottom-5 right-5 text-faint" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {pastTickets.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[13.5px] font-extrabold text-ink">{p.name}</p>
                <p className="text-[11.5px] text-muted">
                  {p.date} · {p.venue}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold text-muted">{p.zone}</span>
                <span className="font-mono text-[11px] text-faint">{p.id}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
