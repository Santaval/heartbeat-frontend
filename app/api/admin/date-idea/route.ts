import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

export async function GET() {
  const di = await prisma.dateIdea.findUnique({ where: { id: 1 } });
  return Response.json({
    idea: di?.idea ?? "",
    updatedAt: di?.updatedAt ?? null,
  });
}

export async function PUT(req: Request) {
  const body = await readJsonBody(req);
  const idea = typeof body.idea === "string" ? body.idea.trim() : "";

  const updated = await prisma.dateIdea.upsert({
    where: { id: 1 },
    create: { id: 1, idea },
    update: { idea },
  });
  return Response.json({ idea: updated.idea, updatedAt: updated.updatedAt });
}
