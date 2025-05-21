'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [debugResult, setDebugResult] = useState<any>(null);
  const [regularResult, setRegularResult] = useState<any>(null);
  const [loading, setLoading] = useState({
    debug: false,
    regular: false
  });
  const [error, setError] = useState({
    debug: null as string | null,
    regular: null as string | null
  });

  async function testDebugApi() {
    try {
      setLoading(prev => ({ ...prev, debug: true }));
      setError(prev => ({ ...prev, debug: null }));
      
      const response = await fetch('/api/listings/debug');
      const data = await response.json();
      
      setDebugResult(data);
    } catch (err) {
      setError(prev => ({ ...prev, debug: String(err) }));
    } finally {
      setLoading(prev => ({ ...prev, debug: false }));
    }
  }

  async function testRegularApi() {
    try {
      setLoading(prev => ({ ...prev, regular: true }));
      setError(prev => ({ ...prev, regular: null }));
      
      const response = await fetch('/api/listings');
      const data = await response.json();
      
      setRegularResult(data);
    } catch (err) {
      setError(prev => ({ ...prev, regular: String(err) }));
    } finally {
      setLoading(prev => ({ ...prev, regular: false }));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black">API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Debug API Test</h2>
          <button 
            onClick={testDebugApi}
            disabled={loading.debug}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            {loading.debug ? 'Testing...' : 'Test Debug API'}
          </button>
          
          {error.debug && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p><strong>Error:</strong> {error.debug}</p>
            </div>
          )}
          
          {debugResult && (
            <div className="mt-4">
              <h3 className="font-bold text-black">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(debugResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-black">Regular API Test</h2>
          <button 
            onClick={testRegularApi}
            disabled={loading.regular}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            {loading.regular ? 'Testing...' : 'Test Regular API'}
          </button>
          
          {error.regular && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p><strong>Error:</strong> {error.regular}</p>
            </div>
          )}
          
          {regularResult && (
            <div className="mt-4">
              <h3 className="font-bold text-black">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(regularResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 border p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Form Submission Test</h2>
        <p className="mb-4 text-black">Test the form submission to see if the edit functionality works.</p>
        <button 
          onClick={() => {
            const testData = {
              title: 'Test Listing',
              description: 'This is a test description',
              price: 1500,
              location: 'Mississauga',
              images: [],
              bedrooms: 2,
              bathrooms: 1,
              squareFeet: 800,
              amenities: [],
              buildingAmenities: [],
              features: [],
              utilities: [],
              propertyType: 'apartment',
              listingType: 'rent',
              leaseType: 'fixed',
              availableDate: new Date().toISOString().split('T')[0],
              status: 'ACTIVE',
              featured: false
            };
            
            // Log the data to console
            console.log('Test form data:', testData);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Log Test Form Data
        </button>
      </div>
    </div>
  );
}
