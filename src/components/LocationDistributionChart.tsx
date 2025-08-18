'use client';

import { useMemo, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface LocationDistributionChartProps {
  listings: Array<{ location: string }> | undefined;
}

// List of Canadian cities to recognize
const CANADIAN_CITIES = [
  'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton',
  'Ottawa', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton',
  'Brampton', 'Surrey', 'Kitchener', 'London', 'Windsor', 'Victoria',
  'Halifax', 'Oshawa', 'Gatineau', 'Saskatoon', 'Regina', 'St. John\'s',
  'Barrie', 'Kelowna', 'Abbotsford', 'Sherbrooke', 'Guelph', 'Markham',
  'Kingston', 'Vaughan', 'Burlington', 'Oakville', 'Richmond Hill',
  'Waterloo', 'Ajax', 'Cambridge', 'Whitby', 'Milton', 'Pickering',
  'Thunder Bay', 'Brantford', 'Lethbridge', 'St. Catharines', 'Niagara Falls',
  'Coquitlam', 'Mississauga', 'Scarborough', 'Etobicoke', 'North York',
  'Burnaby', 'Richmond', 'Laval', 'Longueuil', 'Surrey', 'Delta',
  'Squamish', 'Whistler', 'Muskoka'
];

export function LocationDistributionChart({ listings = [] }: LocationDistributionChartProps) {
  const [showOtherDetails, setShowOtherDetails] = useState(false);
  const [otherLocations, setOtherLocations] = useState<{name: string, value: number}[]>([]);

  // Process data for the chart
  const { chartData, otherLocationDetails } = useMemo(() => {
    if (!listings || listings.length === 0) {
      return { chartData: [], otherLocationDetails: [] };
    }

    // Count listings by location
    const locationCounts = listings.reduce((acc, listing) => {
      const location = listing.location || 'Unknown';
      if (!acc[location]) {
        acc[location] = 0;
      }
      acc[location]++;
      return acc;
    }, {} as Record<string, number>);

    // Separate Canadian cities from other locations
    const canadianCities: Record<string, number> = {};
    const otherLocations: Record<string, number> = {};
    let otherTotal = 0;

    Object.entries(locationCounts).forEach(([location, count]) => {
      // Check if the location contains any Canadian city name
      const isCanadian = CANADIAN_CITIES.some(city => 
        location.toLowerCase().includes(city.toLowerCase())
      );

      if (isCanadian) {
        canadianCities[location] = count;
      } else {
        otherLocations[location] = count;
        otherTotal += count;
      }
    });

    // Create data for the chart
    const mainChartData = Object.entries(canadianCities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Add the 'Other' category if there are any non-Canadian locations
    if (otherTotal > 0) {
      mainChartData.push({ name: 'Other', value: otherTotal });
    }

    // Create detailed data for 'Other' category
    const otherDetails = Object.entries(otherLocations)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      chartData: mainChartData,
      otherLocationDetails: otherDetails
    };
  }, [listings]);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
    // More colors for cities
    '#d53e4f', '#fc8d59', '#fee08b', '#e6f598', '#99d594', 
    '#3288bd', '#5e4fa2', '#f46d43', '#fdae61', '#abdda4'
  ];

  // Special color for 'Other' category
  const OTHER_COLOR = '#9e9e9e';

  // Handle click on the 'Other' slice
  const handlePieClick = (data: any) => {
    if (data && data.name === 'Other') {
      setOtherLocations(otherLocationDetails);
      setShowOtherDetails(true);
    }
  };

  return (
    <>
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
              onClick={handlePieClick}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'Other' ? OTHER_COLOR : COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} listings`, 'Count']} 
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const { name, value } = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-bold">{name}</p>
                      <p>{value} listings</p>
                      {name === 'Other' && (
                        <p className="text-xs italic text-blue-600">Click to see details</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend formatter={(value) => (
              <span className={value === 'Other' ? 'cursor-pointer text-blue-600 font-medium' : ''}>
                {value}
                {value === 'Other' && otherLocationDetails.length > 0 && ' (click for details)'}
              </span>
            )} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Dialog for 'Other' locations */}
      <Dialog open={showOtherDetails} onOpenChange={setShowOtherDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Other Locations</DialogTitle>
            <DialogDescription>
              Detailed breakdown of locations outside of major Canadian cities
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow className="hover:bg-gray-800">
                  <TableHead className="text-white">Location</TableHead>
                  <TableHead className="text-right text-white">Number of Listings</TableHead>
                  <TableHead className="text-right text-white">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherLocations.map((location) => {
                  const totalOther = otherLocations.reduce((sum, loc) => sum + loc.value, 0);
                  const percentage = ((location.value / totalOther) * 100).toFixed(1);
                  
                  return (
                    <TableRow key={location.name}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell className="text-right">{location.value}</TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowOtherDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
