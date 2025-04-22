import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../store/selectors';

const EmployeeProtectedRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, position } = useSelector(selectEmployeeAuthData);
 const navigate  = useNavigate()
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
  console.log("1")
  console.log(isAuthenticated, "isAuthenticated")
  if (!isAuthenticated) {
    console.log("2")
     navigate("/employee-login")
  }

  const path = location.pathname;
  if (path.includes('/mechanic') && position == 'mechanic') {
    return <Navigate to="/mechanic/dashboard" replace />;
  }
  if (path.includes('/coordinator') && position == 'coordinator') {
    return <Navigate to="/coordinator/dashboard" replace />;
  }

  return <Outlet />;
};

export default EmployeeProtectedRoute;