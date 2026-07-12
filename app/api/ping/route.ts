import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await readJsonBody(req);
  await prisma.ping.create({ data: {} });
  return Response.json({ ok: true });
}
