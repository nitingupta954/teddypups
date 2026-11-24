/**
 * HTTP Basic auth for the small enquiries admin.
 * Credentials come from ADMIN_USER (default "admin") and ADMIN_PASSWORD; with no
 * password configured the admin is disabled entirely.
 */
export function isAdminRequest(authorization: string | null, env: Record<string, string | undefined> = process.env): boolean {
  const password = env.ADMIN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = atob(authorization.slice(6).trim());
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  // Evaluate both comparisons so timing doesn't reveal which half was wrong.
  const userOk = safeEqual(decoded.slice(0, i), env.ADMIN_USER || "admin");
  const passOk = safeEqual(decoded.slice(i + 1), password);
  return userOk && passOk;
}

/** Constant-time string comparison (runtime-agnostic, so it works in Proxy too). */
function safeEqual(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
