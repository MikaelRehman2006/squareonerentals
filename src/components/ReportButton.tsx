'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ReportListingModal from './ReportListingModal';

interface ReportButtonProps {
  type: 'LISTING' | 'USER';
  targetId: string;
  className?: string;
}

const reportReasons = {
  LISTING: [
    'Inappropriate content',
    'Misleading information',
    'Spam',
    'Fraudulent listing',
    'Wrong location',
    'Other',
  ],
  USER: [
    'Harassment',
    'Spam',
    'Fake profile',
    'Inappropriate behavior',
    'Other',
  ],
};

export default function ReportButton({ type, targetId, className = '' }: ReportButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          targetId,
          reason,
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit report');

      toast.success('Report submitted successfully');
      setIsOpen(false);
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  if (type === 'LISTING') {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${className}`}
          onClick={handleOpenModal}
        >
          <Flag className="h-5 w-5" />
          <span className="sr-only">Report {type.toLowerCase()}</span>
        </Button>
        <ReportListingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          targetId={targetId}
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`${className} text-gray-600 hover:text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white/90`}
          >
            <Flag className="h-5 w-5" />
            <span className="sr-only">Report {type.toLowerCase()}</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report {type.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Please provide details about why you're reporting this {type.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons[type].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Additional details</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional information that will help us understand the issue."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 