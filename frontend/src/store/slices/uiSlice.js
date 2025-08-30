import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false,
  theme: "light",
  language: "en",
  modals: {
    login: false,
    register: false,
    forgotPassword: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
  },
});

export const { toggleSidebar, setTheme, setLanguage, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
