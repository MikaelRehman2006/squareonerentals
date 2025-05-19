const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://Mikael:He1enhunt@cluster0.lfya6.mongodb.net/squareonerentals?retryWrites=true&w=majority";

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB!');
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
