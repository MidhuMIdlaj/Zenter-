// src/utils/authUtils.ts
import axios from 'axios';
import { store } from '../store/Store';

export const refreshToken = async () => {
  try {
    // 1. Call your refresh token endpoint
    const response = await axios.post(
      'http://localhost:3000/auth/refresh-token', 
      {},
      { withCredentials: true }
    );

    const { accessToken, userType } = response.data;

    // 2. Update Redux store based on user type
    if (userType === 'admin') {
      store.dispatch({
        type: 'adminAuth/setAdminAuth',
        payload: {
          ...store.getState().adminAuth.adminData,
          token: accessToken
        }
      });
    } else {
      store.dispatch({
        type: 'employeeAuth/setEmployeeAuth',
        payload: {
          ...store.getState().employeeAuth.employeeData,
          token: accessToken
        }
      });
    }

    return accessToken;
  } catch (error) {
    // 3. If refresh fails, logout both users
    store.dispatch({ type: 'adminAuth/clearAdminAuth' });
    store.dispatch({ type: 'employeeAuth/clearEmployeeAuth' });
    throw error;
  }
};