import { Button, PageHeader } from "../_components/ui";
import EventsList from "./EventsList";

export default function AdminEventos() {
  return (
    <>
      <PageHeader
        lead="Gestión de"
        script="eventos y festivales"
        subtitle="Administra las fechas, sedes y límites estrictos de aforo global"
        actions={<Button variant="primary">＋ Crear Nuevo Evento</Button>}
      />
      <EventsList />
    </>
  );
}
