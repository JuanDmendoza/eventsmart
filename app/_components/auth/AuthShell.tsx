import { BrandLogo } from "../Navbar";

/* =========================================================
   Layout dividido de login / registro:
   izquierda formulario blanco, derecha panel azul con mockup.
   ========================================================= */

export default function AuthShell({ children, device }: { children: React.ReactNode; device: React.ReactNode }) {
  return (
    <div className="grid min-h-screen flex-1 grid-cols-2 bg-white max-[960px]:grid-cols-1">
      {/* Formulario */}
      <section className="flex flex-col px-12 py-9 max-[560px]:px-6">
        <BrandLogo className="self-start" />
        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-8">{children}</div>
        <div className="mx-auto flex w-full max-w-[440px] items-center justify-between border-t border-slate-100 pt-5 text-[11px] font-semibold text-muted">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Cifrado SHA-256 SSL
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Garantía Antifraude
          </span>
        </div>
      </section>

      {/* Panel de marca */}
      <aside className="relative flex flex-col overflow-hidden bg-linear-to-br from-brand to-brand-dark px-12 py-12 text-white max-[960px]:hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-white/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[380px] rounded-full bg-brand-glow/30 blur-3xl" />

        <div className="relative">
          <h2 className="max-w-[420px] text-[30px] font-extrabold leading-tight tracking-[-0.02em]">
            Tus festivales favoritos sin fraudes ni filas
          </h2>
          <p className="mt-4 max-w-[440px] text-[13px] leading-relaxed text-white/75">
            Acceso instantáneo con credenciales digitales dinámicas y transferencias seguras.
          </p>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-10">{device}</div>

        <div className="relative flex items-center justify-between border-t border-white/15 pt-5 text-[11px] font-semibold text-white/70">
          <span>EventSmart Security Cloud</span>
          <span>v3.4.1</span>
        </div>
      </aside>
    </div>
  );
}

export function AuthTitle({ lead, subtitle }: { lead: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
        {lead}{" "}
        <span className="inline-block align-[-3px] font-script text-[1.35em] font-normal tracking-normal text-brand">
          Eventsmart
        </span>
      </h1>
      <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
    </header>
  );
}
