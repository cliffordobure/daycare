import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import slices
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import centerReducer from "./slices/centerSlice";
import childReducer from "./slices/childSlice";
import classReducer from "./slices/classSlice";
import attendanceReducer from "./slices/attendanceSlice";
import activityReducer from "./slices/activitySlice";
import paymentReducer from "./slices/paymentSlice";
import communicationReducer from "./slices/communicationSlice";
import healthReducer from "./slices/healthSlice";
import reportReducer from "./slices/reportSlice";
import notificationReducer from "./slices/notificationSlice";
import uiReducer from "./slices/uiSlice";

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  center: centerReducer,
  child: childReducer,
  class: classReducer,
  attendance: attendanceReducer,
  activity: activityReducer,
  payment: paymentReducer,
  communication: communicationReducer,
  health: healthReducer,
  report: reportReducer,
  notification: notificationReducer,
  ui: uiReducer,
});

// Persist configuration
const persistConfig = {
  key: "nurtura-root",
  storage,
  whitelist: ["auth", "user", "ui"], // Only persist these reducers
  blacklist: ["notification"], // Don't persist notifications
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
        ignoredPaths: ["persist"],
      },
      thunk: true,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor for Redux Persist
export const persistor = persistStore(store);

// Export store types for TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
