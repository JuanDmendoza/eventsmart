"use client";

import { useSyncExternalStore } from "react";
import { useValidator } from "../_lib/useValidator";
import StaffDesktop from "./StaffDesktop";
import StaffMobile from "./StaffMobile";

const QUERY = "(min-width: 1024px)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Renderiza SOLO una de las dos interfaces (no ambas ocultas con CSS),
 * para no abrir la cámara dos veces. El estado del turno se comparte.
 */
export default function StaffApp() {
  const desktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => null,
  );
  const v = useValidator();

  if (desktop === null) {
    return <div className="flex min-h-dvh items-center justify-center bg-slate-50 text-[13px] text-muted">Cargando puesto de control…</div>;
  }
  return desktop ? <StaffDesktop v={v} /> : <StaffMobile v={v} />;
}
