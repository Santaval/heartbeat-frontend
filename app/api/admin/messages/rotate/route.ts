import { rotateNow } from "@/lib/rotation";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await rotateNow();
  return Response.json(result);
}
