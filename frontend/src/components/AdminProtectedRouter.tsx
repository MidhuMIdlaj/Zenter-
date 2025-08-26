import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, adminData } = useSelector((state: any) => ({
    isAuthenticated: state.adminAuth?.isAuthenticated,
    isLoading: state.adminAuth?.isLoading,
    adminData: state.adminAuth?.adminData
  }));

  if (!isLoading && !isAuthenticated && !adminData) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default AdminProtectedRoute;