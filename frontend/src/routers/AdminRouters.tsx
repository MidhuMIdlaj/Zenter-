import { RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/components/adminLayout';
import Dashboard from '../pages/admin/Dashboard';
import CustomerPage from '../components/admin/pages/CustomerList';
import EmployeeList from '../components/admin/pages/employeeList';
import AdminProtectedRoute from '../components/AdminProtectedRouter';

const adminRoutes: RouteObject[] = [
  {
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/admin/customers',
            element: <CustomerPage />,
          },
          {
            path: '/admin/employees',
            element: <EmployeeList />,
          },
        ],
      },
    ],
  },
];

export default adminRoutes;