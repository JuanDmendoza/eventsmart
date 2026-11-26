/* =========================================================
   Datos de ejemplo del cliente. Reemplazar por la sesión /
   API real cuando exista backend.
   ========================================================= */

export const client = {
  name: "Sofía Velázquez",
  firstName: "Sofía",
  initials: "SV",
  dni: "4892104-K",
};

export const activeTicket = {
  id: "TKT-99214",
  festival: "ElectroVibes Festival 2025",
  name: "ElectroVibes Summer Arena 2025",
  shortName: "ElectroVibes Summer Arena",
  venue: "Parque Bicentenario, CDMX",
  stage: "Escenario Principal Norte",
  tier: "VIP ACCESS · GOLD TIER",
  zone: "Puerta A Palcos",
  zoneDetail: "Nivel 2 · Palco N-14",
  cashless: "$1,000.00 MXN",
  date: "15 Julio 2025",
  opening: "19:00 hrs",
  startsIn: "4 horas",
  gate: "Puerta A",
  turnstile: "Torniquete A-04",
};

export const venueCapacity = {
  current: 41200,
  max: 50000,
  activeTurnstiles: 8,
  waitMinutes: 4,
};

export const pastTickets = [
  { id: "TKT-81022", name: "Neon Summer Fest 2025", date: "15 Ene 2025", venue: "Costa Verde Park", zone: "General" },
  { id: "TKT-77310", name: "Indie Sounds Weekend", date: "05 Dic 2024", venue: "Club Hípico Central", zone: "Fast-Track" },
  { id: "TKT-70154", name: "Festival Sunset 2024", date: "24 Oct 2024", venue: "Explanada Arena Norte", zone: "VIP" },
];

export const benefits = [
  {
    title: "Validación Fast-Track",
    text: "Acceso prioritario directo sin tiempos de espera. Escaneo contactless en los 12 torniquetes inteligentes de Puerta A.",
    status: "FILA CERO OPERATIVA",
    tone: "green" as const,
  },
  {
    title: "Blindaje Criptográfico",
    text: "Firma asimétrica anti-fraude verificada en cadena por EventSmart Gate Engine. Garantía total contra clonación de entrada.",
    status: "PROTOCOLO SHA-256 v4",
    tone: "blue" as const,
  },
];
