import { 
    SalesDataPoint, 
    StockDataPoint, 
    DispatchDataPoint, 
    SegmentDataPoint, 
    ClientFormData, 
    SummaryItem, 
    StatsCardData 
  } from '../types/dashboard';
  
  export const salesData: SalesDataPoint[] = [
    { name: 'Jan', value: 120 },
    { name: 'Feb', value: 150 },
    { name: 'Mar', value: 180 },
    { name: 'Apr', value: 170 },
    { name: 'May', value: 200 },
    { name: 'Jun', value: 220 },
    { name: 'Jul', value: 180 },
    { name: 'Aug', value: 250 },
    { name: 'Sep', value: 230 },
    { name: 'Oct', value: 210 },
    { name: 'Nov', value: 190 },
    { name: 'Dec', value: 240 }
  ];
  
  export const ordersData: SalesDataPoint[] = [
    { name: 'Jul', value: 65 },
    { name: 'Aug', value: 80 },
    { name: 'Sep', value: 55 },
    { name: 'Oct', value: 75 },
    { name: 'Nov', value: 60 },
    { name: 'Dec', value: 85 }
  ];
  
  export const stockData: StockDataPoint[] = [
    { name: 'Jan', inStock: 5000, outStock: 3000 },
    { name: 'Feb', inStock: 6000, outStock: 4000 },
    { name: 'Mar', inStock: 4000, outStock: 2000 },
    { name: 'Apr', inStock: 3000, outStock: 1000 },
    { name: 'May', inStock: 5000, outStock: 3000 },
    { name: 'Jun', inStock: 4000, outStock: 2000 },
    { name: 'Jul', inStock: 7000, outStock: 5000 },
    { name: 'Aug', inStock: 6000, outStock: 3000 },
    { name: 'Sep', inStock: 5000, outStock: 2000 },
    { name: 'Oct', inStock: 4000, outStock: 3000 },
    { name: 'Nov', inStock: 5000, outStock: 4000 },
    { name: 'Dec', inStock: 6000, outStock: 3000 }
  ];
  
  export const dispatchData: DispatchDataPoint[] = Array(24).fill(undefined).map((_, i) => ({
    day: (i + 1).toString(),
    value: Math.floor(Math.random() * 30) + 10
  }));
  
  export const segmentData: SegmentDataPoint[] = [
    { name: "School", value: 35 },
    { name: "Business", value: 45 },
    { name: "Consumer", value: 20 }
  ];
  
  export const COLORS: string[] = ['#8884d8', '#0088fe', '#ff8042'];
  
  export const clients: ClientFormData[] = [
    { id: 1, name: 'Anthony Jackson', email: 'anthony@example.com', status: 'Online', lastLogin: '12/03/24' },
    { id: 2, name: 'Emily Wilson', email: 'emily@example.com', status: 'Online', lastLogin: '12/03/24' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', status: 'Online', lastLogin: '12/03/24' },
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', status: 'Online', lastLogin: '12/03/24' },
    { id: 5, name: 'Robert Smith', email: 'robert@example.com', status: 'Online', lastLogin: '12/03/24' }
  ];
  
  export const summaryItems: SummaryItem[] = [
    { title: 'Total Sales', value: '$32K', subtitle: 'Last week' },
    { title: 'Visitors', value: '6,250,645', subtitle: 'Online visitors' },
    { title: 'Customers', value: '542,245', subtitle: 'New customers' },
    { title: 'MRR', value: '$5K', subtitle: 'Monthly recurring' }
  ];
  
  export const statsCards: StatsCardData[] = [
    { 
      title: 'TOTAL REVENUE', 
      value: '$53,897', 
      change: '+5.28%', 
      period: 'From last month' 
    },
    { 
      title: 'TOTAL CUSTOMERS', 
      value: '3,200', 
      change: '+8.05%', 
      period: 'From last month' 
    },
    { 
      title: 'TOTAL ORDERS', 
      value: '+2,503', 
      change: '-3.93%', 
      period: 'From last month' 
    },
    { 
      title: 'PROFIT MARGIN', 
      value: '$73,000', 
      change: '+6.25%', 
      period: 'From last month' 
    }
  ];