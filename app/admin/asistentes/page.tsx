import { Badge, Button, Kpi, PageHeader, Progress, fmt, pct } from "../_components/ui";
import { attendeeTotals, capacity } from "../_data";
import AttendeesTable from "./AttendeesTable";

export default function AdminAsistentes() {
  const issuedPct = pct(capacity.checkedIn, capacity.max);
  const remaining = capacity.max - capacity.checkedIn;
  const perOrder = Math.round((capacity.checkedIn / attendeeTotals.batches) * 100) / 100;

  return (
    <>
      <PageHeader
        lead="Control de"
        script="asistentes y reservas"
        subtitle="Supervisa el padrón oficial de tickets emitidos, verificación de identidad y estado de ingreso en tiempo real."
        actions={
          <>
            <Button>⤓ Exportar Lista (.csv / .xlsx)</Button>
            <Button variant="primary">＋ Nueva Reserva</Button>
          </>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <Kpi label="TOTAL BOLETOS EMITIDOS" badge={<Badge tone="blue">{issuedPct}% asignado</Badge>} value={fmt(capacity.checkedIn)} unit={`/ ${fmt(capacity.max)}`}>
          <Progress value={issuedPct} />
          <p className="text-right text-[11.5px] font-semibold text-muted">Meta: {fmt(capacity.max)} cupos</p>
        </Kpi>
        <Kpi label="AFORO RESTANTE EN TIEMPO REAL" badge={<Badge tone="amber" dot>En Vivo</Badge>} value={fmt(remaining)} unit="cupos disponibles">
          <Progress value={100 - issuedPct} color="bg-amber-500" />
          <p className="text-right text-[11.5px] font-bold text-amber-700">{Math.round((100 - issuedPct) * 10) / 10}% remanente</p>
        </Kpi>
        <Kpi label="LOTES DE RESERVA" badge={<Badge tone="green">Sincronizado</Badge>} value={fmt(attendeeTotals.batches)} unit="transacciones">
          <Progress value={85} color="bg-emerald-500" />
          <p className="text-right text-[11.5px] font-bold text-emerald-600">{perOrder} boletos / orden</p>
        </Kpi>
      </div>

      <AttendeesTable />
    </>
  );
}
