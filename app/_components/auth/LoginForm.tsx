"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthTitle } from "./AuthShell";
import { Divider, Field, GoogleButton, PasswordField, SubmitButton, icons } from "./fields";

export default function LoginForm() {
  const router = useRouter();
  return (
    <>
      <AuthTitle lead="Inicia sesión en" subtitle="Ingresa tus datos para acceder a tus boletos y eventos" />
      <GoogleButton />
      <Divider>O continúa con tu correo</Divider>

      {/* TODO: conectar con la autenticación real */}
      <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          router.push("/mis-boletos");
        }}>
        <Field id="email" label="Correo electrónico" icon={icons.mail} type="email" placeholder="tu@correo.com" autoComplete="email" required />
        <PasswordField id="password" label="Contraseña" placeholder="••••••••••••" autoComplete="current-password" required />

        <label className="flex cursor-pointer items-center gap-2 text-[12px] text-muted">
          <input type="checkbox" className="size-3.5 accent-brand" />
          Recordarme por 30 días
        </label>

        <div className="pt-1">
          <SubmitButton>Iniciar Sesión</SubmitButton>
        </div>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-muted">
        ¿No tienes una cuenta?{" "}
        <Link href="/registro" className="font-bold text-brand hover:underline">
          Regístrate gratis
        </Link>
      </p>
      <p className="mt-6 text-center text-[11px] text-faint">
        Al continuar, aceptas nuestros{" "}
        <a href="#" className="underline hover:text-ink">
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a href="#" className="underline hover:text-ink">
          Privacidad
        </a>
      </p>
    </>
  );
}
