import { useState, useEffect } from 'react';
import { Clock, Users, DollarSign, ShoppingCart, MapPin, User } from 'lucide-react';

export default function MechanicDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animation states
  const [animateStats, setAnimateStats] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  
  useEffect(() => {
    // Update time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Trigger animations sequentially
    setTimeout(() => setAnimateStats(true), 300);
    setTimeout(() => setAnimateCharts(true), 800);
    
    return () => clearInterval(timer);
  }, []);
  
  // Sample data for charts
  const registeredData = {
    count: 2671,
    monthlyCounts: [65, 59, 80, 81, 56, 55, 40, 75, 85, 60, 48, 30]
  };
  
  const semesterData = {
    solved: 55,
    unsolved: 25,
    notched: 20
  };
  
  const attendanceData = {
    onTime: 28,
    late: 7,
    notPresent: 28
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center">
              <User size={32} className="text-gray-800" />
            </div>
            <div>
              <p>Hi Arun (Mechanic)</p>
            </div>
          </div>
          
          <div className="text-xl font-bold">
            Mark Your Attendance : 
            <button 
              onClick={() => setIsCheckedIn(true)}
              className={`ml-4 px-4 py-2 rounded-md ${isCheckedIn ? 'bg-gray-600 text-gray-300' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={isCheckedIn}
            >
              Check In
            </button>
            <button 
              onClick={() => setIsCheckedIn(false)}
              className={`ml-2 px-4 py-2 rounded-md ${!isCheckedIn ? 'bg-gray-600 text-gray-300' : 'bg-red-600 hover:bg-red-700'}`}
              disabled={!isCheckedIn}
            >
              Check Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Dashboard Title */}
      <div className="container mx-auto mt-6 flex items-center">
        <h1 className="text-3xl font-bold ml-4">Dashboard</h1>
        <span className="text-2xl ml-2">🏠</span>
      </div>
      
      {/* Stats Cards */}
      <div className="container mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">TOTAL EARNED</p>
              <h2 className="text-2xl font-bold">$32,587</h2>
              <p className="text-green-500 text-sm mt-1">+2.5%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">TOTAL JOBS</p>
              <h2 className="text-2xl font-bold">3,200</h2>
              <p className="text-green-500 text-sm mt-1">+1.8%</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">PENDING JOBS</p>
              <h2 className="text-2xl font-bold">1,503</h2>
              <p className="text-red-500 text-sm mt-1">+0.5%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-500 transform ${animateStats ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">ASSIGNED COMPONENTS</p>
              <h2 className="text-2xl font-bold">172,000</h2>
              <p className="text-green-500 text-sm mt-1">+3.2%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-700 ${animateCharts ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">REGISTER REPORT</h2>
            <span className="text-gray-400">ⓘ</span>
          </div>
          <h3 className="text-2xl font-bold">{registeredData.count}</h3>
          <p className="text-gray-500 text-sm">Complaints were registered</p>
          
          <div className="mt-6 h-48 relative">
            {/* Simple dot graph visualization */}
            <div className="flex h-full items-end justify-between">
              {registeredData.monthlyCounts.map((count, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  <div 
                    className="w-3 h-3 rounded-full bg-blue-500 mb-1 transition-all duration-1000"
                    style={{
                      transform: animateCharts ? 'scale(1)' : 'scale(0)',
                      transitionDelay: `${300 + index * 100}ms`
                    }}
                  />
                  <div className="text-xs text-gray-400">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index].substring(0, 3)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-700 ${animateCharts ? 'opacity-100 delay-200' : 'opacity-0'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">SEMESTER REPORT</h2>
            <span className="text-gray-400">ⓘ</span>
          </div>
          <p className="text-gray-500 text-sm">Solved and Unsolved Complaints</p>
          
          <div className="mt-6 flex justify-center h-48">
            <div className="relative w-48 h-48">
              {/* Simple donut chart */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-1000" style={{ transform: animateCharts ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="20" 
                  strokeDasharray={`${semesterData.solved} ${100 - semesterData.solved}`} 
                  strokeDashoffset="25"
                  className="transition-all duration-1000"
                  style={{ opacity: animateCharts ? 1 : 0 }}
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke="#ec4899" 
                  strokeWidth="20" 
                  strokeDasharray={`${semesterData.unsolved} ${100 - semesterData.unsolved}`} 
                  strokeDashoffset={`${100 - semesterData.solved + 25}`}
                  className="transition-all duration-1000 delay-300"
                  style={{ opacity: animateCharts ? 1 : 0 }}
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  stroke="#8b5cf6" 
                  strokeWidth="20" 
                  strokeDasharray={`${semesterData.notched} ${100 - semesterData.notched}`} 
                  strokeDashoffset={`${100 - semesterData.solved - semesterData.unsolved + 25}`}
                  className="transition-all duration-1000 delay-500"
                  style={{ opacity: animateCharts ? 1 : 0 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="ml-4 flex flex-col justify-center">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                <span className="text-sm">Solved</span>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-pink-500 mr-2"></div>
                <span className="text-sm">Unsolved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 mr-2"></div>
                <span className="text-sm">Notched</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance and Map Section */}
      <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 mb-8">
        <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-700 ${animateCharts ? 'opacity-100 delay-400' : 'opacity-0'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <button className="text-blue-500 text-sm">View Status</button>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>{attendanceData.onTime} On Time</span>
            </div>
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>{attendanceData.late} Late Attendance</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span>{attendanceData.notPresent} Not Present</span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-270">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f3f4f6" strokeWidth="10" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="transparent" 
                  stroke="#3b82f6" 
                  strokeWidth="10" 
                  strokeDasharray={`${(attendanceData.onTime / (attendanceData.onTime + attendanceData.late + attendanceData.notPresent)) * 283} 283`} 
                  strokeDashoffset="0"
                  className="transition-all duration-1500"
                  style={{ 
                    strokeDasharray: animateCharts ? `${(attendanceData.onTime / (attendanceData.onTime + attendanceData.late + attendanceData.notPresent)) * 283} 283` : "0 283" 
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">2/{attendanceData.onTime + attendanceData.late + attendanceData.notPresent}</span>
                <span className="text-xs">This Month Leave</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`bg-white p-6 rounded-lg shadow-md transition-all duration-700 ${animateCharts ? 'opacity-100 delay-600' : 'opacity-0'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Location of the All user</h2>
          </div>
          
          <div className="h-64 bg-blue-50 rounded-lg relative overflow-hidden">
            {/* Placeholder for map */}
            <div className="absolute inset-0 bg-blue-100 opacity-70"></div>
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
              {Array(48).fill(0).map((_, i) => (
                <div key={i} className="border border-blue-200 border-opacity-50"></div>
              ))}
            </div>
            
            {/* Marker animation */}
            <div 
              className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-1000"
              style={{
                top: '40%',
                left: '60%',
                transform: animateCharts ? 'scale(1)' : 'scale(0)',
                boxShadow: '0 0 0 rgba(59, 130, 246, 0.5)',
                animation: animateCharts ? 'pulse 2s infinite' : 'none'
              }}
            >
              <MapPin size={16} className="text-white" />
            </div>
            
            <style jsx>{`
              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
                }
                70% {
                  box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}