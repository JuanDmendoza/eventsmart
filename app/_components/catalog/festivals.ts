/* =========================================================
   Datos de ejemplo del catálogo.
   `scene` arma un fondo con gradientes que simula una foto
   (escenario + luces + siluetas del público). Cuando tengas
   imágenes reales, cambia `background` por `image`.
   ========================================================= */

export type Category = "electronica" | "indie" | "cultural" | "urbano";

export type TagTone = "white" | "red" | "green" | "gold";

export type Festival = {
  id: string;
  name: string;
  city: string;
  date: string;
  tag: string;
  tone: TagTone;
  category: Category;
  /** Alto en px en escritorio; en teléfono se escala (ver Catalog). */
  height: number;
  background: string;
};

export const categories: { id: Category | "todos"; label: string }[] = [
  { id: "todos", label: "Todos los Festivales" },
  { id: "electronica", label: "Música Electrónica" },
  { id: "indie", label: "Indie & Rock" },
  { id: "cultural", label: "Festivales Culturales" },
  { id: "urbano", label: "Urbano & Trap" },
];

function scene(sky: [string, string], glow: string, opts: { beams?: boolean; crowd?: string } = {}) {
  const crowd = opts.crowd ?? "#020617";
  const layers = [
    // siluetas del público
    `radial-gradient(circle at 50% 100%, ${crowd} 55%, transparent 57%) left bottom / 26px 38px repeat-x`,
    `radial-gradient(circle at 50% 100%, ${crowd} 55%, transparent 57%) 13px calc(100% - 14px) / 30px 34px repeat-x`,
    `linear-gradient(180deg, transparent 62%, ${crowd} 100%)`,
  ];
  if (opts.beams) {
    layers.push(
      "conic-gradient(from 160deg at 30% 0%, transparent 0deg, rgb(255 255 255 / 0.22) 8deg, transparent 16deg)",
      "conic-gradient(from 185deg at 70% 0%, transparent 0deg, rgb(255 255 255 / 0.22) 8deg, transparent 16deg)",
    );
  }
  layers.push(`radial-gradient(ellipse at 50% 38%, ${glow} 0%, transparent 55%)`, `linear-gradient(170deg, ${sky[0]}, ${sky[1]})`);
  return layers.join(", ");
}

// Ordenados por columna (el masonry con CSS columns llena de arriba a abajo)
export const festivals: Festival[] = [
  {
    id: "ultra-bass",
    name: "Ultra Bass Arena",
    city: "Bogotá",
    date: "15 AGO",
    tag: "Últimos Lugares",
    tone: "white",
    category: "electronica",
    height: 300,
    background: scene(["#1e1b4b", "#0f172a"], "rgb(147 51 234 / 0.9)", { beams: true }),
  },
  {
    id: "rock-al-parque",
    name: "Noches de Rock",
    city: "Medellín",
    date: "22 SEP",
    tag: "Fase 2",
    tone: "white",
    category: "indie",
    height: 230,
    background: scene(["#7c2d12", "#1c1917"], "rgb(251 146 60 / 0.9)", { beams: true }),
  },
  {
    id: "aqua-sound",
    name: "Aqua Sound",
    city: "Cartagena",
    date: "04 OCT",
    tag: "Preventa VIP",
    tone: "white",
    category: "electronica",
    height: 220,
    background: scene(["#134e4a", "#042f2e"], "rgb(45 212 191 / 0.85)", { beams: true }),
  },
  {
    id: "global-fest",
    name: "Global Fest",
    city: "Ciudad de México",
    date: "18 NOV",
    tag: "Sold Out 85%",
    tone: "red",
    category: "urbano",
    height: 180,
    background: scene(["#78350f", "#1c1917"], "rgb(253 224 71 / 0.85)"),
  },
  {
    id: "bosque-sonoro",
    name: "Bosque Sonoro",
    city: "Salento",
    date: "12 DIC",
    tag: "Eco-Friendly",
    tone: "green",
    category: "cultural",
    height: 330,
    background: scene(["#3f6212", "#14532d"], "rgb(217 249 157 / 0.75)", { crowd: "#1a2e05" }),
  },
  {
    id: "trap-nation",
    name: "Trap Nation Live",
    city: "Cali",
    date: "10 ENE",
    tag: "Trending #1",
    tone: "gold",
    category: "urbano",
    height: 260,
    background: scene(["#450a0a", "#0f172a"], "rgb(239 68 68 / 0.8)", { beams: true }),
  },
  {
    id: "jazz-nights",
    name: "Jazz & Soul Nights",
    city: "Barranquilla",
    date: "28 ENE",
    tag: "Pocos Cupos",
    tone: "white",
    category: "cultural",
    height: 300,
    background: scene(["#451a03", "#0c0a09"], "rgb(245 158 11 / 0.85)"),
  },
  {
    id: "mountain-beats",
    name: "Mountain Beats",
    city: "Manizales",
    date: "14 FEB",
    tag: "Acceso QR Rápido",
    tone: "white",
    category: "electronica",
    height: 180,
    background: scene(["#172554", "#020617"], "rgb(96 165 250 / 0.85)", { beams: true }),
  },
  {
    id: "picnic-indie",
    name: "Picnic Indie",
    city: "Villa de Leyva",
    date: "02 MAR",
    tag: "Fase 1",
    tone: "white",
    category: "indie",
    height: 340,
    background: scene(["#65a30d", "#365314"], "rgb(254 240 138 / 0.8)", { crowd: "#1a2e05" }),
  },
  {
    id: "cubo-360",
    name: "Cubo 360°",
    city: "Bogotá",
    date: "20 MAR",
    tag: "Escenario 360°",
    tone: "white",
    category: "electronica",
    height: 290,
    background: scene(["#0f172a", "#020617"], "rgb(34 211 238 / 0.8)", { beams: true }),
  },
  {
    id: "fire-stage",
    name: "Fire Stage",
    city: "Medellín",
    date: "03 ABR",
    tag: "Headliners",
    tone: "white",
    category: "electronica",
    height: 240,
    background: scene(["#7f1d1d", "#1c1917"], "rgb(251 113 133 / 0.85)", { beams: true }),
  },
  {
    id: "palm-sunset",
    name: "Palm Sunset Fest",
    city: "Santa Marta",
    date: "18 ABR",
    tag: "Pase All-Access",
    tone: "white",
    category: "urbano",
    height: 230,
    background: scene(["#7c3aed", "#db2777"], "rgb(251 146 60 / 0.9)"),
  },
];
