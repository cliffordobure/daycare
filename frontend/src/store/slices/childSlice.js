import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { childAPI } from "../../services/api/apiService";

// Async thunks
export const fetchChildren = createAsyncThunk(
  "child/fetchChildren",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await childAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch children"
      );
    }
  }
);

export const fetchChildById = createAsyncThunk(
  "child/fetchChildById",
  async (childId, { rejectWithValue }) => {
    try {
      const response = await childAPI.getById(childId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child"
      );
    }
  }
);

export const createChild = createAsyncThunk(
  "child/createChild",
  async (childData, { rejectWithValue }) => {
    try {
      const response = await childAPI.create(childData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create child"
      );
    }
  }
);

export const updateChild = createAsyncThunk(
  "child/updateChild",
  async ({ childId, updateData }, { rejectWithValue }) => {
    try {
      const response = await childAPI.update(childId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update child"
      );
    }
  }
);

export const deleteChild = createAsyncThunk(
  "child/deleteChild",
  async (childId, { rejectWithValue }) => {
    try {
      await childAPI.delete(childId);
      return childId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete child"
      );
    }
  }
);

export const fetchChildStats = createAsyncThunk(
  "child/fetchChildStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await childAPI.getStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch child statistics"
      );
    }
  }
);

// Initial state
const initialState = {
  children: [],
  currentChild: null,
  loading: false,
  error: null,
  success: null,
  stats: {
    totalChildren: 0,
    activeChildren: 0,
    waitlistedChildren: 0,
    withdrawnChildren: 0,
    graduatedChildren: 0,
    childrenWithAllergies: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalChildren: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Slice
const childSlice = createSlice({
  name: "child",
  initialState,
  reducers: {
    clearChildError: (state) => {
      state.error = null;
    },
    clearChildSuccess: (state) => {
      state.success = null;
    },
    setCurrentChild: (state, action) => {
      state.currentChild = action.payload;
    },
    clearCurrentChild: (state) => {
      state.currentChild = null;
    },
    addChild: (state, action) => {
      state.children.unshift(action.payload);
    },
    updateChildInList: (state, action) => {
      const index = state.children.findIndex(
        (child) => child._id === action.payload._id
      );
      if (index !== -1) {
        state.children[index] = action.payload;
      }
    },
    removeChildFromList: (state, action) => {
      state.children = state.children.filter(
        (child) => child._id !== action.payload
      );
    },
    clearChildren: (state) => {
      state.children = [];
    },
    setChildPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Children
      .addCase(fetchChildren.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildren.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload.data.children;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchChildren.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Child By ID
      .addCase(fetchChildById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChild = action.payload.data.child;
      })
      .addCase(fetchChildById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Child
      .addCase(createChild.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createChild.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Add the new child to the list
        if (action.payload.data.child) {
          state.children.unshift(action.payload.data.child);
        }
      })
      .addCase(createChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Child
      .addCase(updateChild.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const updatedChild = action.payload.data.child;
        // Update in both currentChild and children list
        if (state.currentChild && state.currentChild._id === updatedChild._id) {
          state.currentChild = updatedChild;
        }
        const index = state.children.findIndex(child => child._id === updatedChild._id);
        if (index !== -1) {
          state.children[index] = updatedChild;
        }
      })
      .addCase(updateChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Child
      .addCase(deleteChild.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteChild.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Child deleted successfully";
        // Remove from children list
        state.children = state.children.filter(child => child._id !== action.payload);
        // Clear currentChild if it was the deleted one
        if (state.currentChild && state.currentChild._id === action.payload) {
          state.currentChild = null;
        }
      })
      .addCase(deleteChild.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Child Stats
      .addCase(fetchChildStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchChildStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearChildError,
  clearChildSuccess,
  setCurrentChild,
  clearCurrentChild,
  addChild,
  updateChildInList,
  removeChildFromList,
  clearChildren,
  setChildPagination,
} = childSlice.actions;

// Export selectors
export const selectChildren = (state) => state.child.children;
export const selectCurrentChild = (state) => state.child.currentChild;
export const selectChildLoading = (state) => state.child.loading;
export const selectChildError = (state) => state.child.error;
export const selectChildSuccess = (state) => state.child.success;
export const selectChildStats = (state) => state.child.stats;
export const selectChildPagination = (state) => state.child.pagination;

// Export reducer
export default childSlice.reducer;
