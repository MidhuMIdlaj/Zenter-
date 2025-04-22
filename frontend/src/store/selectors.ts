import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/Store';

// Selector for employee auth
export const selectEmployeeAuth = (state: RootState) => state.employeeAuth;
export const selectEmployeeAuthData = createSelector(
  [selectEmployeeAuth],
  (employeeAuth) => ({
    isAuthenticated: employeeAuth.isAuthenticated,
    emaployeeData: employeeAuth.employeeData,
  })
);

// Selector for admin auth
export const selectAdminAuth = (state: RootState) => state.adminAuth;
export const selectAdminAuthData = createSelector(
  [selectAdminAuth],
  (adminAuth) => ({
    isAuthenticated: adminAuth.isAuthenticated,
    isLoading: adminAuth.isLoading
  })
);