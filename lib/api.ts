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
      const token =
        localStorage.getItem("token");

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    // Only handle 401
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Don't refresh these requests
    if (
      originalRequest.url?.includes(
        "/auth/login"
      ) ||
      originalRequest.url?.includes(
        "/auth/refresh"
      ) ||
      originalRequest.url?.includes(
        "/auth/logout"
      )
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (
      typeof window === "undefined"
    ) {
      return Promise.reject(error);
    }

    // =================================================
    // GET REFRESH TOKEN
    // =================================================

    const refreshToken =
      localStorage.getItem(
        "refresh_token"
      );

    if (!refreshToken) {
      console.log(
        "❌ NO REFRESH TOKEN FOUND"
      );

      console.log(
        "Current access token =",
        localStorage.getItem("token")
      );

      console.log(
        "Current refresh token =",
        localStorage.getItem(
          "refresh_token"
        )
      );

      return Promise.reject(error);
    }

    try {
      console.log(
        "🔄 Access token expired"
      );

      console.log(
        "🔄 Getting new access token..."
      );

      // =================================================
      // REFRESH API
      // =================================================

      const response =
        await axios.post(
          "http://localhost:3001/auth/refresh",
          {
            refresh_token:
              refreshToken,
          }
        );

      // =================================================
      // GET NEW TOKENS
      // =================================================

      const newAccessToken =
        response.data.access_token;

      const newRefreshToken =
        response.data.refresh_token;

      if (!newAccessToken) {
        throw new Error(
          "New access token not received"
        );
      }

      if (!newRefreshToken) {
        throw new Error(
          "New refresh token not received"
        );
      }

      console.log(
        "✅ New access token received"
      );

      console.log(
        "✅ New refresh token received"
      );

      // =================================================
      // SAVE NEW TOKENS
      // =================================================

      localStorage.setItem(
        "token",
        newAccessToken
      );

      localStorage.setItem(
        "refresh_token",
        newRefreshToken
      );

      // =================================================
      // UPDATE ORIGINAL REQUEST
      // =================================================

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      console.log(
        "🔁 Retrying original request..."
      );

      // =================================================
      // RETRY
      // =================================================

      return api(originalRequest);

    } catch (refreshError) {

      console.error(
        "❌ Refresh token failed",
        refreshError
      );

      // =================================================
      // CLEAR LOGIN DATA
      // =================================================

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );

      // =================================================
      // GO TO LOGIN
      // =================================================

      window.location.href =
        "/login";

      return Promise.reject(
        refreshError
      );
    }
  }
);

export default api;