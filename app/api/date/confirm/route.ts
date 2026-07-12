import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  const raw = body.accepted;
  const accepted = raw === true || raw === "true" || raw === 1 || raw === "1";
  await prisma.dateResponse.create({ data: { accepted } });
  return Response.json({ ok: true });
}
