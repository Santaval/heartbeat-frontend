import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";
import { isValidDDMM, MAX_DATES } from "@/lib/dates";

export const dynamic = "force-dynamic";

export async function GET() {
  const dates = await prisma.importantDate.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return Response.json(dates);
}

export async function POST(req: Request) {
  const body = await readJsonBody(req);

  const date = typeof body.date === "string" ? body.date : "";
  if (!isValidDDMM(date)) {
    return Response.json(
      { error: "date must be DD/MM (01..31 / 01..12)" },
      { status: 400 }
    );
  }

  const label = typeof body.label === "string" ? body.label.trim() : "";
  if (!label) {
    return Response.json({ error: "label required" }, { status: 400 });
  }

  if ((await prisma.importantDate.count()) >= MAX_DATES) {
    return Response.json({ error: "max 8 dates" }, { status: 400 });
  }

  let sortOrder: number;
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    sortOrder = body.sortOrder;
  } else {
    const agg = await prisma.importantDate.aggregate({
      _max: { sortOrder: true },
    });
    sortOrder = (agg._max.sortOrder ?? -1) + 1;
  }

  const created = await prisma.importantDate.create({
    data: { date, label, sortOrder },
  });
  return Response.json(created, { status: 201 });
}
