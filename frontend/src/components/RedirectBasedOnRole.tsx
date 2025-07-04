import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectEmployeeAuthData } from '../store/selectors';

const RedirectBasedOnRole = () => {
  const navigate = useNavigate();
  const { isAuthenticated, employeeData, loading } = useSelector(selectEmployeeAuthData);

  useEffect(() => {
    if (!loading && isAuthenticated && employeeData) {
      const position = employeeData.position.toLowerCase();
      
      if (position === 'mechanic') {
        navigate('/mechanic/dashboard', { replace: true });
      } else if (position === 'coordinator') {
        navigate('/coordinator/dashboard', { replace: true });
      } else {
        navigate('/employee-login', { replace: true });
      }
    } else if (!loading && !isAuthenticated) {
      navigate('/employee-login', { replace: true });
    }
  }, [loading, isAuthenticated, employeeData, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectBasedOnRole;