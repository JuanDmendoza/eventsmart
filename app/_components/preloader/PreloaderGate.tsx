"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import Preloader from "./Preloader";

type Phase = "loading" | "leaving" | "done";

/** Búsqueda del navbar, compartida con el contenido de la página. */
const SearchContext = createContext("");
export const useNavbarSearch = () => useContext(SearchContext);

// Vive mientras la pestaña no se recargue: al volver a "/" con navegación
// del cliente (p. ej. desde /login) no se repite el preloader.
let hasPlayed = false;

/**
 * El navbar se monta una sola vez y queda fijo arriba: durante el preloader
 * solo se ve el logo, y al terminar aparecen links/búsqueda/acciones.
 * El preloader se desvanece debajo del navbar, así no hay salto visual.
 * `?app=1` en la URL salta directo a la app.
 */
export default function PreloaderGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() => (hasPlayed ? "done" : "loading"));
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("app")) {
      hasPlayed = true;
      queueMicrotask(() => setPhase("done"));
    }
  }, []);

  const leave = () => {
    hasPlayed = true;
    setPhase("leaving");
    setTimeout(() => setPhase("done"), 500);
  };

  return (
    <SearchContext value={search}>
      <Navbar ready={phase !== "loading"} search={search} onSearch={setSearch} />

      {phase !== "done" && (
        <Preloader
          onFinish={leave}
          className={`transition-opacity duration-500 ease-smooth ${phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"}`}
        />
      )}

      <div
        className={`flex flex-1 flex-col transition-all duration-500 ease-smooth ${
          phase === "loading" ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {children}
        {phase === "done" && (
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0 });
              setPhase("loading");
            }}
            className="fixed bottom-6 right-7 z-200 flex cursor-pointer items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2.5 text-xs font-bold text-brand shadow-[0_10px_25px_-4px_rgba(37,99,235,0.2)] transition-all duration-250 ease-spring hover:-translate-y-0.5 hover:bg-brand hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Probar Preloader
          </button>
        )}
      </div>
    </SearchContext>
  );
}
