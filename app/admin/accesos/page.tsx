import { Badge, Button, Card, Kpi, PageHeader, Progress, fmt, pct } from "../_components/ui";
import { capacity, gates } from "../_data";
import ValidationFeed from "./ValidationFeed";

export default function AdminAccesos() {
  const totalScans = gates.reduce((s, g) => s + g.scans, 0);
  const perMin = gates.reduce((s, g) => s + g.perMin, 0);

  return (
    <>
      <PageHeader
        lead="Monitoreo de"
        script="accesos en vivo"
        subtitle="Supervisión en tiempo real de torniquetes, terminales de escaneo móvil y flujo de asistentes en cada punto de ingreso."
        actions={
          <>
            <Button>⚙ Configurar Puertas</Button>
            <Button variant="danger">⏸ Pausar Validación Global</Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Kpi label="ESCANEOS TOTALES HOY" badge={<Badge tone="green">{pct(capacity.checkedIn, capacity.max)}% Aforo</Badge>} value={fmt(totalScans)} unit={`/ ${fmt(capacity.max)} boletos`}>
          <p className="text-[11.5px] text-muted">
            <strong className="text-brand">⚡ {perMin} escaneos/min</strong> · Velocidad óptima de flujo
          </p>
        </Kpi>
        <Kpi label="OPERADORES CONECTADOS" badge={<Badge tone="blue">100% Cobertura</Badge>} value={String(gates.length)} unit="Terminales Activos">
          <p className="text-[11.5px] text-muted">
            <strong className="text-emerald-600">✓ Sin desconexiones</strong> · {gates.length} de {gates.length} Puertas Operativas
          </p>
        </Kpi>
        <Kpi label="ALERTAS / RECHAZOS" badge={<Badge tone="amber">Atención</Badge>} value="3" valueClass="text-rose-500" unit="incidentes prevenidos">
          <p className="text-[11.5px] text-muted">
            🛡 Tasa de fraude &lt; 0.2% ·{" "}
            <a href="#registro" className="font-bold text-brand hover:underline">
              Ver detalle
            </a>
          </p>
        </Kpi>
      </div>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-extrabold text-ink">▣ Estado de Puntos de Control y Torniquetes</h3>
          <span className="text-[11.5px] font-semibold text-muted">{gates.length} Puertas Asignadas al Festival</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {gates.map((g) => (
            <div key={g.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[16px] font-extrabold text-ink">{g.name}</p>
                  <p className="text-[11.5px] text-muted">{g.zone}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-emerald-500" /> Conectado • En Vivo
                </span>
              </div>
              <div className="mt-3 flex justify-between text-[11.5px] text-muted">
                <span>
                  Operador: <strong className="text-ink">{g.operator}</strong>
                </span>
                <span>
                  Terminal: <strong className="text-ink">{g.terminal}</strong>
                </span>
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-semibold">
                <span className={g.battery >= 80 ? "text-emerald-600" : "text-amber-600"}>🔋 {g.battery}%</span>
                <span className="text-brand">{g.network === "Red Mesh" ? "🌐" : "📶"} {g.network}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[28px] font-extrabold text-ink">
                  {fmt(g.scans)} <span className="text-[12px] font-semibold text-muted">escaneos</span>
                </span>
                <span className="text-[16px] font-extrabold text-brand">
                  {g.perMin} <span className="text-[11px] font-semibold text-muted">/min</span>
                </span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10.5px] font-bold text-muted">
                  <span>{g.flowLabel}</span>
                  <span>{g.load}% Capacidad</span>
                </div>
                <Progress value={g.load} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <div id="registro">
          <ValidationFeed />
        </div>
      </Card>
    </>
  );
}
