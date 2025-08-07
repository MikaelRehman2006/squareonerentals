'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestVerification() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSendCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult({ type: 'send', status: res.status, data });
    } catch (error) {
      setResult({ type: 'send', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testVerifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email,
          password: 'testpassword123',
          verificationCode: code,
        }),
      });
      const data = await res.json();
      setResult({ type: 'verify', status: res.status, data });
    } catch (error) {
      setResult({ type: 'verify', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/send-verification?email=${email}`);
      const data = await res.json();
      setResult({ type: 'status', status: res.status, data });
    } catch (error) {
      setResult({ type: 'status', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const cleanupCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cleanup-verification-codes', { method: 'POST' });
      const data = await res.json();
      setResult({ type: 'cleanup', status: res.status, data });
    } catch (error) {
      setResult({ type: 'cleanup', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Verification System Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testSendCode} disabled={loading || !email}>
              Send Code
            </Button>
            <Button onClick={checkVerificationStatus} disabled={loading || !email}>
              Check Status
            </Button>
            <Button onClick={cleanupCodes} disabled={loading}>
              Cleanup Codes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Verification Code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>
          
          <Button onClick={testVerifyCode} disabled={loading || !email || !code}>
            Test Registration
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
