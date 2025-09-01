import { Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataEntry {
  name: string;
  value: number;
  color: string;
}

export default function ComplaintPieChart({ data }: { data: DataEntry[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* <p className="text-sm text-gray-500 font-medium">SEMESTER REPORT</p> */}
          <p className="text-sm text-gray-500">Solved and Unsolved Complaints</p>
        </div>
        <div className="bg-indigo-100 rounded-full p-3">
          <Bell className="w-5 h-5 text-indigo-500" />
        </div>
      </div>
      <div className="h-56 mt-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}