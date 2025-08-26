import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminData: {
    token: string;
    email : string;
    id : string
   } | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  isLoading: true, 
  adminData: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminAuth: (state, action: PayloadAction<AdminAuthState['adminData']>) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.adminData = action.payload;
    },
    clearAdminAuth: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.adminData = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAdminAuth, clearAdminAuth, setLoading } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;