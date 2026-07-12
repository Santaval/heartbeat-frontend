import { prisma } from "@/lib/db";
import DatesManager from "./DatesManager";

export const dynamic = "force-dynamic";

export default async function DatesPage() {
  const dates = await prisma.importantDate.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const clientDates = dates.map((d) => ({
    id: d.id,
    date: d.date,
    label: d.label,
    sortOrder: d.sortOrder,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Fechas importantes
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Máximo 8 fechas. Formato DD/MM.
        </p>
      </div>

      <DatesManager dates={clientDates} />
    </div>
  );
}
