'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, Mail, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function DebuggingPage() {
  const { data: session } = useSession();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isTestingVerification, setIsTestingVerification] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  const handleSendDebugEmail = async () => {
    if (!session?.user?.email) {
      toast.error('No user email found in session');
      return;
    }

    setIsSendingEmail(true);
    setEmailResult(null);

    try {
      console.log('Sending debug email to:', session.user.email);
      
      const res = await fetch('/api/admin/debug-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          userName: session.user.name || 'Admin User'
        }),
      });

      const data = await res.json();
      console.log('Debug email response:', data);

      if (res.ok) {
        setEmailResult({
          success: true,
          message: 'Debug email sent successfully!',
          timestamp: new Date().toLocaleString()
        });
        toast.success('Debug email sent successfully!');
      } else {
        setEmailResult({
          success: false,
          message: data.error || 'Failed to send debug email',
          timestamp: new Date().toLocaleString()
        });
        toast.error(data.error || 'Failed to send debug email');
      }
    } catch (error) {
      console.error('Error sending debug email:', error);
      setEmailResult({
        success: false,
        message: 'Network error occurred',
        timestamp: new Date().toLocaleString()
      });
      toast.error('Network error occurred');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleTestVerificationEmail = async () => {
    if (!session?.user?.email) {
      toast.error('No user email found in session');
      return;
    }

    setIsTestingVerification(true);
    setVerificationResult(null);

    try {
      console.log('Testing verification email to:', session.user.email);
      
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email
        }),
      });

      const data = await res.json();
      console.log('Verification email response:', data);

      if (res.ok) {
        setVerificationResult({
          success: true,
          message: 'Verification email sent successfully!',
          timestamp: new Date().toLocaleString()
        });
        toast.success('Verification email sent successfully!');
      } else {
        setVerificationResult({
          success: false,
          message: data.error || 'Failed to send verification email',
          timestamp: new Date().toLocaleString()
        });
        toast.error(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setVerificationResult({
        success: false,
        message: 'Network error occurred',
        timestamp: new Date().toLocaleString()
      });
      toast.error('Network error occurred');
    } finally {
      setIsTestingVerification(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bug className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Debugging Tools</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            Email Testing
          </CardTitle>
          <CardDescription>
            Test email functionality by sending a debug email to the currently logged-in user.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Current User:</span>
            <Badge variant="outline">
              {session?.user?.email || 'No email found'}
            </Badge>
          </div>

          <Button
            onClick={handleSendDebugEmail}
            disabled={isSendingEmail || !session?.user?.email}
            className="flex items-center space-x-2"
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Send Debug Email</span>
              </>
            )}
          </Button>

          {emailResult && (
            <div className={`p-4 rounded-lg border ${
              emailResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {emailResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium">
                    {emailResult.success ? 'Success' : 'Error'}
                  </div>
                  <div className="text-sm">{emailResult.message}</div>
                  <div className="text-xs opacity-75">{emailResult.timestamp}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            Verification Email Test
          </CardTitle>
          <CardDescription>
            Test the verification email API route specifically to isolate the issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleTestVerificationEmail}
            disabled={isTestingVerification || !session?.user?.email}
            className="flex items-center space-x-2"
          >
            {isTestingVerification ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span>Test Verification Email</span>
              </>
            )}
          </Button>

          {verificationResult && (
            <div className={`p-4 rounded-lg border ${
              verificationResult.success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {verificationResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <div className="font-medium">
                    {verificationResult.success ? 'Success' : 'Error'}
                  </div>
                  <div className="text-sm">{verificationResult.message}</div>
                  <div className="text-xs opacity-75">{verificationResult.timestamp}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Check</CardTitle>
          <CardDescription>
            Check if required environment variables are configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">RESEND_API_KEY:</span>
              <Badge variant={process.env.RESEND_API_KEY ? "default" : "destructive"}>
                {process.env.RESEND_API_KEY ? 'Configured' : 'Missing'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">MONGODB_URI:</span>
              <Badge variant={process.env.MONGODB_URI ? "default" : "destructive"}>
                {process.env.MONGODB_URI ? 'Configured' : 'Missing'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 