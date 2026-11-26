import type { Metadata } from "next";
import AuthShell from "../_components/auth/AuthShell";
import { TicketDevice } from "../_components/auth/devices";
import RegisterForm from "../_components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta · EventSmart",
};

export default function RegisterPage() {
  return (
    <AuthShell device={<TicketDevice />}>
      <RegisterForm />
    </AuthShell>
  );
}
