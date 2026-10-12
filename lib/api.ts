
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// Prevent multiple requests from refreshing at the same time.
let refreshPromise: Promise<string> | null = null;

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        const cleanToken = token.replace(/^['"]|['"]$/g, "");
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | RetryRequestConfig
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    // Never refresh login, refresh, or logout requests.
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const storedRefreshToken =
      localStorage.getItem("refresh_token");

    if (!storedRefreshToken) {
      // There is no refresh token to use.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Reuse an in-progress refresh instead of sending
      // multiple refresh requests simultaneously.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/auth/refresh`, {
            refresh_token: storedRefreshToken.replace(
              /^['"]|['"]$/g,
              ""
            ),
          })
          .then((response) => {
            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;

            if (!newAccessToken || !newRefreshToken) {
              throw new Error(
                "Refresh response is missing tokens."
              );
            }

            const cleanAccessToken = newAccessToken.replace(
              /^['"]|['"]$/g,
              ""
            );

            const cleanRefreshToken = newRefreshToken.replace(
              /^['"]|['"]$/g,
              ""
            );

            localStorage.setItem("token", cleanAccessToken);
            localStorage.setItem(
              "refresh_token",
              cleanRefreshToken
            );

            if (response.data.user) {
              localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
              );
            }

            return cleanAccessToken;
          })
          .catch((refreshError) => {
            // Clear login data only if refreshing fails.
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      // Retry the original request with the new token.
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Token refresh or request retry failed:",
        refreshError
      );

      return Promise.reject(refreshError);
    }
  }
);

export default api;

