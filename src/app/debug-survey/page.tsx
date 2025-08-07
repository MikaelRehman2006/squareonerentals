'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function DebugSurveyPage() {
  const { data: session } = useSession();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-session');
      const data = await response.json();
      setDebugData(prev => ({ ...prev, session: data }));
    } catch (error) {
      console.error('Session test error:', error);
    }
    setLoading(false);
  };

  const testPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/preferences');
      const data = await response.json();
      setDebugData(prev => ({ ...prev, preferences: data }));
    } catch (error) {
      console.error('Preferences test error:', error);
    }
    setLoading(false);
  };

  const testDebugPreferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-user-preferences');
      const data = await response.json();
      setDebugData(prev => ({ ...prev, debugPreferences: data }));
    } catch (error) {
      console.error('Debug preferences test error:', error);
    }
    setLoading(false);
  };

  const testSurveySubmission = async () => {
    setLoading(true);
    try {
      const testData = {
        userTypes: ['renter'],
        preferences: {
          renter: {
            city: 'Toronto',
            bedrooms: '2',
            bathrooms: '1',
            priceRange: { min: '1000', max: '3000' },
            propertyType: 'Apartment',
            moveInDate: '2024-12-01',
            additionalRequirements: 'Pet friendly',
            isForSelf: true,
            isPreApproved: false
          }
        },
        onboardingCompleted: true
      };

      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setDebugData(prev => ({ ...prev, submission: { status: response.status, data } }));
    } catch (error) {
      console.error('Survey submission test error:', error);
    }
    setLoading(false);
  };

  const testDebugSubmission = async () => {
    setLoading(true);
    try {
      const testData = {
        userTypes: ['renter'],
        preferences: {
          renter: {
            city: 'Toronto',
            bedrooms: '2',
            bathrooms: '1',
            priceRange: { min: '1000', max: '3000' },
            propertyType: 'Apartment',
            moveInDate: '2024-12-01',
            additionalRequirements: 'Pet friendly',
            isForSelf: true,
            isPreApproved: false
          }
        },
        onboardingCompleted: true
      };

      const response = await fetch('/api/debug-user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      setDebugData(prev => ({ ...prev, debugSubmission: { status: response.status, data } }));
    } catch (error) {
      console.error('Debug submission test error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Survey Debug Page</h1>
      
      <div className="space-y-4 mb-8">
        <Button onClick={testSession} disabled={loading}>
          Test Session
        </Button>
        <Button onClick={testPreferences} disabled={loading}>
          Test Preferences
        </Button>
        <Button onClick={testDebugPreferences} disabled={loading}>
          Test Debug Preferences
        </Button>
        <Button onClick={testSurveySubmission} disabled={loading}>
          Test Survey Submission
        </Button>
        <Button onClick={testDebugSubmission} disabled={loading}>
          Test Debug Submission
        </Button>
      </div>

      {debugData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Debug Data:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Session Info:</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
