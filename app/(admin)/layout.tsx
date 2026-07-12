import Link from "next/link";
import LogoutButton from "./LogoutButton";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/messages", label: "Mensajes" },
  { href: "/dates", label: "Fechas" },
  { href: "/date-idea", label: "Plan de cita" },
  { href: "/activity", label: "Actividad" },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">❤️</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
              Heartbeat
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            ))}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
