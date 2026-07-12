import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(messages);
}

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return Response.json({ error: "text required" }, { status: 400 });
  }
  const created = await prisma.message.create({ data: { text } });
  return Response.json(created, { status: 201 });
}
