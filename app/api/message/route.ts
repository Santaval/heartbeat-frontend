import { getCurrentMessage } from "@/lib/rotation";

export const dynamic = "force-dynamic";

export async function GET() {
  const { text } = await getCurrentMessage();
  return Response.json({ message: text });
}
