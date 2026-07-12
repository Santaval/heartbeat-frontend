import { getActivityFeed } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getActivityFeed(100);
  return Response.json(
    items.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() }))
  );
}
