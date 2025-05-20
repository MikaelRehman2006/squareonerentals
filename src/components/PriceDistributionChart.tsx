'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PriceDistributionChartProps {
  listings: Array<{ price: number }> | undefined;
}

export function PriceDistributionChart({ listings = [] }: PriceDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!listings || listings.length === 0) {
      return [];
    }

    // Define price ranges
    const ranges = [
      { min: 0, max: 1000, name: '$0-1K' },
      { min: 1000, max: 1500, name: '$1K-1.5K' },
      { min: 1500, max: 2000, name: '$1.5K-2K' },
      { min: 2000, max: 2500, name: '$2K-2.5K' },
      { min: 2500, max: 3000, name: '$2.5K-3K' },
      { min: 3000, max: 4000, name: '$3K-4K' },
      { min: 4000, max: 5000, name: '$4K-5K' },
      { min: 5000, max: Infinity, name: '$5K+' }
    ];

    // Initialize count for each range
    const distribution = ranges.map(range => ({
      name: range.name,
      count: 0,
      min: range.min,
      max: range.max
    }));

    // Count listings in each range
    listings.forEach(listing => {
      const price = listing.price;
      const rangeIndex = ranges.findIndex(
        range => price >= range.min && price < range.max
      );
      
      if (rangeIndex !== -1) {
        distribution[rangeIndex].count++;
      }
    });

    return distribution;
  }, [listings]);

  const customColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [value, 'Number of Listings']}
            labelFormatter={(label) => `Price Range: ${label}`}
          />
          <Legend />
          <Bar dataKey="count" name="Number of Listings" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
