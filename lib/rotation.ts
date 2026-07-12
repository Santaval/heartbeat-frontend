import { prisma } from "@/lib/db";

const DEFAULT_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12h

function rotateIntervalMs(): number {
  const v = Number(process.env.ROTATE_INTERVAL_MS);
  return Number.isFinite(v) && v > 0 ? v : DEFAULT_INTERVAL_MS;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

// "DD/MM HH:MM" — 11 chars, printable ASCII (shown verbatim in device history footer, must stay <=21 chars)
export function formatUpdatedAt(d: Date): string {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Prefer a message different from the current one when possible.
async function pickRandomMessage(excludeId?: number) {
  const total = await prisma.message.count();
  if (total === 0) return null;
  if (excludeId != null && total > 1) {
    const others = await prisma.message.findMany({ where: { id: { not: excludeId } } });
    return others[Math.floor(Math.random() * others.length)];
  }
  const all = await prisma.message.findMany();
  return all[Math.floor(Math.random() * all.length)];
}

// Loads/rotates the Rotation singleton and returns the current message + stable timestamp.
export async function getCurrentMessage(): Promise<{ text: string; updatedAt: string }> {
  let rotation = await prisma.rotation.findUnique({ where: { id: 1 }, include: { message: true } });
  if (!rotation) {
    rotation = await prisma.rotation.create({ data: { id: 1 }, include: { message: true } });
  }

  const age = Date.now() - rotation.rotatedAt.getTime();
  const needsRotation = rotation.messageId == null || age >= rotateIntervalMs();

  if (needsRotation) {
    const next = await pickRandomMessage(rotation.messageId ?? undefined);
    if (next) {
      rotation = await prisma.rotation.update({
        where: { id: 1 },
        data: { messageId: next.id, rotatedAt: new Date() },
        include: { message: true },
      });
    }
  }

  return { text: rotation.message?.text ?? "", updatedAt: formatUpdatedAt(rotation.rotatedAt) };
}
