/* =========================================================
   Datos estáticos del panel de administración.
   Reemplazar por consultas reales cuando exista backend.
   ========================================================= */

export const admin = { name: "Juan Mendoza", role: "Operaciones Admin", initials: "JM" };

export const currentEvent = { name: "Festival Sunset 2026", live: true };

export const capacity = { checkedIn: 1450, max: 2000, fraud: 0 };

/* ---------- Dashboard ---------- */

export type FlowPoint = { label: string; value: number; trend: number };

/** Ingresos por hora (personas/hora). `trend` = curva normal esperada. */
export const hourlyFlow: FlowPoint[] = [
  { label: "16:00", value: 100, trend: 90 },
  { label: "17:00", value: 140, trend: 135 },
  { label: "18:00", value: 230, trend: 200 },
  { label: "19:00", value: 330, trend: 270 },
  { label: "19:30", value: 420, trend: 300 },
  { label: "20:00", value: 300, trend: 260 },
  { label: "21:00", value: 120, trend: 160 },
  { label: "22:00", value: 55, trend: 90 },
];

export const recentCheckins = [
  { name: "Martín Restrepo Silva", dni: "72810403", email: "martin.restrepo@example.com", gate: "Puerta Norte • Torniquete 02", operator: "Operador Carlos R.", time: "19:42:15" },
  { name: "Camila Valenzuela P.", dni: "48992187", email: "camila.v@example.com", gate: "Puerta Principal • Torniquete 01", operator: "Operadora Ana M.", time: "19:41:58" },
  { name: "Andrea Benítez Morales", dni: "71209384", email: "andrea.b@example.com", gate: "Puerta VIP Este • Torniquete 04", operator: "Operador Diego L.", time: "19:40:22" },
  { name: "Gabriel Soto Rojas", dni: "10482931", email: "g.soto@rollingbeat.pe", gate: "Puerta Prensa • Control 01", operator: "Operador Mario P.", time: "19:38:50" },
];

/* ---------- Eventos ---------- */

export type EventStatus = "live" | "selling" | "upcoming" | "done";

export const events: {
  id: string;
  name: string;
  day: string;
  month: string;
  dates: string;
  venue: string;
  genre?: string;
  status: EventStatus;
  reserved: number;
  max: number;
}[] = [
  { id: "sunset-2026", name: "Festival Sunset 2026", day: "24", month: "OCT", dates: "24 - 26 Octubre, 2026", venue: "Explanada Arena Norte", genre: "Electrónica / Pop", status: "live", reserved: 1450, max: 2000 },
  { id: "electrowave-2026", name: "ElectroWave Stage 2026", day: "12", month: "NOV", dates: "12 - 14 Noviembre, 2026", venue: "Parque Bicentenario", genre: "Synthwave / EDM", status: "selling", reserved: 4850, max: 5000 },
  { id: "indie-sounds", name: "Indie Sounds Weekend", day: "05", month: "DIC", dates: "05 - 07 Diciembre, 2026", venue: "Club Hípico Central", genre: "Indie Rock / Acústico", status: "upcoming", reserved: 420, max: 1500 },
  { id: "neon-summer-2025", name: "Neon Summer Fest 2025", day: "15", month: "ENE", dates: "15 Enero, 2026", venue: "Costa Verde Park", status: "done", reserved: 3000, max: 3000 },
];

/* ---------- Asistentes ---------- */

export type AccessType = "VIP" | "General" | "Fast-Track / Palco";
export type AttendeeStatus = "Ingresado" | "Confirmado" | "Cancelado";

