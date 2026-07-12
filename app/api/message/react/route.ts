import { prisma } from "@/lib/db";
import { readJsonBody } from "@/lib/body";

export const dynamic = "force-dynamic";

const VALID = new Set(["corazon", "sonrisa", "luego"]);

export async function POST(req: Request) {
  const body = await readJsonBody(req);
  const reaction = typeof body.reaction === "string" ? body.reaction : "";
  if (!VALID.has(reaction)) {
    return Response.json({ ok: true, ignored: true });
  }
  await prisma.reaction.create({ data: { value: reaction } });
  return Response.json({ ok: true });
}
