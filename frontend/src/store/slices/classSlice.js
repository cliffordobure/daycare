import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { classAPI } from "../../services/api/apiService";

// Async thunks
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await classAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch classes"
      );
    }
  }
);

export const fetchClassById = createAsyncThunk(
  "class/fetchClassById",
  async (classId, { rejectWithValue }) => {
    try {
      const response = await classAPI.getById(classId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class"
      );
    }
  }
);

export const createClass = createAsyncThunk(
  "class/createClass",
  async (classData, { rejectWithValue }) => {
    try {
      const response = await classAPI.create(classData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create class"
      );
    }
  }
);

export const updateClass = createAsyncThunk(
  "class/updateClass",
  async ({ classId, updateData }, { rejectWithValue }) => {
    try {
      const response = await classAPI.update(classId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update class"
      );
    }
  }
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (classId, { rejectWithValue }) => {
    try {
      await classAPI.delete(classId);
      return classId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete class"
      );
    }
  }
);

export const fetchClassStats = createAsyncThunk(
  "class/fetchClassStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await classAPI.getStats(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch class statistics"
      );
    }
  }
);

// Initial state
const initialState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null,
  success: null,
  stats: {
    totalClasses: 0,
    activeClasses: 0,
    fullClasses: 0,
    waitlistClasses: 0,
    totalEnrollment: 0,
    averageEnrollmentRate: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalClasses: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Slice
const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    clearClassError: (state) => {
      state.error = null;
    },
    clearClassSuccess: (state) => {
      state.success = null;
    },
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload;
    },
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
    addClass: (state, action) => {
      state.classes.unshift(action.payload);
    },
    updateClassInList: (state, action) => {
      const index = state.classes.findIndex(
        (classItem) => classItem._id === action.payload._id
      );
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    removeClassFromList: (state, action) => {
      state.classes = state.classes.filter(
        (classItem) => classItem._id !== action.payload
      );
    },
    clearClasses: (state) => {
      state.classes = [];
    },
    setClassPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload.data.classes;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Class By ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload.data.class;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Add the new class to the list
        if (action.payload.data.class) {
          state.classes.unshift(action.payload.data.class);
        }
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const updatedClass = action.payload.data.class;
        // Update in both currentClass and classes list
        if (state.currentClass && state.currentClass._id === updatedClass._id) {
          state.currentClass = updatedClass;
        }
        const index = state.classes.findIndex(classItem => classItem._id === updatedClass._id);
        if (index !== -1) {
          state.classes[index] = updatedClass;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Class deleted successfully";
        // Remove from classes list
        state.classes = state.classes.filter(classItem => classItem._id !== action.payload);
        // Clear currentClass if it was the deleted one
        if (state.currentClass && state.currentClass._id === action.payload) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Class Stats
      .addCase(fetchClassStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchClassStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearClassError,
  clearClassSuccess,
  setCurrentClass,
  clearCurrentClass,
  addClass,
  updateClassInList,
  removeClassFromList,
  clearClasses,
  setClassPagination,
} = classSlice.actions;

// Export selectors
export const selectClasses = (state) => state.class.classes;
export const selectCurrentClass = (state) => state.class.currentClass;
export const selectClassLoading = (state) => state.class.loading;
export const selectClassError = (state) => state.class.error;
export const selectClassSuccess = (state) => state.class.success;
export const selectClassStats = (state) => state.class.stats;
export const selectClassPagination = (state) => state.class.pagination;

// Export reducer
export default classSlice.reducer;
