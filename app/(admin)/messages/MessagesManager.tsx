"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Message = { id: number; text: string; createdAt: string };

export default function MessagesManager({
  messages,
  activeId,
}: {
  messages: Message[];
  activeId: number | null;
}) {
  const router = useRouter();

  const [newText, setNewText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  // per-row UI state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const isBusy = busy !== null;

  async function handleAdd() {
    const text = newText.trim();
    if (!text) {
      setError("Escribe un mensaje.");
      return;
    }
    setError("");
    setBusy("add");
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      setNewText("");
      router.refresh();
    } catch {
      setError("No se pudo agregar el mensaje.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRotate() {
    setError("");
    setBusy("rotate");
    try {
      const res = await fetch("/api/admin/messages/rotate", { method: "POST" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("No se pudo rotar el mensaje.");
    } finally {
      setBusy(null);
    }
  }

  function startEdit(m: Message) {
    setEditingId(m.id);
    setEditText(m.text);
    setConfirmId(null);
    setError("");
  }

  async function handleSave(id: number) {
    const text = editText.trim();
    if (!text) {
      setError("El mensaje no puede estar vacío.");
      return;
    }
    setError("");
    setBusy(`save-${id}`);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      router.refresh();
    } catch {
      setError("No se pudo guardar el mensaje.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setBusy(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmId(null);
      router.refresh();
    } catch {
      setError("No se pudo eliminar el mensaje.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add + Rotate */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Nuevo mensaje
        </label>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={2}
          placeholder="Escribe un mensaje dulce..."
          className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleAdd}
            disabled={isBusy}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "add" ? "Agregando..." : "Agregar"}
          </button>
          <button
            onClick={handleRotate}
            disabled={isBusy}
            className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-zinc-800"
          >
            {busy === "rotate" ? "Rotando..." : "Rotar ahora"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No hay mensajes todavía.
          </p>
        )}

        {messages.map((m) => {
          const isActive = m.id === activeId;
          const isEditing = editingId === m.id;
          const isConfirming = confirmId === m.id;

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-4 transition ${
                isActive
                  ? "border-rose-300 bg-rose-50/60 dark:border-rose-800 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={2}
                    className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-rose-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(m.id)}
                      disabled={isBusy}
                      className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === `save-${m.id}` ? "Guardando..." : "Guardar"}
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-50">
                      {m.text}
                    </p>
                    {isActive && (
                      <span className="shrink-0 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-medium text-white">
                        Activo
                      </span>
                    )}
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-600 dark:text-zinc-300">
                        ¿Eliminar este mensaje?
                      </span>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={isBusy}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {busy === `delete-${m.id}` ? "Eliminando..." : "Sí, eliminar"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        disabled={isBusy}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(m)}
                        disabled={isBusy}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setConfirmId(m.id);
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
