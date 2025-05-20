'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceDistributionChart } from './PriceDistributionChart';
import { LocationDistributionChart } from './LocationDistributionChart';
import { StatusDistributionChart } from './StatusDistributionChart';
import { GrowthChart } from './GrowthChart';

interface AdvancedAnalyticsProps {
  stats: {
    listings?: Array<any>;
    monthlyStats?: {
      users: any[];
      listings: any[];
    };
  };
}

export function AdvancedAnalytics({ stats }: AdvancedAnalyticsProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Advanced Analytics</CardTitle>
        <CardDescription>
          Detailed insights about your rental platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">Price Distribution</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="growth">Growth Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Price Distribution</CardTitle>
                <CardDescription>Distribution of listing prices across ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <PriceDistributionChart listings={stats.listings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="location" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Location Distribution</CardTitle>
                <CardDescription>Geographic distribution of listings</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationDistributionChart listings={stats.listings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="status" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Status Distribution</CardTitle>
                <CardDescription>Distribution of listing statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusDistributionChart listings={stats.listings} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="growth" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Growth Trends</CardTitle>
                <CardDescription>User and listing growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.monthlyStats && (
                  <GrowthChart
                    usersData={stats.monthlyStats.users}
                    listingsData={stats.monthlyStats.listings}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
