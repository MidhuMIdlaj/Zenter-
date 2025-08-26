import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  period: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value,  period }) => {
  // const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-1">
            {/* <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span> */}
            <span className="text-xs text-gray-500 ml-2">{period}</span>
          </div>
        </div>
        <button className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default StatsCard;