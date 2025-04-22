import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { selectAdminAuthData, selectEmployeeAuthData } from '../store/selectors';

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
    console.log("1")
  const { isAuthenticated: isAdminAuthenticated, isLoading: isLoadingAdmin } = 
    useSelector(selectAdminAuthData);
  const { isAuthenticated: isEmployeeAuthenticated, isLoading: isLoadingEmployee, position } = 
    useSelector(selectEmployeeAuthData);

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
  console.log(isEmployeeAuthenticated, "isEmployeeAuthenticated")
  if (isEmployeeAuthenticated) {
    console.log("2")
    const redirectPath = position === 'mechanic' 
      ? '/mechanic/dashboard' 
      : '/coordinator/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;