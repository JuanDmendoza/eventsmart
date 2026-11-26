/* =========================================================
   Mockups de dispositivo para el panel azul de auth.
   ========================================================= */

/** Registro: teléfono con el boleto EventPass y su QR dinámico. */
export function TicketDevice() {
  return (
    <div className="w-[300px] rotate-[4deg] rounded-[34px] bg-ink p-2.5 shadow-[0_40px_80px_-20px_rgba(2,6,23,0.6)]">
      <div className="overflow-hidden rounded-[26px] bg-white text-ink">
        <div className="flex items-center justify-between px-4 pb-2 pt-4 text-[10px] font-extrabold">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-brand" />
            EventPass Live
          </span>
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            Boleto Activo
          </span>
        </div>

        <div className="mx-3 rounded-2xl bg-linear-to-br from-brand to-brand-dark p-3.5 text-white">
          <div className="flex items-center justify-between">
            <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-extrabold text-ink">VIP EXPERIENCE</span>
            <span className="font-mono text-[8px] text-white/70">#ES-99281</span>
          </div>
          <p className="mt-2 text-[15px] font-extrabold">Solaris Music Fest 2025</p>
          <p className="text-[9px] text-white/75">Acceso General Puerta Norte • Zona VIP</p>
        </div>

        <div className="flex flex-col items-center px-4 py-5">
          <div className="relative flex size-[128px] items-center justify-center">
            <span className="absolute left-0 top-0 size-5 border-2 border-b-0 border-r-0 border-brand" />
            <span className="absolute right-0 top-0 size-5 border-2 border-b-0 border-l-0 border-brand" />
            <span className="absolute bottom-0 left-0 size-5 border-2 border-r-0 border-t-0 border-brand" />
            <span className="absolute bottom-0 right-0 size-5 border-2 border-l-0 border-t-0 border-brand" />
            <div className="qr-matrix size-[92px] rounded-sm" />
            <span className="absolute flex size-6 items-center justify-center rounded bg-brand text-[8px] font-black text-white">
              ES
            </span>
          </div>
          <p className="mt-3 text-[9px] font-semibold text-muted">⟳ Se actualiza cada 15s</p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-[9px]">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="flex size-6 items-center justify-center rounded-full bg-brand-surface text-[8px] font-extrabold text-brand">
              SV
            </span>
            Sofía V.
          </span>
          <span>
            <span className="block text-[7px] font-bold text-faint">FECHA</span>
            <span className="font-bold">18 - 20 OCT 2025</span>
          </span>
          <span>
            <span className="block text-[7px] font-bold text-faint">ESTADO</span>
            <span className="font-bold text-emerald-600">● Verificado</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const scans = [
  { initial: "S", name: "Sofía Patel", detail: "General A · 19:42:04" },
  { initial: "L", name: "Liam Chen", detail: "Platino Central · 19:41:58" },
  { initial: "E", name: "Emma Johnson", detail: "Box VIP · 19:41:30" },
];

/** Login: tablet inclinada con el panel de control de puerta. */
export function DashboardDevice() {
  return (
    <div className="w-[520px] translate-x-16 -rotate-[8deg] rounded-[28px] bg-ink p-3 shadow-[0_40px_80px_-20px_rgba(2,6,23,0.6)]">
      <div className="overflow-hidden rounded-[18px] bg-slate-50 text-ink">
        {/* Barra de ventana */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[11px] font-extrabold">GateControl Pro · Arena CDMX</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
            ● Sistema En Línea
          </span>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-[120px] shrink-0 space-y-1 border-r border-slate-200 bg-white p-3 text-[10px] font-semibold">
            <p className="mb-2 text-[8px] font-extrabold tracking-[0.1em] text-faint">ACCESO RÁPIDO</p>
            <p className="rounded-md bg-brand px-2 py-1.5 text-white">● En Vivo</p>
            <p className="px-2 py-1.5 text-muted">Boletos</p>
            <p className="px-2 py-1.5 text-muted">Asistentes</p>
          </div>

          {/* Contenido */}
          <div className="flex-1 space-y-3 p-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg bg-white p-2.5 shadow-sm">
                <p className="text-[8px] font-bold text-faint">Validación QR</p>
                <p className="text-lg font-extrabold">
                  0.4 seg <span className="text-[9px] font-bold text-brand">latencia</span>
                </p>
              </div>
              <div className="rounded-lg bg-white p-2.5 shadow-sm">
                <p className="text-[8px] font-bold text-faint">Aforo Recinto</p>
                <p className="text-lg font-extrabold text-emerald-600">
                  82.4% <span className="text-[9px] font-bold text-muted">capacidad</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white p-2.5 shadow-sm">
              <div>
                <span className="rounded bg-brand px-1.5 py-0.5 text-[8px] font-extrabold text-white">VIP PASS</span>
                <p className="mt-1 text-[13px] font-extrabold">Carlos Mendoza R.</p>
                <p className="text-[9px] text-muted">Puerta 4 · Molinete 8 · Validado</p>
              </div>
              <div className="qr-matrix size-10 rounded-sm" />
            </div>

            <div className="rounded-lg bg-white p-2.5 shadow-sm">
              <p className="mb-2 text-[8px] font-extrabold tracking-[0.1em] text-faint">ÚLTIMOS ACCESOS ESCANEADOS</p>
              <div className="space-y-2">
                {scans.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-brand-surface text-[9px] font-extrabold text-brand">
                        {s.initial}
                      </span>
                      <span>
                        <span className="block text-[10px] font-bold">{s.name}</span>
                        <span className="block text-[8px] text-faint">{s.detail}</span>
                      </span>
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-600">Aprobado</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between rounded-lg bg-white p-2.5 shadow-sm">
              <div>
                <p className="text-[8px] font-bold text-faint">Total ingresos</p>
                <p className="text-xl font-extrabold">4,892</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">+18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
