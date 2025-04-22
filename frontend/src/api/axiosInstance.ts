// // src/api/adminAxiosInstance.ts
// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// let adminAuthToken: string | null = localStorage.getItem('adminAuthToken');
// let adminRefreshToken: string | null = localStorage.getItem('adminRefreshToken');

// interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// interface TokenResponse {
//   token: string;
//   refreshToken: string;
// }

// const adminApi: AxiosInstance = axios.create({
//   baseURL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// adminApi.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//   const newConfig = { ...config };
//   if (adminAuthToken) {
//     newConfig.headers = newConfig.headers || {};
//     newConfig.headers.Authorization = `Bearer ${adminAuthToken}`;
//   }
//   return newConfig;
// });

// adminApi.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as RetryableAxiosRequestConfig;

//     if (error.response?.status === 401 && adminRefreshToken && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const response = await axios.post<TokenResponse>(`${baseURL}/admin/refresh-token`, {
//           refreshToken: adminRefreshToken,
//         });

//         const { token, refreshToken: newRefreshToken } = response.data;

//         // Store new tokens
//         localStorage.setItem('adminAuthToken', token);
//         localStorage.setItem('adminRefreshToken', newRefreshToken);
//         adminAuthToken = token;
//         adminRefreshToken = newRefreshToken;

//         // Retry original request
//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//         }
//         return adminApi(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('adminAuthToken');
//         localStorage.removeItem('adminRefreshToken');
//         window.location.href = '/admin/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const updateAdminAuthTokens = (token: string, newRefreshToken: string): void => {
//   adminAuthToken = token;
//   adminRefreshToken = newRefreshToken;
//   localStorage.setItem('adminAuthToken', token);
//   localStorage.setItem('adminRefreshToken', newRefreshToken);
// };

// export const clearAdminAuthTokens = (): void => {
//   adminAuthToken = null;
//   adminRefreshToken = null;
//   localStorage.removeItem('adminAuthToken');
//   localStorage.removeItem('adminRefreshToken');
// };

// export default adminApi;
