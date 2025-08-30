import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api/apiService";

// Async thunks
export const createCenterUser = createAsyncThunk(
  "center/createCenterUser",
  async ({ centerId, userData }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/centers/${centerId}/users`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const fetchCenterUsers = createAsyncThunk(
  "center/fetchCenterUsers",
  async ({ centerId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/centers/${centerId}/users`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchCenterDetails = createAsyncThunk(
  "center/fetchCenterDetails",
  async (centerId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/centers/${centerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch center details"
      );
    }
  }
);

export const updateCenter = createAsyncThunk(
  "center/updateCenter",
  async ({ centerId, updateData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`/centers/${centerId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update center"
      );
    }
  }
);

// Initial state
const initialState = {
  currentCenter: null,
  centerUsers: [],
  loading: false,
  error: null,
  success: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  },
  userPagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Slice
const centerSlice = createSlice({
  name: "center",
  initialState,
  reducers: {
    clearCenterError: (state) => {
      state.error = null;
    },
    clearCenterSuccess: (state) => {
      state.success = null;
    },
    setCurrentCenter: (state, action) => {
      // If we're setting a center object directly (from user data), use it
      // If we're setting a center ID, we'll need to fetch the details
      if (action.payload && typeof action.payload === 'object' && action.payload._id) {
        state.currentCenter = action.payload;
      } else if (action.payload && typeof action.payload === 'string') {
        // This is a center ID, we need to fetch the details
        // The currentCenter will be set when fetchCenterDetails completes
        state.currentCenter = null;
      }
    },
    clearCurrentCenter: (state) => {
      state.currentCenter = null;
    },
    addCenterUser: (state, action) => {
      state.centerUsers.unshift(action.payload);
    },
    updateCenterUser: (state, action) => {
      const index = state.centerUsers.findIndex(
        (user) => user._id === action.payload._id
      );
      if (index !== -1) {
        state.centerUsers[index] = action.payload;
      }
    },
    removeCenterUser: (state, action) => {
      state.centerUsers = state.centerUsers.filter(
        (user) => user._id !== action.payload
      );
    },
    clearCenterUsers: (state) => {
      state.centerUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Center User
      .addCase(createCenterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createCenterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Add the new user to the list
        if (action.payload.data.user) {
          state.centerUsers.unshift(action.payload.data.user);
        }
      })
      .addCase(createCenterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Center Users
      .addCase(fetchCenterUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.centerUsers = action.payload.data.users;
        state.userPagination = action.payload.data.pagination;
      })
      .addCase(fetchCenterUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Center Details
      .addCase(fetchCenterDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCenter = action.payload.data.center;
      })
      .addCase(fetchCenterDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Center
      .addCase(updateCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.currentCenter = action.payload.data.center;
      })
      .addCase(updateCenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearCenterError,
  clearCenterSuccess,
  setCurrentCenter,
  clearCurrentCenter,
  addCenterUser,
  updateCenterUser,
  removeCenterUser,
  clearCenterUsers,
} = centerSlice.actions;

// Export selectors
export const selectCurrentCenter = (state) => state.center.currentCenter;
export const selectCenterUsers = (state) => state.center.centerUsers;
export const selectCenterLoading = (state) => state.center.loading;
export const selectCenterError = (state) => state.center.error;
export const selectCenterSuccess = (state) => state.center.success;
export const selectCenterPagination = (state) => state.center.pagination;
export const selectUserPagination = (state) => state.center.userPagination;

// Export reducer
export default centerSlice.reducer;
