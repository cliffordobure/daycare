import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
