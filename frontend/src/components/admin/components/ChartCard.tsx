import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {title !== "Sales overview" && (
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;