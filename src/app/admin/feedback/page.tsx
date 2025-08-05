'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeedbackItem {
  _id: string;
  type: 'feedback' | 'issue';
  name?: string;
  email?: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  feedbackType?: string;
  category?: string;
  rating?: string;
  anonymous?: boolean;
  browser?: string;
  device?: string;
  steps?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    fetchFeedback();
  }, [filter, statusFilter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      console.log('Fetching feedback from:', `/api/admin/feedback?${params}`);
      
      const response = await fetch(`/api/admin/feedback?${params}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Feedback data received:', data);
        setFeedback(data.feedback);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (id: string, updates: any) => {
    try {
      const response = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id.toString(),
          ...updates
        }),
      });

      if (response.ok) {
        fetchFeedback();
        setSelectedItem(null);
        setAdminNotes('');
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleStatusUpdate = () => {
    if (selectedItem) {
      updateFeedback(selectedItem._id, {
        status,
        adminNotes: adminNotes || undefined
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Feedback & Issue Reports</h1>
        <p className="text-gray-600">Manage user feedback and issue reports</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="issue">Issue Reports</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Issues ({feedback.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No feedback found
                  </div>
                ) : (
                  feedback.map((item) => (
                    <div
                      key={item._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedItem?._id === item._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                        setAdminNotes(item.adminNotes || '');
                        setStatus(item.status);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">
                            {item.type}
                          </Badge>
                          {item.priority && (
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-black mb-1">
                        {item.subject}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {item.name && !item.anonymous && (
                          <span>{item.name}</span>
                        )}
                        {item.email && !item.anonymous && (
                          <span>{item.email}</span>
                        )}
                        {item.anonymous && (
                          <span>Anonymous</span>
                        )}
                        {item.feedbackType && (
                          <span>{item.feedbackType}</span>
                        )}
                        {item.category && (
                          <span>{item.category}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle>Feedback Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">{selectedItem.subject}</h3>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.steps && (
                  <div>
                    <h4 className="font-medium text-black mb-1">Steps to Reproduce:</h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">
                      {selectedItem.steps}
                    </p>
                  </div>
                )}

                {selectedItem.browser && (
                  <div>
                    <h4 className="font-medium text-black mb-1">Technical Info:</h4>
                    <p className="text-gray-600 text-sm">
                      Browser: {selectedItem.browser}<br/>
                      Device: {selectedItem.device}
                    </p>
                  </div>
                )}

                {selectedItem.rating && (
                  <div>
                    <h4 className="font-medium text-black mb-1">Rating:</h4>
                    <p className="text-gray-600 text-sm">
                      {selectedItem.rating} stars
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-black mb-2">Update Status</h4>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-2">Admin Notes</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleStatusUpdate} className="flex-1">
                    Update Status
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(null);
                      setAdminNotes('');
                      setStatus('pending');
                    }}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">
                  Click on a feedback item to view details and manage it.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 