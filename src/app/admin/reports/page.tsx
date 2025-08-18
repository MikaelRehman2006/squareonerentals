'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Add dynamic export to prevent prerendering issues
export const dynamic = 'force-dynamic';

interface Report {
  id: string;
  listing: {
    id: string;
    title: string;
    status: string;
  };
  reportedBy: {
    id: string;
    name: string;
    email: string | null;
  };
  listingOwner: {
    id: string;
    name: string;
    email: string | null;
  };
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WarnUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

function WarnUserDialog({ open, onClose, onConfirm }: WarnUserDialogProps) {
  const [message, setMessage] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Warning</DialogTitle>
          <DialogDescription>
            Send a warning message to the user about their listing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Warning Message</Label>
            <Textarea
              placeholder="Enter your warning message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={() => onConfirm(message)} className="w-full">
            Send Warning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/reports?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchReports();
        toast.success('Report status updated successfully');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    }
  };

  const handleWarnUser = async (message: string) => {
    if (!selectedReport) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedReport.listingOwner.id}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          reportId: selectedReport.id,
          listingId: selectedReport.listing.id,
        }),
      });

      if (response.ok) {
        toast.success('Warning sent successfully');
        updateReportStatus(selectedReport.id, 'WARNED');
      }
    } catch (error) {
      console.error('Error sending warning:', error);
      toast.error('Failed to send warning');
    } finally {
      setShowWarnDialog(false);
      setSelectedReport(null);
    }
  };

  const handleTakeAction = async (reportId: string, action: 'ban' | 'remove') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      if (action === 'ban') {
        const response = await fetch(`/api/admin/users/${report.listingOwner.id}/ban`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: '7d', reason: report.reason }),
        });

        if (response.ok) {
          toast.success('User banned successfully');
          updateReportStatus(reportId, 'ACTIONED');
        }
      } else if (action === 'remove') {
        const response = await fetch(`/api/admin/listings/${report.listing.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Listing removed successfully');
          updateReportStatus(reportId, 'ACTIONED');
        }
      }
    } catch (error) {
      console.error('Error taking action:', error);
      toast.error(`Failed to ${action === 'ban' ? 'ban user' : 'remove listing'}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Reports</h2>
        <p className="text-muted-foreground">
          Review and manage reported listings and users.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </form>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="warned">Warned</SelectItem>
            <SelectItem value="actioned">Actioned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow className="hover:bg-gray-800">
              <TableHead className="text-white">Listing</TableHead>
              <TableHead className="text-white">Reported By</TableHead>
              <TableHead className="text-white">Owner</TableHead>
              <TableHead className="text-white">Reason</TableHead>
              <TableHead className="text-white">Description</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="w-[100px] text-white"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports && reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id} className="even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <TableCell>
                    <Link
                      href={`/listings/${report.listing.id}`}
                      className="text-primary hover:underline"
                    >
                      {report.listing.title}
                    </Link>
                    {report.listing.status === 'FLAGGED' && (
                      <Badge variant="destructive" className="ml-2">
                        Flagged
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users?search=${report.reportedBy.email}`}
                      className="text-foreground hover:underline"
                    >
                      {report.reportedBy.name || report.reportedBy.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users?search=${report.listingOwner.email}`}
                      className="text-foreground hover:underline"
                    >
                      {report.listingOwner.name || report.listingOwner.email}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {report.reason}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span className="truncate max-w-xs" title={report.description || 'No description provided'}>{report.description || 'No description provided'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === 'RESOLVED'
                          ? 'outline'
                          : report.status === 'REJECTED'
                          ? 'secondary'
                          : report.status === 'WARNED' || report.status === 'ACTIONED'
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/listings/${report.listing.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {report.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report);
                                setShowWarnDialog(true);
                              }}
                            >
                              Send Warning
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleTakeAction(report.id, 'ban')}
                              className="text-red-600"
                            >
                              Ban User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleTakeAction(report.id, 'remove')}
                              className="text-red-600"
                            >
                              Remove Listing
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {report.status !== 'RESOLVED' && report.status !== 'ACTIONED' && (
                          <DropdownMenuItem
                            onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        {report.status !== 'REJECTED' && report.status !== 'ACTIONED' && (
                          <DropdownMenuItem
                            onClick={() => updateReportStatus(report.id, 'REJECTED')}
                          >
                            Reject Report
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <WarnUserDialog
        open={showWarnDialog}
        onClose={() => {
          setShowWarnDialog(false);
          setSelectedReport(null);
        }}
        onConfirm={handleWarnUser}
      />
    </div>
  );
}