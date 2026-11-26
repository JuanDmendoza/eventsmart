"use client";

import { useCallback, useRef, useState } from "react";
import { findTicket, station, type PassType, type Ticket } from "./tickets";

/* =========================================================
   Estado de validación del turno: historial, boletos ya usados
   e incidencias. Vive en memoria del dispositivo.
   ========================================================= */

export type Status = "valid" | "used" | "invalid";

export type Validation = {
  id: number;
  status: Status;
  input: string;
  method: "qr" | "manual";
  time: string;
  at: number;
  ms: number;
  ticket?: Ticket;
  /** Para "used": cuándo y dónde se usó por primera vez. */
  firstUse?: { time: string; gate: string };
};

export type Incident = {
  id: number;
  type: string;
  urgency: "Baja" | "Media" | "Alta" | "Crítica";
  notes: string;
  time: string;
};

const clock = (d = new Date()) => d.toTimeString().slice(0, 8);

type Seed = { time: string; code: string; holder: string; pass: PassType | "Desconocido"; status: Status; firstUse?: { time: string; gate: string } };

// Historial inicial del turno (mismo que en el diseño)
const seed: Seed[] = [
  { time: "19:41:50", code: "AA-902", holder: "Camila Morales T.", pass: "VIP Lounge", status: "valid" },
  { time: "19:41:12", code: "VIP-103", holder: "Ignacio Valenzuela", pass: "VIP Lounge", status: "used", firstUse: { time: "18:42", gate: "Puerta 2" } },
  { time: "19:40:48", code: "ASDK-001", holder: "Código No Registrado", pass: "Desconocido", status: "invalid" },
  { time: "19:39:58", code: "AA-095", holder: "Fernanda Lagos P.", pass: "General", status: "valid" },
  { time: "19:38:28", code: "AA-091", holder: "Rodrigo San Martín", pass: "General", status: "valid" },
];

const initialHistory: Validation[] = seed.map((s, i) => ({
  id: -i - 1,
  status: s.status,
  input: s.code,
  method: "qr",
  time: s.time,
  at: 0,
  ms: 120,
  ticket: findTicket(s.code),
  firstUse: s.firstUse,
}));

const initialUsed = new Map<string, { time: string; gate: string }>([
  ["AA-902", { time: "19:41", gate: station.gate }],
  ["VIP-103", { time: "18:42", gate: "Puerta 2" }],
  ["AA-095", { time: "19:39", gate: station.gate }],
  ["AA-091", { time: "19:38", gate: station.gate }],
]);

let nextId = 1;

export function useValidator() {
  const [history, setHistory] = useState<Validation[]>(initialHistory);
  // Ref (no estado): dos lecturas seguidas del mismo QR deben ver el primer uso al instante
  const used = useRef(new Map(initialUsed));
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const validate = useCallback(
    (input: string, method: Validation["method"]): Validation => {
      const start = performance.now();
      const now = new Date();
      const ticket = findTicket(input);
      const prior = ticket ? used.current.get(ticket.code) : undefined;
      const status: Status = !ticket ? "invalid" : prior ? "used" : "valid";

      const result: Validation = {
        id: nextId++,
        status,
        input: input.trim(),
        method,
        time: clock(now),
        at: now.getTime(),
        ms: Math.max(1, Math.round(performance.now() - start)),
        ticket,
        firstUse: prior,
      };

      if (ticket && status === "valid") {
        used.current.set(ticket.code, { time: clock(now).slice(0, 5), gate: station.gate });
      }
      setHistory((h) => [result, ...h]);
      return result;
    },
    [],
  );

  const reportIncident = useCallback((i: Omit<Incident, "id" | "time">) => {
    setIncidents((list) => [{ ...i, id: nextId++, time: clock() }, ...list]);
  }, []);

  const stats = {
    total: history.length,
    ok: history.filter((h) => h.status === "valid").length,
    duplicates: history.filter((h) => h.status === "used").length,
    invalid: history.filter((h) => h.status === "invalid").length,
  };

  return { history, validate, incidents, reportIncident, stats };
}

/* ---------- Feedback físico: vibración + tono ---------- */

let audio: AudioContext | null = null;

export function feedback(status: Status) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(status === "valid" ? 80 : [120, 80, 120, 80, 120]);
  }
  try {
    audio ??= new AudioContext();
    const tones = status === "valid" ? [[880, 0, 0.12]] : status === "used" ? [[440, 0, 0.15], [440, 0.2, 0.15]] : [[220, 0, 0.35]];
    for (const [freq, delay, dur] of tones) {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = freq;
      osc.type = status === "valid" ? "sine" : "square";
      gain.gain.value = 0.08;
      osc.connect(gain).connect(audio.destination);
      const t = audio.currentTime + delay;
      osc.start(t);
      osc.stop(t + dur);
    }
  } catch {
    // Sin audio disponible: solo vibración / visual
  }
}
