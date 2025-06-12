'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function TestNotificationsPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [notificationType, setNotificationType] = useState('WELCOME');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [emailTestResult, setEmailTestResult] = useState<any>(null);
  const [notificationTestResult, setNotificationTestResult] = useState<any>(null);
  
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);
  
  const runNotificationTest = async () => {
    setLoading(true);
    setNotificationTestResult(null);
    
    try {
      const response = await fetch(`/api/test-notification?email=${encodeURIComponent(email)}&type=${notificationType}`);
      const data = await response.json();
      setNotificationTestResult(data);
    } catch (error) {
      setNotificationTestResult({ error: 'Failed to run test' });
    } finally {
      setLoading(false);
    }
  };
  
  const runEmailConfigTest = async () => {
    setLoading(true);
    setEmailTestResult(null);
    
    try {
      const response = await fetch(`/api/test-email-config?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setEmailTestResult(data);
    } catch (error) {
      setEmailTestResult({ error: 'Failed to run test' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notification System Test Dashboard</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-2">Email Address:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
            placeholder="Enter email address"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Notification Type:</label>
          <select 
            value={notificationType} 
            onChange={(e) => setNotificationType(e.target.value)}
            className="border p-2 rounded w-full max-w-md"
          >
            <option value="WELCOME">Welcome</option>
            <option value="SYSTEM">System</option>
            <option value="PAYMENT">Payment</option>
            <option value="LISTING_UPDATE">Listing Update</option>
            <option value="FAVORITE">Favorite</option>
            <option value="MESSAGE">Message</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={runNotificationTest}
            disabled={loading || !email}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Running...' : 'Test Notification'}
          </button>
          
          <button 
            onClick={runEmailConfigTest}
            disabled={loading || !email}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Running...' : 'Test Email Config'}
          </button>
        </div>
      </div>
      
      {notificationTestResult && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Notification Test Results</h2>
          <div className={`p-4 rounded-lg ${notificationTestResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold mb-2">{notificationTestResult.message || 'Test completed'}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Environment:</h3>
              <pre className="bg-gray-800 text-white p-2 rounded overflow-auto text-sm">
                {JSON.stringify(notificationTestResult.environment, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Test Steps:</h3>
              <ul className="space-y-2">
                {notificationTestResult.steps?.map((step: any, index: number) => (
                  <li key={index} className={`p-2 rounded ${step.status === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
                    <p><strong>{step.step}:</strong> {step.status}</p>
                    {step.error && <p className="text-red-600">Error: {step.error}</p>}
                    {step.userId && <p>User ID: {step.userId}</p>}
                    {step.notificationId && <p>Notification ID: {step.notificationId}</p>}
                  </li>
                ))}
              </ul>
            </div>
            
            {notificationTestResult.error && (
              <div className="mt-4 p-2 bg-red-200 rounded">
                <p className="font-semibold">Error: {notificationTestResult.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {emailTestResult && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Email Configuration Test Results</h2>
          <div className={`p-4 rounded-lg ${emailTestResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-bold mb-2">{emailTestResult.message || 'Test completed'}</p>
            
            {emailTestResult.recommendation && (
              <div className="mt-2 p-2 bg-yellow-100 rounded">
                <p><strong>Recommendation:</strong> {emailTestResult.recommendation}</p>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Configuration:</h3>
              <pre className="bg-gray-800 text-white p-2 rounded overflow-auto text-sm">
                {JSON.stringify(emailTestResult.config, null, 2)}
              </pre>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Environment:</h3>
              <pre className="bg-gray-800 text-white p-2 rounded overflow-auto text-sm">
                {JSON.stringify(emailTestResult.environment, null, 2)}
              </pre>
            </div>
            
            {emailTestResult.sendGridResponse && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">SendGrid Response:</h3>
                <pre className="bg-gray-800 text-white p-2 rounded overflow-auto text-sm">
                  {JSON.stringify(emailTestResult.sendGridResponse, null, 2)}
                </pre>
              </div>
            )}
            
            {emailTestResult.sendGridError && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">SendGrid Error:</h3>
                <pre className="bg-gray-800 text-white p-2 rounded overflow-auto text-sm">
                  {JSON.stringify(emailTestResult.sendGridError, null, 2)}
                </pre>
              </div>
            )}
            
            {emailTestResult.error && (
              <div className="mt-4 p-2 bg-red-200 rounded">
                <p className="font-semibold">Error: {emailTestResult.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 