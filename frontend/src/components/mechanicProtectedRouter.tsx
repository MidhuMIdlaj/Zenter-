import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../store/selectors';

const MechanicProtectedRoute = () => {
  const { isAuthenticated, employeeData, loading } = useSelector(selectEmployeeAuthData);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/employee-login" replace />;
  }
  
  if (employeeData?.position !== 'mechanic') {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default MechanicProtectedRoute;