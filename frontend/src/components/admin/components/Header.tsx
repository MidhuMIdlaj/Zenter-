import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-blue-500 p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-blue-100">Project / Dashboard</p>
          <h1 className="text-white font-medium">DASHBOARD</h1>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="py-1 pl-8 pr-4 bg-blue-600 text-white placeholder-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <Search size={16} className="absolute left-2 top-1.5 text-blue-300" />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:bg-blue-300 transition-colors">
              A
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;