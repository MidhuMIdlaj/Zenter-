import React from 'react';
import { Clock, PenTool, CheckCircle, AlertCircle } from 'lucide-react';

interface StatsSummaryProps {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
  animateStats?: boolean;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ 
  pending, 
  inProgress, 
  completed, 
  total,
  animateStats = true 
}) => {
  const statCards = [
    {
      title: 'PENDING TASKS',
      value: pending,
      description: 'Needs attention',
      descriptionColor: 'text-amber-500',
      icon: <Clock size={24} className="text-amber-500" />,
      iconBg: 'bg-amber-100',
      delay: 0
    },
    {
      title: 'IN PROGRESS',
      value: inProgress,
      description: 'Currently working',
      descriptionColor: 'text-blue-500',
      icon: <PenTool size={24} className="text-blue-500" />,
      iconBg: 'bg-blue-100',
      delay: 0.1
    },
    {
      title: 'COMPLETED',
      value: completed,
      description: 'Successfully resolved',
      descriptionColor: 'text-green-500',
      icon: <CheckCircle size={24} className="text-green-500" />,
      iconBg: 'bg-green-100',
      delay: 0.2
    },
    {
      title: 'TOTAL ASSIGNED',
      value: total,
      description: 'All complaints',
      descriptionColor: 'text-gray-500',
      icon: <AlertCircle size={24} className="text-gray-500" />,
      iconBg: 'bg-gray-100',
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-4 rounded-lg shadow-md transform transition-all duration-500 ${
            animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ 
            transitionDelay: `${card.delay}s`
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold">{card.value}</h2>
              <p className={card.descriptionColor + " text-sm mt-1"}>{card.description}</p>
            </div>
            <div className={`${card.iconBg} p-2 rounded-lg`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;