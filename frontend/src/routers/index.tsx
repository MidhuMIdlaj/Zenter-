import { Navigate, RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import publicRoutes from './publicRouter';
import adminRoutes from './AdminRouters';
import NotFound from '../pages/NotFound';
import employeeRoutes from './EmployeeRouter';

const routes: RouteObject[] = [
  ...publicRoutes,
  ...adminRoutes,
  ...employeeRoutes,
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;