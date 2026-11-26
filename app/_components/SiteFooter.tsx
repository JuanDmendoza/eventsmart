export default function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`border-t border-slate-200 bg-white ${className}`}>
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-7 py-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <span className="flex size-[26px] items-center justify-center rounded-md bg-linear-to-br from-brand to-brand-dark text-white shadow-[0_2px_6px_rgba(37,99,235,0.3)]">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </span>
            <span className="text-base font-extrabold tracking-[-0.02em]">
              <span className="text-ink">Event</span>
              <span className="text-brand">Smart</span>
            </span>
          </span>
          <span className="text-[11.5px] text-muted">
            © 2026 EventSmart Inc. Control de acceso y gestión de festivales. Todos los derechos
            reservados.
          </span>
        </div>
        <div className="flex items-center gap-6 text-[11.5px] font-semibold text-ink">
          <a href="#" className="hover:text-brand">
            Términos de Servicio
          </a>
          <a href="#" className="hover:text-brand">
            Privacidad
          </a>
          <a href="#" className="hover:text-brand">
            Soporte Técnico
          </a>
        </div>
      </div>
    </footer>
  );
}
