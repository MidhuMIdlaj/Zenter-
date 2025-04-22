// src/redux/EmployeeAuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmployeeAuthState {
  isAuthenticated: boolean;
  employeeData: {
    emailId: string;
    token: string;
  } | null;
}

const initialState: EmployeeAuthState = {
  isAuthenticated: false,
  employeeData: null,
};

const employeeAuthSlice = createSlice({
  name: "employeeAuth",
  initialState,
  reducers: {
    setEmployeeAuth: (state, action: PayloadAction<EmployeeAuthState['employeeData']>) => {
      state.isAuthenticated = true;
      state.employeeData = action.payload;
    },
    clearEmployeeAuth: (state) => {
      state.isAuthenticated = false;
      state.employeeData = null;
    },
  },
});

export const { setEmployeeAuth, clearEmployeeAuth } = employeeAuthSlice.actions;
export default employeeAuthSlice.reducer;