// Script to set admin role for specific users
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

    // Admin emails
    const adminEmails = ['volcanxic@gmail.com', 'mikaelr112@gmail.com'];

    // Update each admin user
    for (const email of adminEmails) {
      console.log(`Setting admin role for ${email}...`);
      
      // Find the user by email
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        console.log(`User with email ${email} not found`);
        continue;
      }

      // Update role to ADMIN
      user.role = 'ADMIN';
      await user.save();
      console.log(`Successfully set admin role for ${email}`);
    }

    console.log('Admin role update completed');
  } catch (error) {
    console.error('Error setting admin roles:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
main();
