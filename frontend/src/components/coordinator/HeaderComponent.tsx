interface HeaderProps {
  userName: string;
  userRole: string;
  checkedIn: boolean;
  setCheckedIn: (checkedIn: boolean) => void;
}

export default function Header({ userName, userRole, checkedIn, setCheckedIn }: HeaderProps) {
  return (
    <div className="bg-indigo-900 text-white px-8 py-6 rounded-lg mb-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="rounded-full bg-white p-1">
              <div className="rounded-full bg-indigo-500 w-12 h-12 flex items-center justify-center overflow-hidden">
                <img src="/api/placeholder/48/48" alt="User" className="rounded-full" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="text-xl font-semibold">Hi {userName} <span className="text-indigo-300">({userRole})</span></p>
            <p className="text-xs text-indigo-300">Welcome back! Your dashboard is ready</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold">Mark Attendance:</p>
          <button 
            className={`bg-green-600 text-white px-4 py-2 rounded-full transition-all duration-300 
              ${!checkedIn ? 'hover:bg-green-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => setCheckedIn(true)}
            disabled={checkedIn}
          >
            Check In
          </button>
          <button 
            className={`bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 
              ${checkedIn ? 'hover:bg-red-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={() => setCheckedIn(false)}
            disabled={!checkedIn}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
