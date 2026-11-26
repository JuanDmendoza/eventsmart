import Link from "next/link";

/* =========================================================
   EventSmart — Navbar
   Altura fija (h-16) para que el preloader se ubique justo
   debajo y la transición a la app no mueva nada.
   ========================================================= */

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex select-none items-center gap-0.5 transition-transform duration-250 ease-spring hover:scale-105 ${className}`}
      aria-label="EventSmart — inicio"
    >
      <span className="inline-block -translate-y-0.5 font-script text-[46px] leading-[0.65] text-ink">E</span>
      <span className="-mt-0.5 flex flex-col font-display text-[14.5px] uppercase leading-[0.82] tracking-[0.04em] text-ink">
        <span>VENT</span>
        <span>SMART</span>
      </span>
    </Link>
  );
}

export type NavSection = "explorar" | "boletos" | "beneficios";

export type NavUser = { name: string; initials: string; tickets: number };

type NavbarProps = {
  /** `false` muestra solo el logo (durante el preloader); el resto aparece con un fundido. */
  ready?: boolean;
  search?: string;
  onSearch?: (value: string) => void;
  active?: NavSection;
  /** Con usuario: muestra "Mis Boletos" y el avatar en lugar de búsqueda / login. */
  user?: NavUser;
};

export default function Navbar({ ready = true, search, onSearch, active = "explorar", user }: NavbarProps) {
  const links: { id: NavSection; label: string; href: string; badge?: number }[] = [
    { id: "explorar", label: "Explorar Festivales", href: "/" },
    ...(user ? [{ id: "boletos" as const, label: "Mis Boletos", href: "/mis-boletos", badge: user.tickets }] : []),
    { id: "beneficios", label: "Beneficios", href: "#beneficios" },
  ];

  const reveal = `transition-all duration-500 ease-smooth ${
    ready ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
  }`;

  return (
    <nav className="sticky top-0 z-150 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1320px] items-center gap-4 px-4 md:gap-10 md:px-7">
        <BrandLogo />

        <div className={`flex items-center gap-6 max-[860px]:hidden ${reveal}`}>
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`relative flex items-center gap-1.5 py-1.5 text-[13px] font-semibold transition-colors ${
                l.id === active
                  ? "text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded after:bg-brand"
                  : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
              {!!l.badge && (
                <span className="flex size-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {user ? (
          <div className={`ml-auto flex items-center gap-2.5 max-md:hidden ${reveal}`}>
            <span className="text-[13px] font-bold text-ink">{user.name}</span>
            <span className="flex size-8 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-[11px] font-extrabold text-brand">
              {user.initials}
            </span>
          </div>
        ) : (
          <>
        <div className={`relative mx-auto flex w-full max-w-[360px] items-center max-[860px]:hidden ${reveal}`}>
          <svg
            className="pointer-events-none absolute left-3.5 text-faint"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
            readOnly={!onSearch}
            placeholder="Buscar festivales, artistas..."
            className="w-full rounded-full border border-transparent bg-slate-100 py-2 pl-9 pr-4 text-[13px] text-ink outline-none transition-all placeholder:text-faint focus:border-brand focus:bg-white focus:ring-3 focus:ring-brand/12"
          />
        </div>

        <div className={`ml-auto flex shrink-0 items-center gap-1.5 md:gap-3 ${reveal}`}>
          <Link
            href="/login"
            className="rounded-lg px-2.5 py-2 text-[12.5px] font-bold text-ink md:px-3.5 md:text-[13px] transition-colors hover:bg-slate-100"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[12.5px] md:px-4 md:py-2.5 md:text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-px hover:bg-brand-dark"
          >
            <svg className="max-sm:hidden" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Crear Cuenta
          </Link>
        </div>
          </>
        )}
      </div>
    </nav>
  );
}
