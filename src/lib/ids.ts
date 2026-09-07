export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readCitizenCookie(header: string | null): { id: string; name: string; city: string } | null {
  if (!header) return null;
  const raw = header
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("onw_citizen="));
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw.slice("onw_citizen=".length)));
  } catch {
    return null;
  }
}

export function citizenCookie(citizen: { id: string; name: string; city: string }): string {
  return `onw_citizen=${encodeURIComponent(JSON.stringify(citizen))}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
