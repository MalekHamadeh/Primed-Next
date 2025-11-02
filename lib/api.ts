import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Base URL: prefer API_BASE_URL on server, NEXT_PUBLIC_API_BASE_URL in browser, fallback to relative
const isBrowser = typeof window !== "undefined";
const apiHost = isBrowser
  ? process.env.NEXT_PUBLIC_API_BASE_URL
  : process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const baseURL = apiHost ? `${apiHost.replace(/\/$/, "")}/api` : "/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Attach auth token if available (from localStorage or cookies). Runs only in browser.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("access_token");
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
    }
  } catch {
    // ignore token retrieval errors
  }
  return config;
});

// Basic response interceptor for unified error surface
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Example: central place to handle 401s
    if (error.response && error.response.status === 401) {
      // Optionally clear token and redirect to login
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem("access_token");
        } catch {}
      }
    }
    return Promise.reject(error);
  }
);

// Typed helper functions
export async function httpGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.get<T>(url, config);
  return data;
}

export async function httpPost<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config);
  return data;
}

export async function httpPut<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.put<T>(url, body, config);
  return data;
}

export async function httpPatch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body, config);
  return data;
}

export async function httpDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const { data } = await apiClient.delete<T>(url, config);
  return data;
}

export type ApiError = AxiosError<{ message?: string; errors?: unknown }>;
