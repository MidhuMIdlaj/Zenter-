// src/routers/MechanicRouters.js
import { RouteObject } from 'react-router-dom';
import MechanicLayout from '../components/mechanicn/mechanicLayout';
import MechanicDashboard from '../pages/mechanic/Dashboard';
import MechanicProtectedRoute from '../components/mechanicProtectedRouter';
import TaskManagement from '../pages/mechanic/TaskManagement'
import ChatWithCoordinator from '../pages/mechanic/ChatWithCoordinator'
import ProfilePage from  '../pages/mechanic/profilePage'

const mechanicRoutes: RouteObject[] = [
  {
    element: <MechanicProtectedRoute />,
    children: [
      {
        element: <MechanicLayout />,
        children: [
          {
            path: '/mechanic/dashboard',
            element: <MechanicDashboard />,
          },
          {
            path: '/mechanic/tasks',
            element: <TaskManagement/>,
          },
          {
            path: '/mechanic/chat',
            element: <ChatWithCoordinator/>,
          },
          {
            path : '/mechanic/profile',
            element : <ProfilePage/>
          }
        ],
      },
    ],
  },
];

export default mechanicRoutes;