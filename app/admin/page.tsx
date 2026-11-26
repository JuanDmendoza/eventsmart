import { FlowLegend, FlowLineChart } from "./_components/charts";
import { Badge, Button, Card, CardTitle, Kpi, Pagination, PageHeader, Progress, TableShell, fmt, pct } from "./_components/ui";
import { capacity, hourlyFlow, recentCheckins } from "./_data";

export default function AdminDashboard() {
  const pending = capacity.max - capacity.checkedIn;
  const inPct = pct(capacity.checkedIn, capacity.max);

  return (
    <>
      <PageHeader lead="Resumen de" script="acceso y aforo" subtitle="Métricas de validación en tiempo real en los molinetes del recinto" />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Kpi
          label="AFORO EN VIVO"
          badge={<span className="flex size-7 items-center justify-center rounded-lg bg-brand-surface text-brand"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></span>}
          value={fmt(capacity.checkedIn)}
          unit={`/ ${fmt(capacity.max)} ingresados`}
        >
          <Progress value={inPct} />
          <div className="flex justify-between text-[11.5px] font-semibold text-muted">
            <span>Capacidad máxima: {fmt(capacity.max)} personas</span>
            <span className="font-bold text-brand">{inPct}%</span>
          </div>
        </Kpi>

        <Kpi
          label="BOLETOS POR INGRESAR"
          badge={<span className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-muted"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" /></svg></span>}
          value={fmt(pending)}
          unit="asistentes pendientes"
        >
          <Progress value={100 - inPct} color="bg-slate-500" />
          <div className="flex justify-between text-[11.5px] font-semibold text-muted">
            <span>{Math.round((100 - inPct) * 10) / 10}% pendiente de check-in</span>
            <span className="font-bold text-emerald-600">↗ Flujo constante</span>
          </div>
        </Kpi>

        <Kpi
          label="ALERTAS DE FRAUDE"
          badge={<span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg></span>}
          value={String(capacity.fraud)}
          unit="intentos de duplicidad"
        >
          <Badge tone="green" dot>
            100% de entradas válidas SHA-256
          </Badge>
        </Kpi>
      </div>

      <Card className="mb-5">
        <CardTitle
          title="Curva de Flujo de Ingresos por Hora"
          subtitle="Distribución de asistentes ingresados por hora (16:00 a 22:00 hrs)"
          right={<FlowLegend />}
        />
        <FlowLineChart data={hourlyFlow} />
      </Card>

      <Card>
        <CardTitle
          title="Últimos Check-ins en Puerta"
          subtitle="Registro auditado de accesos por molinete y operador"
          right={
            <div className="flex gap-2">
              <Button className="border-emerald-200! text-emerald-700!">📊 Descargar Excel (.xlsx)</Button>
              <Button className="border-rose-200! text-rose-600!">📄 Descargar PDF</Button>
            </div>
          }
        />
        <TableShell>
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10.5px] font-extrabold tracking-[0.06em] text-muted">
                <th className="py-2.5">ASISTENTE</th>
                <th>PUERTA / OPERADOR</th>
                <th>HORA EXACTA</th>
                <th className="text-center">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCheckins.map((c) => (
                <tr key={c.dni}>
                  <td className="py-3">
                    <p className="font-bold text-ink">{c.name}</p>
                    <p className="text-[11px] text-faint">
                      DNI: {c.dni} • {c.email}
                    </p>
                  </td>
                  <td>
                    <p className="font-bold text-ink">{c.gate}</p>
                    <p className="text-[11px] text-faint">({c.operator})</p>
                  </td>
                  <td className="font-mono font-bold text-ink">{c.time}</td>
                  <td className="text-center">
                    <Badge tone="green" dot>
                      Ingresado
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        <Pagination
          summary={
            <>
              Mostrando <strong className="text-ink">1 - 4</strong> de <strong className="text-ink">{fmt(capacity.checkedIn)}</strong> ingresos totales
            </>
          }
        />
      </Card>
    </>
  );
}
