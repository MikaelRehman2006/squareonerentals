'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      </div>
    </div>
  );
}
