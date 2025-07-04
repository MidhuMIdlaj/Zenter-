import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, PenTool, CheckCircle } from 'lucide-react';

interface StatusChartProps {
  pending: number;
  inProgress: number;
  completed: number;
  animate: boolean;
}

const StatusChart: React.FC<StatusChartProps> = ({ 
  pending, 
  inProgress, 
  completed, 
  animate 
}) => {
  const [animateChart, setAnimateChart] = useState(false);
  
  useEffect(() => {
    if (animate) {
      setAnimateChart(true);
    }
  }, [animate]);
  
  const total = pending + inProgress + completed;
  
  const pendingPercentage = total > 0 ? (pending / total) * 100 : 0;
  const inProgressPercentage = total > 0 ? (inProgress / total) * 100 : 0;
  // const completedPercentage = total > 0 ? (completed / total) * 100 : 0;
  
  // Ensure values add up to 100%
  const normalizedPending = pendingPercentage;
  const normalizedInProgress = inProgressPercentage;
  const normalizedCompleted = 100 - normalizedPending - normalizedInProgress;
  
  // For the donut chart animation
  const pendingEndAngle = normalizedPending * 3.6; // Convert percentage to degrees (out of 360)
  const inProgressEndAngle = pendingEndAngle + (normalizedInProgress * 3.6);
  
  // For calculating SVG arc parameters
  const radius = 60;
  const center = 70;
  
  const calculateArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Define arcs for each status
  const pendingPath = calculateArc(0, pendingEndAngle);
  const inProgressPath = calculateArc(pendingEndAngle, inProgressEndAngle);
  const completedPath = calculateArc(inProgressEndAngle, 360);
  
  const statusItems = [
    { 
      name: 'Pending', 
      value: pending,
      percentage: Math.round(normalizedPending),
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      icon: <Clock size={20} className="text-amber-500" />
    },
    { 
      name: 'In Progress', 
      value: inProgress,
      percentage: Math.round(normalizedInProgress),
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      icon: <PenTool size={20} className="text-blue-500" />
    },
    { 
      name: 'Completed', 
      value: completed,
      percentage: Math.round(normalizedCompleted),
      color: '#10B981',
      bgColor: '#D1FAE5',
      icon: <CheckCircle size={20} className="text-green-500" />
    }
  ];
  
  return (
    <div className="p-2">
      <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
      
      <div className="flex flex-col items-center mb-4">
        {/* Donut Chart */}
        <div className="relative w-36 h-36">
          <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
            {/* Background circle */}
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill="transparent" 
              stroke="#E5E7EB" 
              strokeWidth="12"
            />
            
            {/* Pending segment */}
            {pending > 0 && (
              <motion.path
                d={pendingPath}
                fill="transparent"
                stroke="#F59E0B"
                strokeWidth="12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animateChart ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            )}
            
            {/* In Progress segment */}
            {inProgress > 0 && (
              <motion.path
                d={inProgressPath}
                fill="transparent"
                stroke="#3B82F6"
                strokeWidth="12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animateChart ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            )}
            
            {/* Completed segment */}
            {completed > 0 && (
              <motion.path
                d={completedPath}
                fill="transparent"
                stroke="#10B981"
                strokeWidth="12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: animateChart ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            )}
          </svg>
          
          {/* Total count in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: animateChart ? 1 : 0, scale: animateChart ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center"
            >
              <span className="text-2xl font-bold text-gray-700">{total}</span>
              <span className="block text-xs text-gray-500">Total</span>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="space-y-3 mt-4">
        {statusItems.map((item, index) => (
          <motion.div 
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: animateChart ? 1 : 0, x: animateChart ? 0 : -20 }}
            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="p-1.5 rounded-md mr-2" style={{ backgroundColor: item.bgColor }}>
                {item.icon}
              </div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{item.value}</span>
              <span className="text-xs text-gray-500">({item.percentage}%)</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;