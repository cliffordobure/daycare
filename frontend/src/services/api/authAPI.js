import axios from "axios";

// Create axios instance
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authAxios = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
authAxios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Adding token to request:",
        config.url,
        "Token present:",
        !!token
      );
    } else {
      console.log("No token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken") ||
          sessionStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          const { token, refreshToken: newRefreshToken } = response.data.data;

          // Update tokens in storage
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refreshToken");

        // Redirect to login page
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API methods
export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await authAxios.post("/login", credentials);

    // Store tokens
    if (response.data.data) {
      const { token, refreshToken } = response.data.data;
      console.log("Storing tokens:", {
        token: !!token,
        refreshToken: !!refreshToken,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      console.log("No token data in response:", response.data);
    }

    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await authAxios.post("/register", userData);

    // Store tokens if registration is successful
    if (response.data.data) {
      const { token, refreshToken } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    }

    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await authAxios.post("/logout");
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
    }

    return { success: true };
  },

  // Refresh access token
  refreshToken: async (refreshTokenData) => {
    const response = await authAxios.post("/refresh-token", refreshTokenData);

    // Update tokens in storage
    if (response.data.data) {
      const { token, refreshToken } = response.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
    }

    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await authAxios.get("/me");
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await authAxios.post("/forgot-password", { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await authAxios.post(`/reset-password/${token}`, {
      password,
    });
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await authAxios.post("/change-password", passwordData);
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await authAxios.post(`/verify-email/${token}`);
    return response;
  },

  // Resend email verification
  resendVerification: async (email) => {
    const response = await authAxios.post("/resend-verification", { email });
    return response;
  },
};

// Utility functions
export const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getStoredRefreshToken = () => {
  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
};

export const clearStoredTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
};

export const setStoredTokens = (token, refreshToken, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("refreshToken", refreshToken);
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const getTokenExpirationTime = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000;
  } catch (error) {
    return null;
  }
};

export default authAxios;
