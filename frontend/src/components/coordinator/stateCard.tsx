// StatCard.jsx
interface StatCardProps {
  title: string;
  value: string | number;
  changeText: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

export default function StatCard({ title, value, changeText, icon, color, delay }: StatCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-500">{changeText}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
    </div>
  );
}