import { getActivityFeed, REACTION_EMOJI, type ActivityItem } from "@/lib/activity";

export const dynamic = "force-dynamic";

function formatDateTime(d: Date): string {
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describe(item: ActivityItem): { icon: string; label: string } {
  switch (item.type) {
    case "ping":
      return { icon: "💗", label: "Te extraña" };
    case "reaction": {
      const emoji = REACTION_EMOJI[item.value] ?? item.value;
      return { icon: emoji, label: `Reaccionó ${emoji}` };
    }
    case "date":
      return item.accepted
        ? { icon: "❤️", label: "Respondió SÍ" }
        : { icon: "💔", label: "Respondió NO" };
  }
}

export default async function ActivityPage() {
  const items = await getActivityFeed(100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Actividad
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Lo que ha hecho desde el dispositivo.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sin actividad todavía.
        </p>
      ) : (
        <ol className="relative flex flex-col gap-3 border-l border-zinc-200 pl-6 dark:border-zinc-800">
          {items.map((item) => {
            const { icon, label } = describe(item);
            return (
              <li key={item.id} className="relative">
                <span className="absolute -left-[1.9rem] flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                  {icon}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {label}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