export const attendees: {
  code: string;
  hash: string;
  name: string;
  doc: string;
  access: AccessType;
  issued: string;
  status: AttendeeStatus;
}[] = [
  { code: "TKT-99214", hash: "SHA-256 #8821", name: "Sofía Velázquez Mendoza", doc: "1.094.882.114", access: "VIP", issued: "24 Oct 2026, 14:15", status: "Ingresado" },
  { code: "TKT-99215", hash: "SHA-256 #8822", name: "Carlos Andrés Rivas", doc: "1.082.940.221", access: "General", issued: "24 Oct 2026, 15:30", status: "Confirmado" },
  { code: "TKT-99216", hash: "SHA-256 #8823", name: "Valentina Gómez Peña", doc: "1.115.342.900", access: "Fast-Track / Palco", issued: "24 Oct 2026, 16:02", status: "Ingresado" },
  { code: "TKT-99217", hash: "SHA-256 #8824", name: "Mateo Silva Bernal", doc: "1.033.456.789", access: "General", issued: "24 Oct 2026, 16:45", status: "Confirmado" },
  { code: "TKT-99218", hash: "SHA-256 #8825", name: "Camila Torres Ortiz", doc: "1.018.765.432", access: "VIP", issued: "24 Oct 2026, 17:10", status: "Ingresado" },
  { code: "TKT-99219", hash: "SHA-256 #8826", name: "Alejandro Morales Díaz", doc: "1.077.654.321", access: "General", issued: "24 Oct 2026, 17:25", status: "Confirmado" },
  { code: "TKT-99220", hash: "SHA-256 #8827", name: "Mariana Restrepo", doc: "1.054.329.871", access: "Fast-Track / Palco", issued: "24 Oct 2026, 17:40", status: "Ingresado" },
  { code: "TKT-99221", hash: "SHA-256 #8828", name: "David Fernando Castro", doc: "1.020.912.443", access: "VIP", issued: "24 Oct 2026, 17:55", status: "Confirmado" },
];

/** Totales del padrón completo (la tabla solo muestra la primera página). */
export const attendeeTotals = { all: 1450, pending: 470, checkedIn: 980, cancelled: 0, batches: 420 };

/* ---------- Accesos en vivo ---------- */

export const gates = [
  { name: "Puerta 1", zone: "Acceso General Norte", operator: "Carlos R.", terminal: "#ES-01", battery: 88, network: "Red 5G", scans: 620, perMin: 18, load: 62, flowLabel: "Flujo de Tránsito" },
  { name: "Puerta 2", zone: "Acceso General Sur", operator: "Laura M.", terminal: "#ES-02", battery: 94, network: "Red 5G", scans: 580, perMin: 16, load: 58, flowLabel: "Flujo de Tránsito" },
  { name: "Puerta 3", zone: "Acceso VIP / Prensa", operator: "Andrés P.", terminal: "#ES-03", battery: 79, network: "Red Mesh", scans: 250, perMin: 8, load: 25, flowLabel: "Fast-Track Prioritario" },
];

export type Validation =
  | { kind: "ok"; name: string; verb: string; gate: string; qr: string; terminal: string; ago: string }
  | { kind: "alert"; title: string; gate: string; ticket: string; detail: string; ago: string };

export const validations: Validation[] = [
  { kind: "ok", name: "Juan Mendoza", verb: "validado en", gate: "Puerta 1 - Acceso General Norte", qr: "QR SHA-256 #6821", terminal: "Terminal ES-01", ago: "Hace 5 segundos" },
  { kind: "ok", name: "María López", verb: "validada en", gate: "Puerta 2 - Acceso General Sur", qr: "QR SHA-256 #6822", terminal: "Terminal ES-02", ago: "Hace 12 segundos" },
  { kind: "alert", title: "¡ALERTA! Intento de reingreso (Boleto Ya Utilizado)", gate: "Puerta 1", ticket: "Boleto #TKT-89102", detail: "Primer ingreso registrado: 18:42 hrs en Puerta 1", ago: "Hace 1 minuto" },
];

/* ---------- Reportes ---------- */

export const hourlyScans = [
  { label: "16:00", value: 95 },
  { label: "17:00", value: 150 },
  { label: "18:00", value: 245 },
  { label: "19:00", value: 340 },
  { label: "20:00", value: 280 },
  { label: "21:00", value: 160 },
  { label: "22:00", value: 105 },
];

export const auditRows = [
  { range: "19:00 - 20:00", north: 220, south: 120, cumulative: "1,135 asistentes (56.7%)", speed: "11.3 scans/min" },
  { range: "20:00 - 21:00", north: 195, south: 120, cumulative: "1,450 asistentes (72.5%)", speed: "10.5 scans/min" },
];
