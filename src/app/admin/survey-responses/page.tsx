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
    onboardingCompleted: boolean;
    [role: string]: any;
  };
  createdAt: string;
}

export default function SurveyResponsesPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

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
                    <TableHead>Sign Up Date</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <>
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
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <button
                              className="text-blue-600 underline"
                              onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                            >
                              {expandedUser === user._id ? 'Hide' : 'Show'}
                            </button>
                          </TableCell>
                        </TableRow>
                        {expandedUser === user._id && (
                          <TableRow>
                            <TableCell colSpan={5} className="bg-gray-50">
                              <div className="space-y-6">
                                {user.preferences.userTypes.map((role: string) => (
                                  <div key={role} className="mb-4 p-4 rounded-lg border border-gray-200 bg-white">
                                    <div className="font-bold text-lg mb-2 text-blue-700 border-b border-blue-100 pb-1">{role.charAt(0).toUpperCase() + role.slice(1)} Info</div>
                                    <div className="grid grid-cols-2 gap-2 text-gray-900">
                                      {Object.entries(user.preferences[role] || {}).map(([key, value]) => (
                                        <div key={key} className="text-sm">
                                          <span className="font-medium capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
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