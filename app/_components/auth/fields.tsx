"use client";

import { useState } from "react";

const inputBase =
  "w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-[13px] text-ink outline-none transition-all placeholder:text-faint focus:border-brand focus:ring-3 focus:ring-brand/12";

export const icons = {
  user: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

type FieldProps = {
  label: React.ReactNode;
  icon: React.ReactNode;
  iconClass?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, icon, iconClass = "text-faint", id, ...props }: FieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-ink">{label}</span>
      <span className="relative flex items-center">
        <span className={`pointer-events-none absolute left-3.5 ${iconClass}`}>{icon}</span>
        <input id={id} className={inputBase} {...props} />
      </span>
    </label>
  );
}

export function PasswordField({ label, icon = icons.lock, iconClass, ...props }: Omit<FieldProps, "icon"> & { icon?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <label htmlFor={props.id} className="block">
      <span className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-ink">{label}</span>
      <span className="relative flex items-center">
        <span className={`pointer-events-none absolute left-3.5 ${iconClass ?? "text-faint"}`}>{icon}</span>
        <input type={show ? "text" : "password"} className={inputBase} {...props} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 cursor-pointer text-faint transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            {show && <line x1="3" y1="3" x2="21" y2="21" />}
          </svg>
        </button>
      </span>
    </label>
  );
}

export function GoogleButton() {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white py-2.5 text-[13px] font-bold text-ink transition-colors hover:bg-slate-50"
    >
      <svg viewBox="0 0 48 48" width="17" height="17">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      Continuar con Google
    </button>
  );
}

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.08em] text-faint">
      <span className="h-px flex-1 bg-slate-200" />
      {children}
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand py-3 text-[13.5px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)] transition-all hover:-translate-y-px hover:bg-brand-dark"
    >
      {children}
    </button>
  );
}
