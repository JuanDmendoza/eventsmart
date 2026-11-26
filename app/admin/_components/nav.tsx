"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { admin, currentEvent } from "../_data";

/* =========================================================
   Sidebar + barra superior del panel admin.
   ========================================================= */

const items = [
  {
    href: "/admin",
    title: "Dashboard",
    subtitle: "Vista general de aforo",
    icon: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
  },
  {
    href: "/admin/eventos",
    title: "Gestión de Eventos",
    subtitle: "Festivales, fechas y aforo",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    href: "/admin/asistentes",
    title: "Asistentes y Reservas",
    subtitle: "Control de tickets y padrón",
    icon: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
  },
  {
    href: "/admin/accesos",
    title: "Accesos en Vivo",
    subtitle: "Torniquetes y validaciones",
    live: true,
    icon: <path d="M4 4h16v16H4zM12 4v16" />,
  },
  {
    href: "/admin/reportes",
    title: "Reportes",
    subtitle: "Exportación y balances",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8" />
      </>
    ),
  },
];

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function LivePill() {
  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-px text-[9px] font-extrabold tracking-[0.06em] text-emerald-600">
      LIVE
    </span>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-[230px] shrink-0 flex-col border-r border-slate-200 bg-white max-lg:hidden">
      <div className="border-b border-dashed border-slate-200 px-5 pb-4 pt-6">
        <Link href="/" className="flex select-none items-center gap-0.5" title="Volver al catálogo">
          <span className="inline-block -translate-y-0.5 font-script text-[46px] leading-[0.65] text-ink">E</span>
          <span className="flex flex-col font-display text-[14.5px] uppercase leading-[0.82] tracking-[0.04em] text-ink">
            <span>VENT</span>
            <span>SMART</span>
          </span>
        </Link>
        <span className="mt-2 inline-block rounded border border-brand-border bg-brand-surface px-2 py-0.5 text-[9px] font-extrabold tracking-[0.08em] text-brand">
          ADMIN PANEL
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                active
                  ? "bg-brand-surface text-brand before:absolute before:-left-3 before:top-2 before:bottom-2 before:w-1 before:rounded-r before:bg-brand"
                  : "text-muted hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <Icon>{item.icon}</Icon>
              <span className="flex min-w-0 flex-col">
                <span className={`text-[13px] ${active ? "font-bold" : "font-semibold"}`}>{item.title}</span>
                {active && <span className="truncate text-[10.5px] font-medium text-brand/70">{item.subtitle}</span>}
              </span>
              {item.live && (
                <span className="ml-auto">
                  <LivePill />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2.5 border-t border-dashed border-slate-200 p-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-ink">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
              Gateway Nominal
            </span>
            <span className="rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] text-muted">12ms</span>
          </div>
          <p className="mt-0.5 text-[10px] text-faint">Puertas sincronizadas</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-[11px] font-extrabold text-white">
              {admin.initials}
            </span>
            <span className="leading-tight">
              <span className="block text-[12.5px] font-bold text-ink">{admin.name}</span>
              <span className="block text-[10.5px] text-muted">{admin.role}</span>
            </span>
          </div>
          <Link href="/" title="Cerrar sesión" className="text-faint transition-colors hover:text-ink">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function GateControlButton() {
  return (
    <Link
      href="/staff"
      className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:bg-brand-dark"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Control de Puerta
    </Link>
  );
}

export function AdminTopBar() {
  const pathname = usePathname();
  const current = items.find((i) => isActive(pathname, i.href)) ?? items[0];
  const isEvents = current.href === "/admin/eventos";
  const showGate = current.href === "/admin/accesos" || current.href === "/admin/reportes";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center gap-5 px-6 max-sm:px-4">
        {!isEvents && (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-ink transition-colors hover:border-slate-300"
            title="Seleccionar festival activo"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {currentEvent.name}
            {currentEvent.live && <span className="text-muted max-sm:hidden">(En Vivo)</span>}
          </button>
        )}

        {current.href !== "/admin" && (
          <p className="text-[12px] max-md:hidden">
            <span className="font-semibold text-muted">Panel Admin</span>
            <span className="mx-1.5 text-faint">›</span>
            <span className="font-bold text-ink">{current.title}</span>
          </p>
        )}

        <div className="ml-auto flex items-center gap-4">
          {isEvents && (
            <>
              <span className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-bold text-ink max-sm:hidden">
                <span className="size-2 rounded-sm bg-brand" /> Producciones Live LATAM
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted max-md:hidden">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Servidores Conectados
              </span>
              <button type="button" className="relative cursor-pointer text-muted hover:text-ink" title="Notificaciones">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </>
          )}
          {showGate && <GateControlButton />}
        </div>
      </div>

      {/* Navegación compacta cuando no hay sidebar */}
      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 [scrollbar-width:none] lg:hidden">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                active ? "bg-brand text-white" : "text-muted hover:bg-slate-100"
              }`}
            >
              {item.title}
              {item.live && !active && <LivePill />}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
