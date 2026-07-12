import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const messageId = Number(id);
  if (!Number.isInteger(messageId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  const body = await readJsonBody(req);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return Response.json({ error: "text required" }, { status: 400 });
  }

  try {
    const updated = await prisma.message.update({
      where: { id: messageId },
      data: { text },
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
  const messageId = Number(id);
  if (!Number.isInteger(messageId)) {
    return Response.json({ error: "invalid id" }, { status: 400 });
  }

  try {
    await prisma.message.delete({ where: { id: messageId } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "not found" }, { status: 404 });
  }
}
