import axios, { type InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor to add the Bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // Transform axios error to match previous behavior if needed, 
    // but usually throwing the error is fine.
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

/**
 * Refreshes the access token using the refresh token cookie.
 */
async function refreshToken(): Promise<string | null> {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
    const newToken = res.data.accessToken;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }
}

/**
 * Compatibility wrapper to replace the old fetch-based apiFetch.
 */
export async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  const { method = "GET", body, headers } = options;

  let data = body;
  // If body is a string, try to parse it as JSON for Axios
  if (typeof body === "string") {
    try {
      data = JSON.parse(body);
    } catch {
      // Not JSON, leave as is (e.g. plain text or already handled)
    }
  }

  const response = await api({
    url: path,
    method,
    data,
    headers,
  });

  return response.data;
}

/**
 * Downloads a book file using Axios.
 */
export async function downloadBookFile(
  bookId: string,
  defaultFileName: string,
) {
  try {
    const response = await api.get(`/api/books/${bookId}/download`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    throw new Error(message);
  }
}
