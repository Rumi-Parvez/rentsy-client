/**
 * Small cookie helpers for UI preferences.
 *
 * The app intentionally avoids browser local storage; preferences are
 * kept in first-party cookies instead so they work with the deployed
 * site and can also be read during server rendering when needed.
 */

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;

  const maxAge = Math.floor(days * 24 * 60 * 60);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
