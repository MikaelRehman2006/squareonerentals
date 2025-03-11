'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
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
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  id: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  Listing: {
    id: string;
    title: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    } | null;
  } | null;
  reporter: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/admin/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        toast.error('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReports();
        toast.success(`Report marked as ${status.toLowerCase()}`);
      } else {
        toast.error('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      toast.error('Failed to update report status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Review and manage reported listings.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Listing Owner</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.type}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    {report.Listing ? (
                      <Link
                        href={`/listings/${report.Listing.id}`}
                        className="text-primary hover:underline"
                      >
                        {report.Listing.title}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Deleted listing</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {report.Listing?.user ? (
                      report.Listing.user.name || report.Listing.user.email || 'Unknown'
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {report.reporter ? (
                      report.reporter.name || report.reporter.email || 'Unknown'
                    ) : (
                      'Unknown user'
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : report.status === 'RESOLVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {report.status.toLowerCase()}
                    </span>
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
                        {report.Listing && (
                          <DropdownMenuItem asChild>
                            <Link href={`/listings/${report.Listing.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Listing
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {report.status !== 'RESOLVED' && (
                          <DropdownMenuItem
                            onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        {report.status !== 'REJECTED' && (
                          <DropdownMenuItem
                            onClick={() => updateReportStatus(report.id, 'REJECTED')}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Report
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 