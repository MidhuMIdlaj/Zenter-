import { useState, useEffect } from 'react';
import { Bell, MessageSquare, Home, Users, FileText, ShoppingCart, Settings, CreditCard, Send,  LogOut } from 'lucide-react';
import { clearEmployeeAuth } from '../../store/EmployeeAuthSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    console.log('Dashboard component rendered');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [checkedIn, setCheckedIn] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateCards(true);
  }, []);

  const handleLogout =async () => {
    let res = await dispatch(clearEmployeeAuth());
    console.log(res)
    navigate('/employee-login')
  }

  const tabs = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Lead Management', icon: <FileText className="w-5 h-5" /> },
    { name: 'User Management', icon: <Users className="w-5 h-5" /> },
    { name: 'Our Product', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Our Orders', icon: <FileText className="w-5 h-5" /> },
    { name: 'Complaint Management', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Spare and Parts', icon: <Settings className="w-5 h-5" /> },
    { name: 'Billing Page', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Notification', icon: <Bell className="w-5 h-5" /> },
    { name: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'logout', icon: <LogOut className="w-5 h-5" /> , onclick : handleLogout},
];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-indigo-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center text-sm font-medium transition-all duration-300 hover:text-indigo-200 ${
                activeTab === tab.name ? 'border-b-2 border-white' : ''
              }`}
              onClick={() => 
                tab.name === 'logout' ? tab.onclick?.() :
                setActiveTab(tab.name)
            }
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Header with User Info and Attendance */}
      <div className="bg-indigo-900 text-white px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center">
              <img src="/api/placeholder/48/48" alt="User" className="rounded-full" />
            </div>
            <div>
              <p className="text-xl font-semibold">Hi Arun (Coordinator)</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold">Mark Your Attendance :</p>
            <button 
              className={`bg-green-600 text-white px-4 py-2 rounded transition-all duration-300 ${!checkedIn ? 'hover:bg-green-700' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => setCheckedIn(true)}
              disabled={checkedIn}
            >
              Check In
            </button>
            <button 
              className={`bg-red-600 text-white px-4 py-2 rounded transition-all duration-300 ${checkedIn ? 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => setCheckedIn(false)}
              disabled={!checkedIn}
            >
              Check Out
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Home className="ml-2 w-6 h-6" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'TOTAL MONEY', value: '$51,897', change: '+$4,487', changeText: 'Since last month', icon: 'money', color: 'blue' },
            { title: 'USERS', value: '3,200', change: '+210', changeText: 'Since last month', icon: 'users', color: 'blue' },
            { title: 'COMPLAINTS', value: '2,503', change: '-2.85%', changeText: 'Since last month', icon: 'complaints', color: 'blue' },
            { title: 'TOTAL SALES', value: '173,000', change: '+5', changeText: 'per month', icon: 'sales', color: 'blue' }
          ].map((stat, index) => (
            <div 
              key={stat.title}
              className={`bg-white rounded-lg shadow-md p-6 transform transition-all duration-500 ${
                animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change} {stat.changeText}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
                  {stat.icon === 'money' && <CreditCard className="w-6 h-6 text-blue-500" />}
                  {stat.icon === 'users' && <Users className="w-6 h-6 text-blue-500" />}
                  {stat.icon === 'complaints' && <MessageSquare className="w-6 h-6 text-blue-500" />}
                  {stat.icon === 'sales' && <ShoppingCart className="w-6 h-6 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Semester Report - Complaints */}
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">SEMESTER REPORT</p>
                <p className="text-3xl font-bold">2671</p>
                <p className="text-sm text-gray-500">Complaints were registered</p>
              </div>
              <div className="bg-gray-100 rounded-full p-2">
                <Bell className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="h-48 mt-6 flex items-center justify-center">
              {/* Placeholder for line chart */}
              <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Simplified chart dots */}
                  {[
                    { x: '10%', y: '30%' }, { x: '20%', y: '40%' }, { x: '30%', y: '50%' },
                    { x: '40%', y: '20%' }, { x: '50%', y: '60%' }, { x: '60%', y: '40%' },
                    { x: '70%', y: '30%' }, { x: '80%', y: '50%' }, { x: '90%', y: '20%' }
                  ].map((point, i) => (
                    <div 
                      key={i}
                      className="absolute w-4 h-4 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: point.x, top: point.y, animation: `pulse 2s infinite ${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Semester Report - Solved and Unsolved */}
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">SEMESTER REPORT</p>
                <p className="text-sm text-gray-500">Solved and Unsolved Complaints</p>
              </div>
              <div className="bg-gray-100 rounded-full p-2">
                <Bell className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="h-48 mt-6 flex items-center justify-center">
              {/* Placeholder for Pie chart */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden">
                <div className="absolute w-full h-full bg-purple-400" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                <div className="absolute w-full h-full bg-pink-400" style={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}></div>
                <div className="absolute w-20 h-20 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Attendance */}
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Attendance</h3>
              <button className="text-blue-500 font-medium">View Status</button>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p>28 On Time</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p>7 Late Attendance</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <p>28 Not Present</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-transparent border-t-blue-500 transform -rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="font-bold">2/30</p>
                  <p className="text-xs text-gray-500">This Month Leave</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="mb-4">
              <h3 className="text-lg font-bold">Location of the All user</h3>
            </div>
            <div className="h-64 bg-blue-100 rounded-lg relative overflow-hidden">
              <img src="/api/placeholder/600/300" alt="Map" className="w-full h-full object-cover" />
              {/* Markers */}
              <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">1</div>
              <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-around">
        <button className="p-2 rounded-full bg-blue-500 text-white">
          <Home className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Users className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MessageSquare className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Send className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}