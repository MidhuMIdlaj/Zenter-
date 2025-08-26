// src/redux/EmployeeAuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmployeeAuthState {
  isAuthenticated: boolean;
  loading : boolean;
  employeeData:  {
    token: string;
    position : string;
    id  : string;
    employeeName : string
  } | null;
}

const initialState: EmployeeAuthState = {
  loading : true,
  isAuthenticated: false,
  employeeData: null,
};

const employeeAuthSlice = createSlice({
  name: "employeeAuth",
  initialState,
  reducers: {
    setEmployeeAuth: (state, action: PayloadAction<EmployeeAuthState['employeeData']>) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.employeeData = action.payload;
    },
    clearEmployeeAuth: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.employeeData = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setEmployeeAuth, clearEmployeeAuth } = employeeAuthSlice.actions;
export default employeeAuthSlice.reducer;