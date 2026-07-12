import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dates = await prisma.importantDate.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return Response.json(dates.map(({ date, label }) => ({ date, label })));
}
