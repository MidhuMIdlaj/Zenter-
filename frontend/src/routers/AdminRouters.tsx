import { RouteObject } from 'react-router-dom';
import AdminLayout from '../components/admin/components/adminLayout';
import Dashboard from '../pages/admin/Dashboard';
import EmployeeTable from '../components/admin/pages/employees/EmployeTable';
import AdminProtectedRoute   from '../components/AdminProtectedRouter';
import CustomerTable from '../components/admin/pages/customers/CustomerTable';
import ComplaintTable from '../components/admin/pages/cumplaints/ComplaintTable';
import ChatWithCoordinator from '../components/admin/pages/chatWithCoordinator';
import AdminVideoCallPage from '../components/admin/pages/adminVideoCallPage.tsx';
import ProfilePage from '../pages/admin/ProfilePage.tsx'

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
            element: <CustomerTable />,
          },
          {
            path: '/admin/employees',
            element: <EmployeeTable />,
          },
          {
            path: '/admin/complaint',
            element: <ComplaintTable />,
          },
            {
            path: '/admin/chat',
            element: <ChatWithCoordinator />,
          },
          {
            path: '/admin/video-call', 
            element: <AdminVideoCallPage />,
          },
          {
            path : 'admin/profilePage',
            element : <ProfilePage/>
          }
        ],
      },
    ],
  },
];

export default adminRoutes;