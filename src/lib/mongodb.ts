import mongoose from 'mongoose';

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API route usage.
declare global {
  var mongoose: typeof import('mongoose');
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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
