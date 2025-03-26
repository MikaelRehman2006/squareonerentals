import { NextRequest, NextResponse } from 'next/server';
import { connectDB, disconnectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import { Listing } from '@/models/Listing';

/**
 * Debug endpoint for troubleshooting MongoDB connection issues
 */
export async function GET(request: NextRequest) {
  try {
    console.log('DEBUG API: Starting connection test');
    const startTime = Date.now();
    
    // Create a mock listing to test database connection
    const mockListing = {
      title: 'Test Listing',
      description: 'This is a test listing to diagnose MongoDB connection issues',
      price: 1500,
      location: 'Mississauga',
      images: [],
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 800,
      propertyType: 'apartment',
      listingType: 'rent',
      leaseType: 'fixed',
      availableDate: new Date(),
      status: 'ACTIVE',
      featured: false,
    };
    
    // 1. Check MongoDB Connection String
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('DEBUG API: MONGODB_URI not found in environment variables');
      return NextResponse.json({
        status: 'error',
        message: 'MongoDB URI not configured',
        step: 'connection_string_check'
      }, { status: 500 });
    }

    console.log('DEBUG API: MongoDB URI is configured');
    
    // 2. Try to connect to MongoDB
    try {
      await connectDB();
      const connectionState = mongoose.connection.readyState;
      console.log(`DEBUG API: Connection state: ${connectionState}`);
      
      if (connectionState !== 1) {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to connect to MongoDB',
          connectionState,
          step: 'connection_attempt'
        }, { status: 500 });
      }
      
      console.log('DEBUG API: Successfully connected to MongoDB');
    } catch (connectionError) {
      console.error('DEBUG API: Connection error:', connectionError);
      return NextResponse.json({
        status: 'error',
        message: 'Error connecting to MongoDB',
        error: connectionError instanceof Error ? connectionError.message : String(connectionError),
        step: 'connection_attempt'
      }, { status: 500 });
    }
    
    // 3. Check if Listing model is available
    if (!Listing || typeof Listing.find !== 'function') {
      console.error('DEBUG API: Listing model not properly loaded');
      return NextResponse.json({
        status: 'error',
        message: 'Listing model not available',
        step: 'model_check'
      }, { status: 500 });
    }
    
    console.log('DEBUG API: Listing model is available');
    
    // 4. Try to query the database
    try {
      const count = await Listing.countDocuments();
      console.log(`DEBUG API: Found ${count} documents in Listing collection`);
      
      // Return mock listings for testing
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        databaseStats: {
          listingCount: count,
          connectionState: mongoose.connection.readyState,
          responseTime: Date.now() - startTime
        },
        mockListings: [{
          ...mockListing,
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'test-user-id',
        }]
      });
    } catch (queryError) {
      console.error('DEBUG API: Query error:', queryError);
      return NextResponse.json({
        status: 'error',
        message: 'Error querying database',
        error: queryError instanceof Error ? queryError.message : String(queryError),
        step: 'query_attempt'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('DEBUG API: Uncaught error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : String(error),
      step: 'unknown'
    }, { status: 500 });
  }
}
