const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  emailVerified: Date,
  image: String,
}, { timestamps: true });

async function setAdminRole() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Admin emails
    const adminEmails = ['volcanxic@gmail.com', 'ibadbbari@gmail.com'];

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
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
setAdminRole(); 