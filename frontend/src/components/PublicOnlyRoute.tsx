import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { selectAdminAuthData, selectEmployeeAuthData } from '../store/selectors';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
  const { isAuthenticated: isAdminAuthenticated, isLoading: isLoadingAdmin } = 
    useSelector(selectAdminAuthData);
  const { isAuthenticated: isEmployeeAuthenticated, employeeData } = 
    useSelector(selectEmployeeAuthData);
 let isLoadingEmployee = false;
  if (isLoadingAdmin || isLoadingEmployee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (isEmployeeAuthenticated) {
    const redirectPath = employeeData?.position === 'mechanic' 
      ? '/mechanic/dashboard' 
      : '/coordinator/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;