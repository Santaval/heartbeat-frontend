import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const idea = await prisma.dateIdea.findUnique({ where: { id: 1 } });
  return Response.json({ idea: idea?.idea ?? "" });
}
