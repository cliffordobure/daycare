import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api/authAPI";
import { fetchCenterDetails } from "./centerSlice";

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // If user has a center, fetch the full center details
      if (response.data.data.user.center?._id) {
        dispatch(fetchCenterDetails(response.data.data.user.center._id));
      }
      
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshTokenData, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken(refreshTokenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Token refresh failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Password reset request failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password change failed");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await authAPI.getCurrentUser();
      
      // If user has a center, fetch the full center details
      if (response.data?.data?.user?.center?._id) {
        dispatch(fetchCenterDetails(response.data.data.user.center._id));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  message: null,
  isPasswordResetSent: false,
  isPasswordChanged: false,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearPasswordResetStatus: (state) => {
      state.isPasswordResetSent = false;
    },
    clearPasswordChangeStatus: (state) => {
      state.isPasswordChanged = false;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
    },
    setInitialLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.error = null;
        state.message = action.payload.message || "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || action.error?.message || "Login failed";
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.error = null;
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Registration failed";
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.message = "Logout successful";
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Logout failed";
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.token;
        state.refreshToken = action.payload.data.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Token refresh failed";
        // If refresh fails, clear auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPasswordResetSent = true;
        state.message = action.payload.message || "Password reset email sent";
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Password reset request failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || "Password reset successful";
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Password reset failed";
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPasswordChanged = true;
        state.message =
          action.payload.message || "Password changed successfully";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Password change failed";
      })

      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.data && action.payload.data.user) {
          state.user = action.payload.data.user;
          state.isAuthenticated = true;
          state.error = null;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  clearError,
  clearMessage,
  clearPasswordResetStatus,
  clearPasswordChangeStatus,
  updateUserProfile,
  setToken,
  clearAuth,
  setInitialLoading,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectMessage = (state) => state.auth.message;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserPermissions = (state) =>
  state.auth.user?.permissions || [];

// Export reducer
export default authSlice.reducer;
