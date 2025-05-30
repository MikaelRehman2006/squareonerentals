import mongoose from 'mongoose';

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API route usage.
declare global {
  var mongoose: typeof import('mongoose');
}

// Cached connection
let cachedConnection: typeof mongoose | null = null;

// Get MongoDB URI from environment variables, support both .env and .env.local
let MONGODB_URI = process.env.MONGODB_URI;

// Debug environment variables - safely log environment
console.log('Environment check: NODE_ENV =', process.env.NODE_ENV);
console.log('Available environment variables:', Object.keys(process.env).filter(key => !key.includes('SECRET')).join(', '));

// If not found in environment variables, check if we're in development mode
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment. Using fallback connection.');
  
  // Fall back to hardcoded URL for production as a last resort
  MONGODB_URI = 'mongodb+srv://Mikael:He1enhunt@cluster0.lfya6.mongodb.net/squareonerentals?retryWrites=true&w=majority';
}

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 75000,
  family: 4, // Use IPv4, skip trying IPv6
  keepAlive: true,
  keepAliveInitialDelay: 300000, // 5 minutes
  retryWrites: true,
};

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
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    // Safe logging of URI without password
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    const conn = await mongoose.connect(MONGODB_URI, options);
    
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
