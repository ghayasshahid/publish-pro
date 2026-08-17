import axios, { type InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
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

    const message =
      error.response.data.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

async function refreshToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = res.data.accessToken;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "/";
    return null;
  }
}

export { api };

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
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Download failed";
    throw new Error(message);
  }
}

