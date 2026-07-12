"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DateIdeaForm({ idea }: { idea: string }) {
  const router = useRouter();

  const [value, setValue] = useState(idea);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  async function handleSave() {
    setBusy(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/admin/date-idea", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idea: value }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Plan de cita
      </label>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("idle");
        }}
        rows={3}
        placeholder="Describe el plan de la próxima cita..."
        className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={busy}
          className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Guardando..." : "Guardar plan"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Guardado
          </span>
        )}
        {status === "error" && (
          <span className="text-sm text-rose-600 dark:text-rose-400">
            No se pudo guardar.
          </span>
        )}
      </div>
    </div>
  );
}
