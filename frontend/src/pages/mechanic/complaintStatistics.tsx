import React from 'react';
import { Complaint } from '../../types/complaint';

interface ComplaintStatisticsProps {
  complaints: Complaint[];
}

const ComplaintStatistics: React.FC<ComplaintStatisticsProps> = ({ complaints }) => {
  const totalComplaints = complaints.length;
  const completedCount = complaints.filter(c => c.workingStatus === 'completed').length;
  
  const highPriority = complaints.filter(c => c.priority === 'high').length;
  const mediumPriority = complaints.filter(c => c.priority === 'medium').length;
  const lowPriority = complaints.filter(c => c.priority === 'low').length;
  
  const completionRate = totalComplaints > 0 ? (completedCount / totalComplaints) * 100 : 0;
  const highPriorityPercent = totalComplaints > 0 ? (highPriority / totalComplaints) * 100 : 0;
  const mediumPriorityPercent = totalComplaints > 0 ? (mediumPriority / totalComplaints) * 100 : 0;
  const lowPriorityPercent = totalComplaints > 0 ? (lowPriority / totalComplaints) * 100 : 0;
  
  const stats = [
    { label: 'Completion Rate', value: `${completionRate.toFixed(1)}%` },
    { label: 'Tasks Finished', value: completedCount.toString() },
    { label: 'High Priority', value: `${highPriorityPercent.toFixed(1)}%` },
    { label: 'Tasks Remaining', value: (totalComplaints - completedCount).toString() }
  ];

  return (
    <div>
      {/* Statistical squares */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* Priority distribution bar */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Priority Distribution</p>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="bg-red-500 h-full" 
            style={{ width: `${highPriorityPercent}%` }}
          ></div>
          <div 
            className="bg-amber-500 h-full" 
            style={{ width: `${mediumPriorityPercent}%` }}
          ></div>
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${lowPriorityPercent}%` }}
          ></div>
        </div>
        
        <div className="flex mt-2 text-xs text-gray-600 justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            <span>High ({highPriority})</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
            <span>Medium ({mediumPriority})</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>Low ({lowPriority})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatistics;