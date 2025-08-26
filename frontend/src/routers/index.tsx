import { Navigate, RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import publicRoutes from './publicRouter';
import adminRoutes from './AdminRouters';
import employeeRoutes from './EmployeeRouter'; 
import NotFound from '../pages/NotFound';
import mechanicRoutes from './mechanicRouter';

const routes: RouteObject[] = [
  ...publicRoutes,
  ...adminRoutes,
  ...employeeRoutes, 
  ...mechanicRoutes,
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;