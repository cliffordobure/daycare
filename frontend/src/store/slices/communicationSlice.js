import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  notifications: [],
  loading: false,
  error: null,
};

const communicationSlice = createSlice({
  name: "communication",
  initialState,
  reducers: {
    clearCommunicationError: (state) => {
      state.error = null;
    },
  },
});

export const { clearCommunicationError } = communicationSlice.actions;
export default communicationSlice.reducer;
