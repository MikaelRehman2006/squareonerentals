'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface UserPreference {
  _id: string;
  name: string;
  email: string;
  preferences: {
    userTypes: string[];
    city: string;
    completedOnboarding: boolean;
  };
  createdAt: string;
}

export default function SurveyResponsesPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/survey-responses');
      if (!response.ok) {
        throw new Error('Failed to fetch survey responses');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      toast.error('Failed to fetch survey responses');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    return user.preferences?.userTypes?.includes(activeTab);
  });

  const getUserTypeBadge = (type: string) => {
    const colors = {
      realtor: 'bg-blue-100 text-blue-800',
      landlord: 'bg-green-100 text-green-800',
      renter: 'bg-purple-100 text-purple-800',
      buyer: 'bg-orange-100 text-orange-800'
    };
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="realtor">Realtors</TabsTrigger>
              <TabsTrigger value="landlord">Landlords</TabsTrigger>
              <TabsTrigger value="renter">Renters</TabsTrigger>
              <TabsTrigger value="buyer">Buyers</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User Types</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Sign Up Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            {user.preferences?.userTypes?.map((type) => (
                              getUserTypeBadge(type)
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{user.preferences?.city}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 