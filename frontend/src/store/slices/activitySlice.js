import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activities: [],
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearActivityError: (state) => {
      state.error = null;
    },
  },
});

export const { clearActivityError } = activitySlice.actions;
export default activitySlice.reducer;
