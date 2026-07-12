import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";
import { isValidDDMM } from "@/lib/dates";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dateId = Number(id);
  if (!Number.isInteger(dateId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  const body = await readJsonBody(req);
  const data: { date?: string; label?: string; sortOrder?: number } = {};

  if (body.date !== undefined) {
    const date = typeof body.date === "string" ? body.date : "";
    if (!isValidDDMM(date)) {
      return Response.json(
        { error: "date must be DD/MM (01..31 / 01..12)" },
        { status: 400 }
      );
    }
    data.date = date;
  }

  if (body.label !== undefined) {
    const label = typeof body.label === "string" ? body.label.trim() : "";
    if (!label) {
      return Response.json({ error: "label required" }, { status: 400 });
    }
    data.label = label;
  }

  if (
    body.sortOrder !== undefined &&
    typeof body.sortOrder === "number" &&
    Number.isFinite(body.sortOrder)
  ) {
    data.sortOrder = body.sortOrder;
  }

  try {
    const updated = await prisma.importantDate.update({
      where: { id: dateId },
      data,
    });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "not found" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dateId = Number(id);
  if (!Number.isInteger(dateId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  try {
    await prisma.importantDate.delete({ where: { id: dateId } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "not found" }, { status: 404 });
  }
}
