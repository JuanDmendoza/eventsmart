import Link from "next/link";
import type { NavSection } from "../Navbar";

type Tab = NavSection | "perfil";

const tabs: { id: Tab; label: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "explorar",
    label: "Explorar",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    id: "boletos",
    label: "Mis Boletos",
    href: "/mis-boletos",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M4 4h16c1.1 0 2 .9 2 2v3c-1.1 0-2 .9-2 2s.9 2 2 2v3c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-3c1.1 0 2-.9 2-2s-.9-2-2-2V6c0-1.1.9-2 2-2z" />
      </svg>
    ),
  },
  {
    id: "beneficios",
    label: "Beneficios",
    href: "#beneficios",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: "perfil",
    label: "Perfil",
    href: "#perfil",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/** Barra de pestañas inferior, solo en teléfono. */
export default function MobileTabBar({ active, badge }: { active: Tab; badge?: number }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-150 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-4">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <li key={t.id}>
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold ${isActive ? "text-brand" : "text-faint"}`}
              >
                <span className="relative">
                  {t.icon}
                  {isActive && !!badge && (
                    <span className="absolute -right-2 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white ring-2 ring-white">
                      {badge}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
