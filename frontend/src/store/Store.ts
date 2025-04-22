// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { combineReducers } from "redux";
import adminAuthReducer from "./AdminAuthSlice";
import employeeAuthReducer from "./EmployeeAuthSlice";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ['adminAuth', 'employeeAuth'],
};

const rootReducer = combineReducers({
  adminAuth: adminAuthReducer,
  employeeAuth: employeeAuthReducer,
  // Add other reducers here if needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check (needed for redux-persist)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;