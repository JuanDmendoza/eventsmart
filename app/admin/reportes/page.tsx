import { HourlyBars } from "../_components/charts";
import { Button, Card, PageHeader, TableShell, fmt, pct } from "../_components/ui";
import { auditRows, capacity, currentEvent, hourlyScans } from "../_data";

function Select({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-ink hover:border-slate-300"
    >
      {children}
      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export default function AdminReportes() {
  const attended = capacity.checkedIn;
  const noShow = capacity.max - attended;
  const peak = hourlyScans.reduce((a, b) => (b.value > a.value ? b : a));

  return (
    <>
      <PageHeader
        lead="Generación y exportación de"
        script="reportes"
        subtitle="Descarga auditorías completas de asistencia, ausencias y métricas de aforo."
        actions={
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="leading-tight">
              <strong className="block text-[12.5px] text-ink">{currentEvent.name}</strong>
              <span className="text-[10.5px] text-muted">Auditoría Oficial Disponible • SHA-256</span>
            </span>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                </svg>
              </span>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9.5px] font-extrabold tracking-[0.06em] text-emerald-700">
                FORMATO TABULAR EXHAUSTIVO
              </span>
            </div>
            <h4 className="mt-3 text-[16px] font-extrabold text-ink">Padrón Completo de Asistencia</h4>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              Detalle fila por fila con 100% de asistentes, diferenciando ingresos efectivos, ausencias, cédulas y marcas de tiempo exactas.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-muted">📄 ~2.4 MB • {fmt(capacity.max)} registros • Fórmulas y tablas dinámicas</p>
          </div>
          <Button variant="success" className="mt-4 w-full py-3">
            ⤓ Descargar Archivo Excel (.xlsx)
          </Button>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9.5px] font-extrabold tracking-[0.06em] text-muted">
                RESUMEN GERENCIAL LISTO PARA IMPRESIÓN
              </span>
            </div>
            <h4 className="mt-3 text-[16px] font-extrabold text-ink">Informe de Aforo y Horas Pico</h4>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
              Resumen gerencial con gráficos consolidados de ocupación, curvas de horas de mayor congestión y totales generales listos para directiva.
            </p>
            <p className="mt-2 text-[11px] font-semibold text-muted">🗎 Formato A4 • 8 páginas • Gráficos vectoriales de alta resolución</p>
          </div>
          <Button variant="dark" className="mt-4 w-full py-3">
            ⤓ Descargar Informe PDF
          </Button>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-extrabold text-ink">Vista Previa de Resumen de Auditoría</h3>
            <p className="mt-0.5 text-[12px] text-muted">Verifica las métricas consolidadas antes de exportar el balance definitivo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select>{currentEvent.name}</Select>
            <Select>24 Octubre 2026 - Día 1</Select>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[10px] font-extrabold tracking-[0.06em] text-muted">TOTAL REGISTRADOS</p>
            <p className="text-[26px] font-extrabold text-ink">{fmt(capacity.max)}</p>
            <p className="text-[11px] text-muted">100% de la emisión habilitada</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
            <p className="text-[10px] font-extrabold tracking-[0.06em] text-emerald-700">ASISTIERON (EFECTIVOS)</p>
            <p className="text-[26px] font-extrabold text-emerald-700">{fmt(attended)}</p>
            <p className="text-[11px] text-emerald-700/80">{pct(attended, capacity.max)}% aforo real validado</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-[10px] font-extrabold tracking-[0.06em] text-amber-700">AUSENCIAS / NO-SHOW</p>
            <p className="text-[26px] font-extrabold text-amber-700">{fmt(noShow)}</p>
            <p className="text-[11px] text-amber-700/80">{pct(noShow, capacity.max)}% dentro del margen</p>
          </div>
          <div className="rounded-xl border border-brand-border bg-brand-surface p-3.5">
            <p className="text-[10px] font-extrabold tracking-[0.06em] text-brand">HORA PICO DE INGRESO</p>
            <p className="text-[22px] font-extrabold text-brand">19:30 – 20:00</p>
            <p className="text-[11px] text-brand/80">Pico: {peak.value} escaneos en 30 min</p>
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13.5px] font-bold text-ink">📊 Curva de Flujo Horario y Ritmo de Ingresos por Molinetes</span>
            <div className="flex items-center gap-4 text-[11.5px] font-semibold text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-blue-500" /> Ingresos efectivos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-amber-500" /> Zona crítica pico
              </span>
            </div>
          </div>
          <HourlyBars data={hourlyScans} />
        </div>

        <TableShell>
          <table className="w-full min-w-[720px] overflow-hidden rounded-xl border border-slate-200 text-left text-[12.5px]">
            <thead className="bg-slate-50">
              <tr className="text-[10.5px] font-extrabold tracking-[0.06em] text-muted">
                <th className="px-4 py-2.5">INTERVALO HORARIO</th>
                <th>AFLUENCIA PUERTA NORTE</th>
                <th>AFLUENCIA PUERTA SUR (VIP)</th>
                <th>FLUJO ACUMULADO</th>
                <th>VELOCIDAD PROMEDIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditRows.map((r) => (
                <tr key={r.range}>
                  <td className="px-4 py-3 font-bold text-ink">{r.range}</td>
                  <td className="text-muted">{r.north} escaneos</td>
                  <td className="text-muted">{r.south} escaneos</td>
                  <td className="font-extrabold text-brand">{r.cumulative}</td>
                  <td className="font-bold text-emerald-600">{r.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </Card>
    </>
  );
}
