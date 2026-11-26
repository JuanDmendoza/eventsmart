"use client";

import { useState } from "react";
import { useNavbarSearch } from "../preloader/PreloaderGate";
import { categories, festivals, type Category, type TagTone } from "./festivals";

const toneClass: Record<TagTone, string> = {
  white: "bg-white text-ink",
  red: "bg-rose-500 text-white",
  green: "bg-emerald-500 text-white",
  gold: "bg-amber-400 text-ink",
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function Dropdown({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-slate-300"
    >
      {label}
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export default function Catalog() {
  const [active, setActive] = useState<Category | "todos">("todos");
  const search = useNavbarSearch().trim().toLowerCase();

  const visible = festivals.filter(
    (f) =>
      (active === "todos" || f.category === active) &&
      (!search || `${f.name} ${f.city}`.toLowerCase().includes(search)),
  );

  return (
    <main className="relative flex-1 bg-slate-50">
      <div className="dot-grid pointer-events-none fixed inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1320px] px-4 pb-20 pt-8 md:px-7 md:pt-14">
        {/* Encabezado */}
        <header className="mb-6 md:mb-9">
          <h1 className="text-[clamp(26px,4vw,46px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-ink">
            Próximos Festivales
            <span className="ml-1.5 inline-block align-[-2px] font-script text-[1.3em] font-normal tracking-normal text-brand">
              Disponibles
            </span>
          </h1>
          <p className="mt-2 max-w-[660px] text-[12.5px] md:text-[13.5px] leading-relaxed text-muted">
            Explora la cartelera oficial con acceso garantizado por validación biométrica y boletos criptográficos
            anti-fraude.
          </p>
        </header>

        {/* Filtros */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 md:mb-6 md:gap-4">
          {/* En teléfono los filtros se desplazan en horizontal */}
          <div className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:w-auto md:flex-wrap md:overflow-visible md:px-0">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={`shrink-0 cursor-pointer rounded-full border px-4 py-[7px] text-xs font-semibold transition-all ${
                  active === c.id
                    ? "border-brand bg-brand text-white shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
                    : "border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <Dropdown label="Todas las ciudades" />
            <Dropdown label="Relevancia" />
          </div>
        </div>

        {/* Masonry */}
        {visible.length > 0 ? (
          <div className="columns-2 gap-2.5 md:columns-3 md:gap-4 xl:columns-4">
            {visible.map((f) => (
              <article
                key={f.id}
                className="group relative mb-2.5 h-[calc(var(--h)*0.66)] cursor-pointer break-inside-avoid overflow-hidden rounded-xl bg-ink shadow-[0_8px_24px_-6px_rgba(15,23,42,0.18)] md:mb-4 md:h-(--h) md:rounded-2xl"
                style={{ "--h": `${f.height}px` } as React.CSSProperties}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-105"
                  style={{ background: f.background }}
                />
                <div className="absolute inset-0 flex flex-col justify-between bg-linear-to-b from-ink/35 via-transparent via-45% to-ink/80 p-2 md:p-3">
                  <div className="flex flex-wrap items-start justify-between gap-1 md:gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-white/15 bg-ink/65 px-2 py-0.5 text-[8.5px] md:gap-1.5 md:px-2.5 md:py-1 md:text-[10px] font-extrabold tracking-[0.04em] text-white backdrop-blur-md">
                      <CalendarIcon />
                      {f.date}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[8.5px] font-extrabold shadow md:px-2.5 md:py-1 md:text-[10px]-[0_2px_6px_rgba(0,0,0,0.15)] ${toneClass[f.tone]}`}
                    >
                      {f.tag}
                    </span>
                  </div>
                  {/* En teléfono (sin hover) el nombre siempre está visible */}
                  <div className="transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h3 className="text-[12.5px] leading-tight font-extrabold md:text-base tracking-[-0.01em] text-white">{f.name}</h3>
                    <p className="text-[10px] text-white/80 md:text-[11.5px]">📍 {f.city}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-muted">
            No encontramos festivales con esos filtros.
          </div>
        )}
      </div>
    </main>
  );
}
