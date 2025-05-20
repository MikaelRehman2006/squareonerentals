'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlyStatsItem {
  _id: {
    year: number;
    month: number;
    status?: string;
  };
  count: number;
}

interface GrowthChartProps {
  usersData: MonthlyStatsItem[];
  listingsData: MonthlyStatsItem[];
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function GrowthChart({ usersData = [], listingsData = [] }: GrowthChartProps) {
  // Process the data for charting
  const chartData = useMemo(() => {
    const dataMap = new Map();
    
    try {
      // Process users data if it exists
      if (Array.isArray(usersData)) {
        usersData.forEach(item => {
          if (!item || !item._id) return;
          
          const year = item._id.year || new Date().getFullYear();
          const month = item._id.month || 1;
          const key = `${year}-${month}`;
          const monthIndex = Math.max(0, Math.min(month - 1, 11)); // Ensure valid month index
          const monthLabel = `${monthNames[monthIndex]} ${year}`;
          
          if (!dataMap.has(key)) {
            dataMap.set(key, { 
              name: monthLabel, 
              users: 0, 
              listings: 0,
              activeListings: 0,
              monthKey: month + (year * 12)  // For sorting
            });
          }
          
          dataMap.get(key).users += item.count || 0;
        });
      }
      
      // Process listings data if it exists
      if (Array.isArray(listingsData)) {
        listingsData.forEach(item => {
          if (!item || !item._id) return;
          
          const year = item._id.year || new Date().getFullYear();
          const month = item._id.month || 1;
          const key = `${year}-${month}`;
          const monthIndex = Math.max(0, Math.min(month - 1, 11)); // Ensure valid month index
          const monthLabel = `${monthNames[monthIndex]} ${year}`;
          
          if (!dataMap.has(key)) {
            dataMap.set(key, { 
              name: monthLabel, 
              users: 0, 
              listings: 0,
              activeListings: 0,
              monthKey: month + (year * 12)  // For sorting
            });
          }
          
          if (item._id.status === 'ACTIVE') {
            dataMap.get(key).activeListings += item.count || 0;
          }
          dataMap.get(key).listings += item.count || 0;
        });
      }
    } catch (error) {
      console.error('Error processing chart data:', error);
    }
    
    // Convert to array and sort by date
    return Array.from(dataMap.values())
      .sort((a, b) => a.monthKey - b.monthKey)
      .slice(-6); // Show only the last 6 months
  }, [usersData, listingsData]);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            name="Users"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="listings"
            name="Total Listings"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            dataKey="activeListings"
            name="Active Listings"
            stroke="#ff7300"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
