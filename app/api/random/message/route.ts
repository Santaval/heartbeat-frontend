import { getCurrentMessage } from "@/lib/rotation";

export const dynamic = "force-dynamic";

export async function GET() {
  const { text, updatedAt } = await getCurrentMessage();
  return Response.json({ text, updatedAt });
}
