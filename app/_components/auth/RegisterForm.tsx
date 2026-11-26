"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthTitle } from "./AuthShell";
import { Divider, Field, GoogleButton, PasswordField, SubmitButton, icons } from "./fields";

function strength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.max(1, score);
}

const levels = [
  { label: "", text: "", bar: "" },
  { label: "Débil", text: "text-rose-500", bar: "bg-rose-400" },
  { label: "Media", text: "text-amber-500", bar: "bg-amber-400" },
  { label: "Buena", text: "text-emerald-500", bar: "bg-emerald-400" },
  { label: "Alta seguridad", text: "text-emerald-600", bar: "bg-emerald-500" },
];

export default function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const score = strength(password);
  const level = levels[score];
  const matches = confirm.length > 0 && confirm === password;
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <>
      <AuthTitle lead="Crear cuenta en" subtitle="Únete a miles de asistentes y gestiona tus boletos de forma segura." />
      <GoogleButton />
      <Divider>O regístrate con tu correo</Divider>

      {/* TODO: conectar con el registro real */}
      <form className="space-y-3.5" onSubmit={(e) => {
          e.preventDefault();
          if (password !== confirm) return;
          router.push("/mis-boletos");
        }}>
        <Field id="name" label="Nombre completo" icon={icons.user} placeholder="Ej. Sofía Velázquez" autoComplete="name" required />
        <Field id="email" label="Correo electrónico" icon={icons.mail} type="email" placeholder="tu@correo.com" autoComplete="email" required />

        <div>
          <PasswordField
            id="password"
            label={
              <>
                Contraseña
                {score > 0 && <span className={`text-[11px] font-bold ${level.text}`}>● {level.label}</span>}
              </>
            }
            placeholder="••••••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-colors duration-300 ${i <= score ? level.bar : "bg-slate-200"}`}
              />
            ))}
          </div>
        </div>

        <PasswordField
          id="confirm"
          label={
            <>
              Confirmar contraseña
              {mismatch && <span className="text-[11px] font-bold text-rose-500">No coinciden</span>}
            </>
          }
          icon={icons.check}
          iconClass={matches ? "text-emerald-500" : "text-faint"}
          placeholder="••••••••••••"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <label className="flex cursor-pointer items-start gap-2 pt-1 text-[12px] leading-snug text-muted">
          <input type="checkbox" required className="mt-0.5 size-3.5 shrink-0 accent-brand" defaultChecked />
          <span>
            Acepto los{" "}
            <a href="#" className="font-bold text-brand hover:underline">
              Términos de Servicio
            </a>{" "}
            y la{" "}
            <a href="#" className="font-bold text-brand hover:underline">
              Política de Privacidad
            </a>{" "}
            de EventSmart.
          </span>
        </label>

        <div className="pt-1">
          <SubmitButton>Crear Cuenta →</SubmitButton>
        </div>
      </form>

      <p className="mt-5 text-center text-[12.5px] text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-brand hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </>
  );
}
