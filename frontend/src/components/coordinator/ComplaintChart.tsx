import { Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComplaintData {
  month: string;
  value: number;
}

export default function ComplaintChart({ data }: { data: ComplaintData[] }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">SEMESTER REPORT</p>
          <p className="text-3xl font-bold">2671</p>
          <p className="text-sm text-gray-500">Complaints were registered</p>
        </div>
        <div className="bg-indigo-100 rounded-full p-3">
          <Bell className="w-5 h-5 text-indigo-500" />
        </div>
      </div>
      <div className="h-48 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}