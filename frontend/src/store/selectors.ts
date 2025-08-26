// src/redux/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './Store';

// Base selectors
export const selectEmployeeAuth = (state: RootState) => state.employeeAuth;
export const selectAdminAuth = (state: RootState) => state.adminAuth;
export const selectComplaint = (state: RootState) => state.Complaint;

// Employee auth selectors
export const selectEmployeeAuthData = createSelector(
  [selectEmployeeAuth],
  (employeeAuth) => ({
    isAuthenticated: employeeAuth.isAuthenticated,
    employeeData: employeeAuth.employeeData,
    loading: employeeAuth.loading
  })
);

export const selectIsEmployeeAuthenticated = createSelector(
  [selectEmployeeAuth],
  (employeeAuth) => employeeAuth.isAuthenticated
);

export const selectEmployeeData = createSelector(
  [selectEmployeeAuth],
  (employeeAuth) => employeeAuth.employeeData
);

export const selectEmployeeLoading = createSelector(
  [selectEmployeeAuth],
  (employeeAuth) => employeeAuth.loading
);

// Admin auth selectors
export const selectAdminAuthData = createSelector(
  [selectAdminAuth],
  (adminAuth) => ({
    isAuthenticated: adminAuth.isAuthenticated,
    adminData: adminAuth.adminData,
    isLoading: adminAuth.isLoading
  })
);

export const selectIsAdminAuthenticated = createSelector(
  [selectAdminAuth],
  (adminAuth) => adminAuth.isAuthenticated
);

export const selectAdminData = createSelector(
  [selectAdminAuth],
  (adminAuth) => adminAuth.adminData
);

export const selectAdminLoading = createSelector(
  [selectAdminAuth],
  (adminAuth) => adminAuth.isLoading
);

export const selectAdminId = createSelector(
  [selectAdminAuth],
  (adminAuth) => adminAuth.adminData?.id
);

// Complaint selectors
export const selectCurrentComplaintId = createSelector(
  [selectComplaint],
  (complaint) => complaint.complaintId
);

// Combined selectors for common use cases
export const selectCurrentUser = createSelector(
  [selectAdminAuthData, selectEmployeeAuthData],
  (adminAuth, employeeAuth) => {
    if (adminAuth.isAuthenticated) {
      return { type: 'admin', data: adminAuth.adminData };
    }
    if (employeeAuth.isAuthenticated) {
      return { type: 'employee', data: employeeAuth.employeeData };
    }
    return null;
  }
);

export const selectIsAnyUserAuthenticated = createSelector(
  [selectIsAdminAuthenticated, selectIsEmployeeAuthenticated],
  (isAdminAuth, isEmployeeAuth) => isAdminAuth || isEmployeeAuth
);