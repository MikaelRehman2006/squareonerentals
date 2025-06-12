import mongoose from 'mongoose';
import { DB_CONFIG, logEnvStatus } from './envConfig';

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API route usage.
declare global {
  var mongoose: typeof import('mongoose');
}

// Cached connection
let cachedConnection: typeof mongoose | null = null;

// Debug environment variables - safely log environment
logEnvStatus();

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 75000,
  family: 4, // Use IPv4, skip trying IPv6
  keepAlive: true,
  keepAliveInitialDelay: 300000, // 5 minutes
  retryWrites: true,
};

// Get MongoDB URI from environment variables, support both .env and .env.local
let MONGODB_URI = process.env.MONGODB_URI;

// If not found in environment variables, check if we're in development mode
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment. Using fallback connection.');
  
  // Use a development fallback that doesn't expose credentials
  if (process.env.NODE_ENV === 'development') {
    MONGODB_URI = 'mongodb://localhost:27017/squareonerentals_dev';
  } else {
    // For production, always require proper environment configuration
    console.error('No MongoDB connection string available. Database operations will fail.');
  }
}

// Create the default connection
export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    // Return cached connection if available
    if (cachedConnection) {
      return cachedConnection;
    }
    
    // Use existing connection if already connected
    if (mongoose.connection.readyState >= 1) {
      cachedConnection = mongoose;
      return mongoose;
    }

    // Check if MONGODB_URI is defined before using it
    if (!DB_CONFIG.isConfigured) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Safe logging of URI without password
    const safeUri = DB_CONFIG.uri.replace(/:[^:@]+@/, ':****@');
    console.log('MongoDB URI:', safeUri);

    const conn = await mongoose.connect(DB_CONFIG.uri, options);
    
    console.log('MongoDB connection successful');
    
    // Add error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null; // Clear cache on error
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
      cachedConnection = null; // Clear cache on disconnect
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      cachedConnection = mongoose; // Restore cache on reconnect
    });

    // Cache the connection
    cachedConnection = conn;
    return conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // Don't throw the error, return null instead to prevent app crashes
    return null as any;
  }
};

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      return;
    }
    
    await mongoose.disconnect();
    cachedConnection = null;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

// Add default export for backward compatibility with files that import as default
const mongodb = { connectDB, disconnectDB };
export default mongodb;
