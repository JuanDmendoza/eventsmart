import type { Metadata, Viewport } from "next";
import StaffApp from "./_components/StaffApp";

export const metadata: Metadata = {
  title: "Control de Puerta · EventSmart Staff",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  // Evita zoom accidental al tocar rápido los botones del teclado numérico
  maximumScale: 1,
};

export default function StaffPage() {
  return <StaffApp />;
}
