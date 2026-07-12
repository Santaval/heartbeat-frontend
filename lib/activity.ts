import { prisma } from "@/lib/db";

export const REACTION_EMOJI: Record<string, string> = {
  corazon: "❤️",
  sonrisa: "🙂",
  luego: "⏳",
};

export type ActivityItem =
  | { id: string; type: "ping"; createdAt: Date }
  | { id: string; type: "reaction"; createdAt: Date; value: string }
  | { id: string; type: "date"; createdAt: Date; accepted: boolean };

export async function getActivityFeed(limit = 100): Promise<ActivityItem[]> {
  const [pings, reactions, answers] = await Promise.all([
    prisma.ping.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.reaction.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.dateResponse.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
  ]);
  const items: ActivityItem[] = [
    ...pings.map((p) => ({ id: `ping-${p.id}`, type: "ping" as const, createdAt: p.createdAt })),
    ...reactions.map((r) => ({ id: `reaction-${r.id}`, type: "reaction" as const, createdAt: r.createdAt, value: r.value })),
    ...answers.map((a) => ({ id: `date-${a.id}`, type: "date" as const, createdAt: a.createdAt, accepted: a.accepted })),
  ];
  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return items.slice(0, limit);
}
