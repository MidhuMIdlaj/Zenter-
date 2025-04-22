import { RouteObject } from 'react-router-dom';
import EmployeeProtectedRoute from '../components/EmployeeProtectedRoute';
import EmployeeDashboard from '../pages/coordinator/Dashboard';
// import Profile from '../pages/employee/Profile';

const employeeRoutes: RouteObject[] = [
  {
    element: <EmployeeProtectedRoute />,
    children: [
      {
        path: '/coordinator/dashboard',
        element: <EmployeeDashboard />,
      },
    //   {
    //     path: '/employee/profile',
    //     element: <Profile />,
    //   },
    ],
  },
];

export default employeeRoutes;