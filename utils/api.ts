const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function buildHeaders(hasBody: boolean) {
  const headers: Record<string, string> = {};
  if (hasBody) headers["Content-Type"] = "application/json";

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

export async function apiGet<T>(path: string) {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: buildHeaders(false),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiPost<TRequest, TResponse>(
  path: string,
  body: TRequest
) {
  if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<TResponse>;
}
