import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

testConnection();
