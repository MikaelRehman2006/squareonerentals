'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StatusDistributionChartProps {
  listings: Array<{ status: string }> | undefined;
}

export function StatusDistributionChart({ listings = [] }: StatusDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!listings || listings.length === 0) {
      return [];
    }

    // Count listings by status
    const statusCounts = listings.reduce((acc, listing) => {
      const status = listing.status || 'Unknown';
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format needed for the chart
    return Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [listings]);

  const COLORS = {
    'ACTIVE': '#4CAF50',    // Green
    'PENDING': '#FF9800',    // Orange
    'ARCHIVED': '#9E9E9E',   // Gray
    'REJECTED': '#F44336',   // Red
    'Unknown': '#607D8B'     // Blue Gray
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS] || '#607D8B'} 
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} listings`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
