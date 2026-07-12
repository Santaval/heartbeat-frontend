"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        window.location.href = "/";
        return;
      }
      setError("Contraseña incorrecta");
    } catch {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4 py-16 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-sm rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-rose-100 backdrop-blur dark:bg-zinc-900/90 dark:ring-zinc-800">
        <div className="mb-6 text-center">
          <div className="text-4xl">❤️</div>
          <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Heartbeat
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ingresa tu contraseña para continuar
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
          />

          {error && (
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-500 px-4 py-3 font-medium text-white transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-rose-800"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
