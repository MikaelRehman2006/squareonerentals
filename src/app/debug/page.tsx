'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

// Component to directly set membership without Stripe
function MembershipDebugPanel({ session }: { session?: { user?: { email?: string } } | null }) {
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
        <RadioGroup defaultValue={membershipType} onValueChange={setMembershipType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BASIC" id="basic" />
            <Label htmlFor="basic">Basic Membership</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="FEATURED" id="featured" />
            <Label htmlFor="featured">Featured Membership</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Billing Period</Label>
        <RadioGroup defaultValue={isAnnual ? "annual" : "monthly"} onValueChange={(v: string) => setIsAnnual(v === "annual")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="annual" id="annual" />
            <Label htmlFor="annual">Annual</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Setting Membership...' : 'Set Membership'}
      </Button>
    </form>
  );
}

export default function DebugPage() {
  const { data: clientSession, status } = useSession();
  const [serverSession, setServerSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchServerSession = async () => {
    try {
      const response = await fetch('/api/debug/session');
      const data = await response.json();
      setServerSession(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch session data');
    }
  };

  useEffect(() => {
    fetchServerSession();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Client-side Session */}
        <Card>
          <CardHeader>
            <CardTitle>Client-side Session</CardTitle>
            <CardDescription>Session data from useSession() hook</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify({ status, session: clientSession }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Server-side Session */}
        <Card>
          <CardHeader>
            <CardTitle>Server-side Session</CardTitle>
            <CardDescription>Session data from getServerSession()</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(serverSession, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Debug actions and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchServerSession}>
              Refresh Session Data
            </Button>
            <div className="text-sm text-gray-500">
              <p>To access the admin panel:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Verify your email matches one of the admin emails above</li>
                <li>Check if isAdmin is true in the server session data</li>
                <li>Try accessing <code className="bg-gray-100 px-1">/admin</code> directly</li>
                <li>Clear your browser cache and cookies if issues persist</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Membership Debug Tools */}
        <Card className="bg-yellow-50 border-yellow-300">
          <CardHeader className="bg-yellow-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <span role="img" aria-label="warning">⚠️</span>
              Membership Debug Tools
            </CardTitle>
            <CardDescription>
              FOR DEVELOPMENT USE ONLY - Set membership status directly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <MembershipDebugPanel session={clientSession} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
