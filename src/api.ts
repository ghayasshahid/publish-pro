const BASE_URL = "https://riot-reacquire-unstylish.ngrok-free.dev";

export async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const newToken = await refreshToken();
    if (newToken) {
      return apiFetch<T>(path, options, false); // Retry once
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Assuming refresh token is in a cookie or managed by server
    });

    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await res.json();
    const newToken = data.accessToken;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }
}

export async function downloadBookFile(
  bookId: string,
  defaultFileName: string,
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/books/${bookId}/download`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Download failed (${res.status})`);
  }

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = defaultFileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}
