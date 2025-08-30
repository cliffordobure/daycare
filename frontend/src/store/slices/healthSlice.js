import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  healthRecords: [],
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    clearHealthError: (state) => {
      state.error = null;
    },
  },
});

export const { clearHealthError } = healthSlice.actions;
export default healthSlice.reducer;
