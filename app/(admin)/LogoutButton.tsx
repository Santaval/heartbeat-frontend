"use client";

export default function LogoutButton() {
  async function onLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <button
      onClick={onLogout}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-zinc-800"
    >
      Salir
    </button>
  );
}
