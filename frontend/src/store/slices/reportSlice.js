import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
