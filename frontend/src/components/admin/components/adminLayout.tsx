import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps): React.JSX.Element => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <main className="flex-1 ml-72">
        <Outlet />
      </main>
        <main className="flex-1 p-6 overflow-auto">
          {children} 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;