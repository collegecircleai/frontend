import axios from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

type CachedResponse = {
  expiresAt: number;
  data?: unknown;
  promise?: Promise<any>;
};

const GET_CACHE_TTL_MS = 30_000;
const getCache = new Map<string, CachedResponse>();

const buildCacheKey = (url: string, config: any = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return JSON.stringify({
    url,
    baseURL: config.baseURL ?? normalizedBaseUrl,
    params: config.params ?? null,
    token,
  });
};

const clearApiCache = () => {
  getCache.clear();
};

const clearAuthStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth:cleared"));
};

const STATUS_MESSAGE_MAP: Record<number, string> = {
  400: "The request could not be processed. Please verify your input.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "Requested resource was not found.",
  409: "This action conflicts with existing data.",
  422: "Some fields are invalid. Please review and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error occurred. Please try again shortly.",
  502: "Service is temporarily unavailable. Please try again shortly.",
  503: "Service is temporarily unavailable. Please try again shortly.",
  504: "Request timed out. Please try again.",
};

const isRawStatusMessage = (message: string): boolean => {
  const normalized = (message || "").toLowerCase();
  return normalized.includes("request failed with status code");
};

export const getFriendlyErrorMessage = (
  error: unknown,
  fallback: string = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage.trim();
    }

    const status = error.response?.status;
    if (status && STATUS_MESSAGE_MAP[status]) {
      return STATUS_MESSAGE_MAP[status];
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return isRawStatusMessage(error.message)
        ? fallback
        : error.message.trim();
    }

    return fallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return isRawStatusMessage(error.message) ? fallback : error.message.trim();
  }

  return fallback;
};

export const api = axios.create({
  baseURL: normalizedBaseUrl,
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // Ensure this only runs on the client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const originalGet = api.get.bind(api);
const originalPost = api.post.bind(api);
const originalPut = api.put.bind(api);
const originalPatch = api.patch.bind(api);
const originalDelete = api.delete.bind(api);

api.get = (async (url: string, config: any = {}) => {
  const cacheKey = buildCacheKey(url, config);
  const now = Date.now();
  const cached = getCache.get(cacheKey);

  if (cached?.data && cached.expiresAt > now) {
    return Promise.resolve(cached.data);
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = originalGet(url, config)
    .then((response) => {
      getCache.set(cacheKey, {
        data: response,
        expiresAt: Date.now() + GET_CACHE_TTL_MS,
      });
      return response;
    })
    .catch((error) => {
      getCache.delete(cacheKey);
      throw error;
    });

  getCache.set(cacheKey, {
    promise,
    expiresAt: now + GET_CACHE_TTL_MS,
  });

  return promise;
}) as typeof api.get;

const wrapMutatingMethod = <T extends (...args: any[]) => Promise<any>>(
  method: T,
) => {
  return (async (...args: Parameters<T>) => {
    try {
      const response = await method(...args);
      clearApiCache();
      return response;
    } catch (error) {
      throw error;
    }
  }) as T;
};

api.post = wrapMutatingMethod(originalPost) as typeof api.post;
api.put = wrapMutatingMethod(originalPut) as typeof api.put;
api.patch = wrapMutatingMethod(originalPatch) as typeof api.patch;
api.delete = wrapMutatingMethod(originalDelete) as typeof api.delete;

// Response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = String(originalRequest?.url || "");
    const normalizedMessage = getFriendlyErrorMessage(error);

    // Skip retry for auth and verification endpoints
    const skipRetryEndpoints = [
      "/auth/refresh",
      "/auth/login",
      "/auth/register",
      "/auth/verify",
      "/auth/verify-email",
      "/auth/me",
    ];

    const shouldSkipRetry = skipRetryEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint),
    );

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRetry
    ) {
      originalRequest._retry = true;

      // Try to refresh token silently
      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (refreshToken) {
          // Create a separate axios instance for refresh to avoid interceptor loop
          const refreshApi = axios.create({
            baseURL: normalizedBaseUrl,
            headers: { "Content-Type": "application/json" },
          });

          const refreshRes = await refreshApi.post("/auth/refresh", {
            refreshToken,
          });

          console.log("Refresh response:", refreshRes?.data);

          if (refreshRes?.data?.success && refreshRes.data?.data?.accessToken) {
            const newAccessToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken;

            console.log("Token refreshed successfully");

            if (typeof window !== "undefined") {
              localStorage.setItem("token", newAccessToken);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } else {
            console.error("Refresh response missing success or accessToken");
          }
        } else {
          console.warn("No refresh token available");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }

      // Refresh failed or no refresh token, clear auth and redirect
      if (typeof window !== "undefined") {
        clearAuthStorage();
        // Only redirect if not already on login/auth page
        const path = window.location.pathname;
        if (
          !path.startsWith("/login") &&
          !path.startsWith("/register") &&
          !path.startsWith("/set-password")
        ) {
          window.location.href = "/login";
        }
      }
    } else if (
      error.response &&
      error.response.status === 401 &&
      shouldSkipRetry
    ) {
      // Clear auth on failed auth endpoints
      if (typeof window !== "undefined") {
        clearAuthStorage();
      }
    }

    // Ensure UI never receives raw Axios status-code text by default.
    error.userMessage = normalizedMessage;
    error.message = normalizedMessage;

    return Promise.reject(error);
  },
);

export default api;
