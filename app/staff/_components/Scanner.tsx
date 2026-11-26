"use client";

import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   Lector de QR con la cámara (getUserMedia + jsQR).
   - La cámara queda encendida mientras el componente existe;
     `paused` solo detiene la decodificación (reanudar es instantáneo).
   - Solo decodifica el recuadro central (más rápido y evita leer
     códigos que no se están apuntando).
   - Requiere contexto seguro: https:// o localhost.
   ========================================================= */

type CamError = "insecure" | "denied" | "unavailable";

const errorText: Record<CamError, string> = {
  insecure: "La cámara solo funciona en conexión segura (https). Abre la app con https o usa el ingreso manual.",
  denied: "Permiso de cámara denegado. Habilítalo en los ajustes del navegador o usa el ingreso manual.",
  unavailable: "No se encontró una cámara disponible en este dispositivo.",
};

const SCAN_EVERY_MS = 120;
const SAME_CODE_COOLDOWN_MS = 3000;

export default function Scanner({
  onDetect,
  paused = false,
  flash,
  hint = "Mueva el código QR al recuadro",
  label,
  onManual,
  className = "",
}: {
  onDetect: (text: string) => void;
  paused?: boolean;
  /** Color del borde tras una lectura. */
  flash?: "valid" | "used" | "invalid" | null;
  hint?: string;
  label?: string;
  onManual?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onDetectRef = useRef(onDetect);
  const pausedRef = useRef(paused);
  const lastRef = useRef({ text: "", at: 0 });

  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<CamError | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onDetectRef.current = onDetect;
    pausedRef.current = paused;
  }, [onDetect, paused]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      if (video && !pausedRef.current && video.readyState >= video.HAVE_ENOUGH_DATA) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const side = Math.min(vw, vh) * 0.75; // recuadro central
        const size = 480;
        const canvas = (canvasRef.current ??= document.createElement("canvas"));
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, (vw - side) / 2, (vh - side) / 2, side, side, 0, 0, size, size);
          const img = ctx.getImageData(0, 0, size, size);
          const code = jsQR(img.data, size, size, { inversionAttempts: "dontInvert" });
          if (code?.data) {
            const now = Date.now();
            const last = lastRef.current;
            if (code.data !== last.text || now - last.at > SAME_CODE_COOLDOWN_MS) {
              lastRef.current = { text: code.data, at: now };
              onDetectRef.current(code.data);
            }
          }
        }
      }
      timer = setTimeout(tick, SCAN_EVERY_MS);
    };

    (async () => {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setError("insecure");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch (e) {
        setError(e instanceof DOMException && e.name === "NotAllowedError" ? "denied" : "unavailable");
        return;
      }
      if (stopped) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        // autoplay bloqueado: el usuario puede tocar el video
      }
      setError(null);
      setReady(true);
      tick();
    })();

    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
      setReady(false);
    };
  }, [facing]);

  const ring =
    flash === "valid" ? "ring-emerald-400" : flash === "used" ? "ring-amber-400" : flash === "invalid" ? "ring-rose-500" : "ring-transparent";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-950 ring-4 transition-[box-shadow] duration-300 ${ring} ${className}`}>
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        onClick={() => videoRef.current?.play()}
        className={`absolute inset-0 size-full object-cover ${facing === "user" ? "-scale-x-100" : ""}`}
      />

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-white/10 text-xl text-white">📷</span>
          <p className="max-w-[280px] text-[12.5px] leading-relaxed text-white/80">{errorText[error]}</p>
          {onManual && (
            <button type="button" onClick={onManual} className="cursor-pointer rounded-lg bg-white px-4 py-2 text-[12.5px] font-bold text-ink">
              Ir a ingreso manual
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Recuadro de enfoque: oscurece todo menos el centro */}
          <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.55)]">
            <span className="absolute -left-0.5 -top-0.5 size-8 rounded-tl-2xl border-l-4 border-t-4 border-brand-glow" />
            <span className="absolute -right-0.5 -top-0.5 size-8 rounded-tr-2xl border-r-4 border-t-4 border-brand-glow" />
            <span className="absolute -bottom-0.5 -left-0.5 size-8 rounded-bl-2xl border-b-4 border-l-4 border-brand-glow" />
            <span className="absolute -bottom-0.5 -right-0.5 size-8 rounded-br-2xl border-b-4 border-r-4 border-brand-glow" />
            {ready && !paused && (
              <span className="absolute inset-x-3 h-0.5 animate-scan-line rounded-full bg-brand-glow shadow-[0_0_12px_2px_rgba(59,130,246,0.7)]" />
            )}
            {!ready && (
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white/70">
                Iniciando cámara…
              </span>
            )}
          </div>
          <p className="absolute inset-x-0 bottom-[12%] text-center text-[12px] font-semibold text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {paused ? "Lectura en pausa" : hint}
          </p>
        </>
      )}

      {label && (
        <span className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">
          {label}
        </span>
      )}
      {!error && (
        <button
          type="button"
          onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
          title="Cambiar cámara"
          className="absolute bottom-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <path d="M9 13a3 3 0 0 1 5.2-2M15 13a3 3 0 0 1-5.2 2" />
          </svg>
        </button>
      )}
    </div>
  );
}
