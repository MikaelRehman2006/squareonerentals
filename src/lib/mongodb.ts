import mongoose from 'mongoose';

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API route usage.
declare global {
  var mongoose: typeof import('mongoose');
}

// Get MongoDB URI from environment variables, support both .env and .env.local
let MONGODB_URI = process.env.MONGODB_URI;

// Debug environment variables - safely log environment
console.log('Environment check: NODE_ENV =', process.env.NODE_ENV);
console.log('Available environment variables:', Object.keys(process.env).filter(key => !key.includes('SECRET')).join(', '));

// If not found in environment variables, check if we're in development mode
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment. Checking for alternatives...');
  
  // Fall back to hardcoded URL for production as a last resort
  MONGODB_URI = 'mongodb+srv://Mikael:He1enhunt@cluster0.lfya6.mongodb.net/squareonerentals?retryWrites=true&w=majority';
  console.log('Using fallback MongoDB connection');
}

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, // Increased from 5000 to 30000
  socketTimeoutMS: 75000, // Increased from 45000 to 75000
  family: 4, // Use IPv4, skip trying IPv6
  keepAlive: true,
  keepAliveInitialDelay: 300000, // 5 minutes
  retryWrites: true,
};

// Create the default connection
export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('Using existing MongoDB connection');
      return mongoose;
    }

    console.log('Connecting to MongoDB...');
    // Check if MONGODB_URI is defined before using it
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password in logs

    const conn = await mongoose.connect(MONGODB_URI, options);
    
    console.log('MongoDB connection successful');
    
    // Add error handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    return conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('MongoDB already disconnected');
      return;
    }
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

// Add default export for backward compatibility with files that import as default
const mongodb = { connectDB, disconnectDB };
export default mongodb;
