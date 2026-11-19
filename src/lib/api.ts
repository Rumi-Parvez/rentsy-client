import { authClient } from "@/lib/auth-client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(force = false) {
  if (
    !force &&
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 30_000
  ) {
    return cachedToken.token;
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    cachedToken = null;
    throw new ApiError(
      error?.message || "Your session has expired. Please sign in again.",
      401
    );
  }

  cachedToken = {
    token: data.token,
    // The Better Auth JWT lives for 15 minutes by default.
    expiresAt: Date.now() + 10 * 60 * 1000,
  };

  return data.token;
}

export function clearTokenCache() {
  cachedToken = null;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      body:
        options.body === undefined
          ? undefined
          : JSON.stringify(options.body),
    }
  );

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const data = payload as {
    success?: boolean;
    message?: string;
  } | null;

  if (!response.ok || data?.success === false) {
    throw new ApiError(
      data?.message || `Request failed (${response.status}).`,
      response.status
    );
  }

  return payload as T;
}

export const apiGet = <T>(path: string) =>
  request<T>(path, { method: "GET" });

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body });

export const apiPatch = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "PATCH", body });

export const apiDelete = <T>(path: string) =>
  request<T>(path, { method: "DELETE" });

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
