import QRCode from "qrcode";

/* =========================================================
   QR real y escaneable del boleto.
   Contenido: "EVENTSMART:<código>" → lo lee la vista /staff.
   Corrección de errores H (30%) para tolerar el logo central.
   ========================================================= */

export const QR_PREFIX = "EVENTSMART:";
const MARGIN = 2; // zona de silencio (módulos)

export default function QrCode({ seed, className = "" }: { seed: string; className?: string }) {
  const { modules } = QRCode.create(`${QR_PREFIX}${seed}`, { errorCorrectionLevel: "H" });
  const n = modules.size;
  const total = n + MARGIN * 2;

  // Un solo <path> con todos los módulos oscuros (más liviano que un <rect> por módulo)
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (modules.get(r, c)) d += `M${c + MARGIN} ${r + MARGIN}h1v1h-1z`;
    }
  }

  return (
    <div className={`relative ${className}`}>
      <svg viewBox={`0 0 ${total} ${total}`} className="size-full text-ink" shapeRendering="crispEdges" role="img" aria-label={`Código QR del boleto ${seed}`}>
        <rect width={total} height={total} fill="white" />
        <path d={d} fill="currentColor" />
      </svg>
      <span className="absolute left-1/2 top-1/2 flex size-[18%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-brand text-white ring-2 ring-white">
        <svg viewBox="0 0 24 24" className="size-1/2" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      </span>
    </div>
  );
}

/** Marco con esquinas azules alrededor del QR. */
export function ScanFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute -left-1 -top-1 size-5 rounded-tl-md border-l-[2.5px] border-t-[2.5px] border-brand" />
      <span className="absolute -right-1 -top-1 size-5 rounded-tr-md border-r-[2.5px] border-t-[2.5px] border-brand" />
      <span className="absolute -bottom-1 -left-1 size-5 rounded-bl-md border-b-[2.5px] border-l-[2.5px] border-brand" />
      <span className="absolute -bottom-1 -right-1 size-5 rounded-br-md border-b-[2.5px] border-r-[2.5px] border-brand" />
      {children}
    </div>
  );
}
