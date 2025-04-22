import { Navigate, RouteObject } from 'react-router-dom';
import Login from '../pages/admin/Login';
import EmployeeLogin from '../pages/coordinator/LoginPage';
import ResetPasswordEmai from '../pages/coordinator/ResetPasswordEmai';
import AdminForgotPassword from '../pages/admin/ForgotPasswor'; 
import PublicOnlyRoute from '../components/PublicOnlyRoute';

const publicRoutes: RouteObject[] = [
  {
    path: '/admin-login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/employee-login',
    element: (
      <PublicOnlyRoute>
        <EmployeeLogin />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PublicOnlyRoute>
        <ResetPasswordEmai />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/admin/forgot-password',
    element: (
      <PublicOnlyRoute>
        <AdminForgotPassword />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/login/forgot-password',
    element: <Navigate to="/admin/forgot-password" replace />,
  },
  {
    path: '/admin-login',
    element: <Navigate to="/admin-login" replace />,
  },
];

export default publicRoutes;