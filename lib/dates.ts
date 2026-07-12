export const MAX_DATES = 8;

// "DD/MM" with DD in 1..31 and MM in 1..12 (two digits each).
export function isValidDDMM(value: string): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const day = Number(m[1]);
  const month = Number(m[2]);
  return day >= 1 && day <= 31 && month >= 1 && month <= 12;
}
