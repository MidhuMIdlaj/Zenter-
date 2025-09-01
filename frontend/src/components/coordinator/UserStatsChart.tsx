// UserStatsChart.jsx (replacing AttendanceChart)
import { useState, useEffect } from 'react';
import { ClientListApi } from '../../api/admin/Client';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsers: number;
}

export default function UserStatsChart() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsers: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await ClientListApi();
        const response = res.clients;
        if (response && Array.isArray(response)) {
          const totalUsers = response.length;
          const activeUsers = response.filter(user => user.status ===  'active' ).length;
          const inactiveUsers = response.filter(user => user.status === 'inactive' ).length;
          // Calculate new users (created in last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const newUsers = response.filter(user => {
            const userDate = new Date(user.createdAt || user.registrationDate);
            return userDate > thirtyDaysAgo;
          }).length;

          setUserStats({
            totalUsers,
            activeUsers,
            inactiveUsers,
            newUsers
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const activePercentage = userStats.totalUsers > 0 
    ? Math.round((userStats.activeUsers / userStats.totalUsers) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">User Statistics</h3>
        <span className="text-sm text-gray-500">Total: {userStats.totalUsers}</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p>Active Users</p>
            </div>
            <p className="font-semibold">{userStats.activeUsers}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <p>New Users (30d)</p>
            </div>
            <p className="font-semibold">{userStats.newUsers}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <p>Inactive Users</p>
            </div>
            <p className="font-semibold">{userStats.inactiveUsers}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
          <div 
            className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500" 
            style={{ transform: `rotate(${activePercentage * 3.6}deg)` }} 
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="font-bold text-xl">{activePercentage}%</p>
            <p className="text-xs text-gray-500">Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
}