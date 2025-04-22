import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../../components/admin/components/Header';
import StatsCard from '../../components/admin/components/StatsCard';
import ChartCard from '../../components/admin/components/ChartCard';
import ClientsList from '../../components/admin/components/ClientList';
import SummaryCard from '../../components/admin/components/SummaryCard';
import { 
  salesData, ordersData, stockData, dispatchData, 
  segmentData, COLORS, clients, summaryItems, statsCards 
} from '../../data/dashboardData';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      
      <div className="p-6 overflow-y-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard 
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              period={card.period}
            />
          ))}
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Sales Overview Chart */}
          <div className="col-span-2">
            <ChartCard 
              title="Sales overview"
              subtitle="Jan 2024 - Dec 2024"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4c83ee" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          
          {/* Total Orders Chart */}
          <ChartCard title="Total orders">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff7e3e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        
        {/* Clients List */}
        <div className="mt-6">
          <ClientsList clients={clients} />
        </div>
        
        {/* Dispatch and Segment Charts */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* Dispatch Report */}
          <ChartCard title="DISPATCH REPORT">
            <div>
              <p className="text-xl font-bold">2671</p>
              <p className="text-xs text-gray-500 mb-4">Items to be dispatched</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dispatchData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={0} dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#ffffff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          
          {/* Segment Report */}
          <ChartCard 
            title="SEGMENTED REPORT"
            subtitle="Brand and Channel Categories"
          >
            <div className="h-48 flex justify-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}-${entry}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        
        {/* Sales Summary */}
        <div className="mt-6">
          <SummaryCard items={summaryItems} />
        </div>
        
        {/* Stock Report */}
        <div className="mt-6">
          <ChartCard title="Stock Report">
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">In Stock</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-600">Out of Stock</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="inStock" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="outStock" stackId="a" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;