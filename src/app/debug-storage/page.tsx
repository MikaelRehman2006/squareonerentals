'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DebugStoragePage() {
  const { data: session } = useSession();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanupResult, setCleanupResult] = useState<any>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug-storage');
      if (response.ok) {
        const data = await response.json();
        setDebugData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch debug data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const cleanupOrphanedRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug-storage', {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setCleanupResult(data);
        // Refresh debug data after cleanup
        await fetchDebugData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to cleanup orphaned records');
      }
    } catch (err) {
      setError('Network error during cleanup');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDebugData();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Debug Storage</h1>
          <p>Please sign in to view storage debug information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug Storage</h1>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={fetchDebugData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Debug Data'}
          </button>
          
          <button
            onClick={cleanupOrphanedRecords}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cleaning...' : 'Cleanup Orphaned Records'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded">
            <p className="text-red-300">Error: {error}</p>
          </div>
        )}

        {cleanupResult && (
          <div className="mb-4 p-4 bg-green-900/20 border border-green-800 rounded">
            <p className="text-green-300">Cleanup Result:</p>
            <pre className="text-sm mt-2">{JSON.stringify(cleanupResult, null, 2)}</pre>
          </div>
        )}

        {debugData && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">User Info</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugData.user, null, 2)}
              </pre>
            </div>

            {/* Storage Info */}
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Storage Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-green-400">Actual Storage (from metadata)</h3>
                  <p>Bytes: {debugData.storage.actual.bytes}</p>
                  <p>MB: {debugData.storage.actual.mb}</p>
                  <p>Count: {debugData.storage.actual.count}</p>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-400">Estimated Storage (from listings)</h3>
                  <p>Bytes: {debugData.storage.estimated.bytes}</p>
                  <p>MB: {debugData.storage.estimated.mb}</p>
                  <p>Count: {debugData.storage.estimated.count}</p>
                </div>
              </div>
            </div>

            {/* Metadata Records */}
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">Image Metadata Records ({debugData.metadata.length})</h2>
              {debugData.metadata.length > 0 ? (
                <div className="space-y-2">
                  {debugData.metadata.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-700 p-3 rounded">
                      <p><strong>URL:</strong> {item.url}</p>
                      <p><strong>Size:</strong> {item.size} bytes ({(item.size / (1024 * 1024)).toFixed(2)} MB)</p>
                      <p><strong>Listing ID:</strong> {item.listingId || 'None'}</p>
                      <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No metadata records found</p>
              )}
            </div>

            {/* Listings */}
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2">User Listings ({debugData.listings.length})</h2>
              {debugData.listings.length > 0 ? (
                <div className="space-y-2">
                  {debugData.listings.map((listing: any, index: number) => (
                    <div key={index} className="bg-gray-700 p-3 rounded">
                      <p><strong>ID:</strong> {listing.id}</p>
                      <p><strong>Title:</strong> {listing.title}</p>
                      <p><strong>Images:</strong> {Array.isArray(listing.images) ? listing.images.length : (typeof listing.images === 'string' ? listing.images.split(',').length : 0)}</p>
                      <p><strong>Images Data:</strong> {JSON.stringify(listing.images)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No listings found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
