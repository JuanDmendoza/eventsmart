/* =========================================================
   Base local de boletos (simula la caché offline del molinete).
   Reemplazar por la API real de validación.
   ========================================================= */

export type PassType = "General" | "VIP Lounge" | "VIP Gold" | "Fast-Track / Palco";

export type Ticket = {
  code: string;
  holder: string;
  doc: string;
  pass: PassType;
  zone: string;
  gate: string;
  adult: boolean;
};

export const station = {
  gate: "Puerta Norte 01",
  sector: "General",
  turnstile: "Molinete Lector #04",
  event: "Festival Sunset 2026",
  operator: { name: "Carlos R.", initials: "CR", shift: "Turno Tarde" },
  cacheSize: 15420,
  occupancy: { current: 2380, max: 4000 },
};

/** Prefijo del contenido de los QR que genera EventSmart. */
export const QR_PREFIX = "EVENTSMART:";

export const tickets: Ticket[] = [
  { code: "TKT-99214", holder: "Sofía Velázquez", doc: "4892104-K", pass: "VIP Gold", zone: "Puerta A Palcos", gate: "Puerta A — Palco N-14", adult: true },
  { code: "AA-094", holder: "Mateo Silva R.", doc: "10.892.441-K", pass: "General", zone: "Acceso General Norte", gate: "Puerta 1 — Molinete 4", adult: true },
  { code: "AA-902", holder: "Camila Morales T.", doc: "18.492.102-K", pass: "VIP Lounge", zone: "VIP Lounge Norte", gate: "Puerta 1 — Molinete 2", adult: true },
  { code: "VIP-103", holder: "Ignacio Valenzuela", doc: "15.221.908-3", pass: "VIP Lounge", zone: "VIP Lounge Norte", gate: "Puerta 2 — Molinete 1", adult: true },
  { code: "AA-095", holder: "Fernanda Lagos P.", doc: "19.004.217-5", pass: "General", zone: "Acceso General Norte", gate: "Puerta 1 — Molinete 4", adult: true },
  { code: "AA-091", holder: "Rodrigo San Martín", doc: "12.773.640-2", pass: "General", zone: "Acceso General Norte", gate: "Puerta 1 — Molinete 3", adult: true },
  { code: "AA-096", holder: "Diego Valenzuela T.", doc: "20.118.554-1", pass: "General", zone: "Acceso General Norte", gate: "Puerta 1 — Molinete 4", adult: false },
  { code: "TKT-99215", holder: "Carlos Andrés Rivas", doc: "1.082.940.221", pass: "General", zone: "Cancha General", gate: "Puerta 1 — Molinete 1", adult: true },
  { code: "TKT-99217", holder: "Mateo Silva Bernal", doc: "1.033.456.789", pass: "General", zone: "Cancha General", gate: "Puerta 1 — Molinete 2", adult: true },
  { code: "TKT-99219", holder: "Alejandro Morales Díaz", doc: "1.077.654.321", pass: "General", zone: "Cancha General", gate: "Puerta 1 — Molinete 3", adult: true },
  { code: "TKT-99221", holder: "David Fernando Castro", doc: "1.020.912.443", pass: "VIP Gold", zone: "Platea Alta Norte", gate: "Puerta 3 — VIP", adult: true },
];

/** Deja solo letras y números en mayúscula: "10.892.441-k" → "10892441K". */
export const normalize = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Acepta el contenido de un QR ("EVENTSMART:TKT-99214"), un código o un documento. */
export function findTicket(input: string): Ticket | undefined {
  const raw = input.trim().toUpperCase();
  const key = normalize(raw.startsWith(QR_PREFIX) ? raw.slice(QR_PREFIX.length) : raw);
  if (!key) return undefined;
  return tickets.find((t) => normalize(t.code) === key || normalize(t.doc) === key);
}

/** Valida el formato básico de un documento (RUT/cédula/DNI): 6–12 caracteres, termina en dígito o K. */
export const isDocFormat = (s: string) => /^[0-9]{5,11}[0-9K]$/.test(normalize(s));
