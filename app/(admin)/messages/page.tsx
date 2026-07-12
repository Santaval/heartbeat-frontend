import { prisma } from "@/lib/db";
import MessagesManager from "./MessagesManager";

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

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
  const rotation = await prisma.rotation.findUnique({
    where: { id: 1 },
    include: { message: true },
  });

  const activeText = rotation?.message?.text ?? null;
  const activeId = rotation?.messageId ?? null;

  const clientMessages = messages.map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Mensajes
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Administra los mensajes que se muestran en el dispositivo.
        </p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-xs font-medium uppercase tracking-wide text-rose-500 dark:text-rose-400">
          Mensaje activo
        </div>
        <div className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {activeText ?? "Ninguno — se elegirá en el próximo sondeo"}
        </div>
        {rotation?.rotatedAt && (
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Rotado: {formatDateTime(rotation.rotatedAt)}
          </div>
        )}
      </div>

      <MessagesManager messages={clientMessages} activeId={activeId} />
    </div>
  );
}
