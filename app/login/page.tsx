import type { Metadata } from "next";
import AuthShell from "../_components/auth/AuthShell";
import { DashboardDevice } from "../_components/auth/devices";
import LoginForm from "../_components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión · EventSmart",
};

export default function LoginPage() {
  return (
    <AuthShell device={<DashboardDevice />}>
      <LoginForm />
    </AuthShell>
  );
}
