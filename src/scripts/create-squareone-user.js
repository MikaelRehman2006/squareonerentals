// Script to create the squareone.rental@gmail.com user account
const { connectDB } = require('../lib/mongodb');
const mongoose = require('mongoose');

// Create a model specifically for this script
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  password: String,
  emailVerified: Date,
  image: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
}, { timestamps: true });

// Use a function to run the script
async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');

    // Use the model only after connection is established
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'squareone.rental@gmail.com' });
    
    if (existingUser) {
      console.log('✅ User squareone.rental@gmail.com already exists');
      console.log('User details:', {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      });
      return;
    }

    // Create the user
    console.log('📝 Creating squareone.rental@gmail.com user...');
    
    const newUser = await User.create({
      name: 'Square One Rentals',
      email: 'squareone.rental@gmail.com',
      role: 'ADMIN',
      password: 'temp-password', // We'll update this later
      emailVerified: new Date(), // Mark as verified
    });

    console.log('✅ User created successfully:', {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    console.log('🎉 squareone.rental@gmail.com user is now ready to receive emails!');

  } catch (error) {
    console.error('Error creating user:', error);
    console.error('Error details:', error.message);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
main();
