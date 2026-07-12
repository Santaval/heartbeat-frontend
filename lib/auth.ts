const COOKIE_NAME = "hb_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const encoder = new TextEncoder();

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

async function hmacHex(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

// token = "<issuedAtMs>.<hmacHex(issuedAtMs)>"
export async function createSessionToken(): Promise<string> {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${await hmacHex(issuedAt)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const issuedAt = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  if (!timingSafeEqual(sig, await hmacHex(issuedAt))) return false;
  const ts = Number(issuedAt);
  if (!Number.isFinite(ts)) return false;
  const ageSec = (Date.now() - ts) / 1000;
  return ageSec >= 0 && ageSec <= MAX_AGE_SECONDS;
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
