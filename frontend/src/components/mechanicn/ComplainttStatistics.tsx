import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Complaint } from '../../types/complaint';


interface ComplaintStatisticsProps {
  complaints: Complaint[];
}

const ComplaintStatistics: React.FC<ComplaintStatisticsProps> = ({ complaints }) => {
  const getDayStats = () => {
    const today = new Date();
    const stats = Array(7).fill(0).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: 0,
        total: 0
      };
    }).reverse();

    complaints.forEach(complaint => {
      const complaintDate = new Date(complaint.updatedAt);
      const dayIndex = stats.findIndex(s => 
        new Date(today.setHours(0,0,0,0) - (6-stats.indexOf(s))*86400000).toLocaleDateString() === 
        complaintDate.toLocaleDateString()
      );
      
      if (dayIndex !== -1) {
        stats[dayIndex].total++;
        if (complaint.workingStatus === 'completed') {
          stats[dayIndex].completed++;
        }
      }
    });

    return stats;
  };

  const data = getDayStats();

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#93C5FD" name="Total Tasks" />
          <Bar dataKey="completed" fill="#34D399" name="Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplaintStatistics;