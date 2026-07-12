import { prisma } from "@/lib/db";
import DateIdeaForm from "./DateIdeaForm";

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

export default async function DateIdeaPage() {
  const di = await prisma.dateIdea.findUnique({ where: { id: 1 } });
  const answers = await prisma.dateResponse.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const idea = di?.idea ?? "";
  const latest = answers[0] ?? null;
  const history = answers.slice(1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Plan de cita
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Define el plan y revisa su respuesta.
        </p>
      </div>

      <DateIdeaForm idea={idea} />

      {/* Latest answer */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Última respuesta
        </div>
        {latest === null ? (
          <div className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
            Aún no ha respondido
          </div>
        ) : (
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <span
              className={`text-2xl font-semibold ${
                latest.accepted
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {latest.accepted ? "SÍ ❤️" : "NO 💔"}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {formatDateTime(latest.createdAt)}
            </span>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Historial
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {history.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between text-sm text-zinc-700 dark:text-zinc-300"
              >
                <span className="font-medium">
                  {a.accepted ? "SÍ" : "NO"}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {formatDateTime(a.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
