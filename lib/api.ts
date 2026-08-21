import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  // Normal response
  (response) => {
    return response;
  },

  // Error response
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    // Only handle 401
    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    // Don't refresh these endpoints
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const refreshToken =
      localStorage.getItem("refresh_token");

    // No refresh token
    if (!refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";

      return Promise.reject(error);
    }

    try {
      console.log(
        "Access token expired. Refreshing token...",
      );

      // Call refresh endpoint
      const response = await axios.post(
        "http://localhost:3001/auth/refresh",
        {
          refresh_token: refreshToken,
        },
      );

      const newAccessToken =
        response.data.access_token;

      // Save new access token
      localStorage.setItem(
        "token",
        newAccessToken,
      );

      console.log(
        "New access token received",
      );

      // Update original request
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry original request
      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Refresh token failed",
        refreshError,
      );

      // Refresh token is invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  },
);

export default api;