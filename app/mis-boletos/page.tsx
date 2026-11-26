import type { Metadata } from "next";
import Navbar from "../_components/Navbar";
import SiteFooter from "../_components/SiteFooter";
import { CapacityCard, CapacityGlass } from "../_components/tickets/CapacityCard";
import { activeTicket as t, client } from "../_components/tickets/data";
import MobileTabBar from "../_components/tickets/MobileTabBar";
import TicketCard, { DownloadIcon, WalletIcon } from "../_components/tickets/TicketCard";
import TicketTabs from "../_components/tickets/TicketTabs";

export const metadata: Metadata = {
  title: "Mis Boletos · EventSmart",
};

export default function MisBoletosPage() {
  return (
    <>
      <Navbar active="boletos" user={{ name: client.name, initials: client.initials, tickets: 1 }} />

      {/* Hero de bienvenida (escritorio) */}
      <section className="relative overflow-hidden bg-linear-to-r from-brand via-blue-600 to-sky-700 max-md:hidden">
        <div className="pointer-events-none absolute -left-20 top-0 size-[360px] rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-7 py-9">
          <div className="text-white">
            <h1 className="text-[34px] font-extrabold tracking-[-0.02em]">
              ¡Hola,{" "}
              <span className="inline-block align-[-3px] font-script text-[1.35em] font-normal tracking-normal">
                {client.firstName}
              </span>
            </h1>
            <p className="mt-1 max-w-[460px] text-[13.5px] leading-relaxed text-white/90">
              <strong>{t.festival}</strong> comienza en{" "}
              <strong className="underline decoration-white/50 underline-offset-2">{t.startsIn}</strong>. Tu acceso
              preferencial por{" "}
              <span className="rounded bg-white/20 px-1.5 py-0.5 font-bold">{t.gate}</span> ya está listo para escaneo
              rápido.
            </p>
          </div>
          <CapacityGlass />
        </div>
      </section>

      <main className="flex-1 bg-slate-50 pb-24 md:pb-14">
        <div className="mx-auto max-w-[1320px] px-4 pt-4 md:px-7 md:pt-8">
          <div className="mb-4 flex items-end justify-between max-md:hidden">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
              Detalle de Boleto{" "}
              <span className="inline-block align-[-3px] font-script text-[1.4em] font-normal tracking-normal text-brand">
                Digital
              </span>
            </h2>
            <span className="text-[11.5px] font-semibold text-muted">Boleto 1 de 1</span>
          </div>

          <TicketCard />

          {/* Acciones + aforo (teléfono) */}
          <div className="mt-4 space-y-2.5 md:hidden">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-[13px] font-bold text-white transition-colors active:bg-slate-800"
            >
              <WalletIcon /> Guardar en Apple / Google Wallet
            </button>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-[13px] font-semibold text-ink transition-colors active:bg-slate-50"
            >
              <DownloadIcon /> Descargar Boleto (PDF)
            </button>
            <div className="pt-2">
              <CapacityCard />
            </div>
          </div>

          <div className="mt-8 max-md:hidden">
            <TicketTabs />
          </div>
        </div>
      </main>

      <SiteFooter className="max-md:hidden" />
      <MobileTabBar active="boletos" badge={1} />
    </>
  );
}
