'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

export default function ActivateMembershipPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [membershipType, setMembershipType] = useState('BASIC');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pre-fill with session email if available
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the debug endpoint to set membership
      const response = await fetch('/api/debug/set-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: membershipType,
          isAnnual
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Membership activated', {
          description: `${membershipType} membership has been activated for ${email}`
        });
      } else {
        toast.error('Failed to set membership', {
          description: result.error || 'An unknown error occurred'
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to set membership'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Activate Membership</h1>
      
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="bg-yellow-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <span role="img" aria-label="warning">u26a0ufe0f</span>
            Developer Mode
          </CardTitle>
          <CardDescription>
            FOR DEVELOPMENT USE ONLY - Set membership status directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
              <p className="text-sm text-gray-500">
                Enter the email of the user to modify membership
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Membership Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant={membershipType === 'BASIC' ? 'default' : 'outline'}
                  onClick={() => setMembershipType('BASIC')}
                  className="w-full"
                >
                  Basic Membership
                </Button>
                <Button 
                  type="button"
                  variant={membershipType === 'FEATURED' ? 'default' : 'outline'}
                  onClick={() => setMembershipType('FEATURED')}
                  className="w-full"
                >
                  Featured Membership
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Billing Period</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button"
                  variant={!isAnnual ? 'default' : 'outline'}
                  onClick={() => setIsAnnual(false)}
                  className="w-full"
                >
                  Monthly
                </Button>
                <Button 
                  type="button"
                  variant={isAnnual ? 'default' : 'outline'}
                  onClick={() => setIsAnnual(true)}
                  className="w-full"
                >
                  Annual
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Setting Membership...' : 'Set Membership'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
