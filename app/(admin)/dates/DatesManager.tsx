"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidDDMM, MAX_DATES } from "@/lib/dates";

type ImportantDate = {
  id: number;
  date: string;
  label: string;
  sortOrder: number;
};

export default function DatesManager({ dates }: { dates: ImportantDate[] }) {
  const router = useRouter();

  const [newDate, setNewDate] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const isBusy = busy !== null;
  const atMax = dates.length >= MAX_DATES;

  async function handleAdd() {
    const date = newDate.trim();
    const label = newLabel.trim();
    if (!isValidDDMM(date)) {
      setError("La fecha debe tener formato DD/MM (01..31 / 01..12).");
      return;
    }
    if (!label) {
      setError("La etiqueta no puede estar vacía.");
      return;
    }
    setError("");
    setBusy("add");
    try {
      const res = await fetch("/api/admin/dates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, label }),
      });
      if (!res.ok) throw new Error();
      setNewDate("");
      setNewLabel("");
      router.refresh();
    } catch {
      setError("No se pudo agregar la fecha.");
    } finally {
      setBusy(null);
    }
  }

  function startEdit(d: ImportantDate) {
    setEditingId(d.id);
    setEditDate(d.date);
    setEditLabel(d.label);
    setConfirmId(null);
    setError("");
  }

  async function handleSave(id: number) {
    const date = editDate.trim();
    const label = editLabel.trim();
    if (!isValidDDMM(date)) {
      setError("La fecha debe tener formato DD/MM (01..31 / 01..12).");
      return;
    }
    if (!label) {
      setError("La etiqueta no puede estar vacía.");
      return;
    }
    setError("");
    setBusy(`save-${id}`);
    try {
      const res = await fetch(`/api/admin/dates/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date, label }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      router.refresh();
    } catch {
      setError("No se pudo guardar la fecha.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setBusy(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/dates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmId(null);
      router.refresh();
    } catch {
      setError("No se pudo eliminar la fecha.");
    } finally {
      setBusy(null);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const a = dates[index];
    const b = dates[index + direction];
    if (!a || !b) return;
    setError("");
    setBusy(`move-${a.id}`);
    try {
      const res1 = await fetch(`/api/admin/dates/${a.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sortOrder: b.sortOrder }),
      });
      if (!res1.ok) throw new Error();
      const res2 = await fetch(`/api/admin/dates/${b.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sortOrder: a.sortOrder }),
      });
      if (!res2.ok) throw new Error();
      router.refresh();
    } catch {
      setError("No se pudo reordenar.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nueva fecha
        </div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="DD/MM"
            inputMode="numeric"
            disabled={atMax}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900 sm:max-w-[8rem]"
          />
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Etiqueta"
            disabled={atMax}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
          />
          <button
            onClick={handleAdd}
            disabled={isBusy || atMax}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "add" ? "Agregando..." : "Agregar"}
          </button>
        </div>
        {atMax && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Has alcanzado el máximo de {MAX_DATES} fechas.
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {dates.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No hay fechas todavía.
          </p>
        )}

        {dates.map((d, index) => {
          const isEditing = editingId === d.id;
          const isConfirming = confirmId === d.id;
          const isFirst = index === 0;
          const isLast = index === dates.length - 1;

          return (
            <div
              key={d.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      placeholder="DD/MM"
                      inputMode="numeric"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900 sm:max-w-[8rem]"
                    />
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Etiqueta"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(d.id)}
                      disabled={isBusy}
                      className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === `save-${d.id}` ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={isBusy}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleMove(index, -1)}
                        disabled={isBusy || isFirst}
                        aria-label="Subir"
                        className="rounded px-1 text-zinc-500 transition hover:text-zinc-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => handleMove(index, 1)}
                        disabled={isBusy || isLast}
                        aria-label="Bajar"
                        className="rounded px-1 text-zinc-500 transition hover:text-zinc-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        ▼
                      </button>
                    </div>
                    <span className="rounded-lg bg-rose-50 px-2 py-1 font-mono text-sm font-medium text-rose-700 dark:bg-zinc-800 dark:text-rose-400">
                      {d.date}
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-50">
                      {d.label}
                    </span>
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">
                        ¿Eliminar?
                      </span>
                      <button
                        onClick={() => handleDelete(d.id)}
                        disabled={isBusy}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy === `delete-${d.id}` ? "Eliminando..." : "Sí"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        disabled={isBusy}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(d)}
                        disabled={isBusy}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setConfirmId(d.id);
                          setError("");
                        }}
                        disabled={isBusy}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-zinc-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
