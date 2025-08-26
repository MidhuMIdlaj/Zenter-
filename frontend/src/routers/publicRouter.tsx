import { RouteObject } from 'react-router-dom';
import Login from '../pages/admin/Login';
import EmployeeLogin from '../pages/coordinator/LoginPage';
import ResetPasswordEmail from '../pages/coordinator/ResetPasswordEmai';
import AdminForgotPassword from '../pages/admin/ForgotPasswor';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import VideoCallJoinPage from '../components/video-call/VideoCallJoinPage';

const publicRoutes: RouteObject[] = [
  {
    path: '/admin-login',
    element: <PublicOnlyRoute><Login /></PublicOnlyRoute>,
  },
  {
    path: '/employee-login',
    element: <PublicOnlyRoute><EmployeeLogin /></PublicOnlyRoute>,
  },
  {
    path: '/reset-password',
    element: <PublicOnlyRoute><ResetPasswordEmail /></PublicOnlyRoute>,
  },
  {
    path: '/admin/forgot-password',
    element: <PublicOnlyRoute><AdminForgotPassword /></PublicOnlyRoute>,
  },
  {
    path: '/login/forgot-password',
    element: <PublicOnlyRoute><AdminForgotPassword /></PublicOnlyRoute>,
  },
   {
    path: '/video-call',
    element: <VideoCallJoinPage />,
  },
];

export default publicRoutes;