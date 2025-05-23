import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import formidable from 'formidable';
import { promises as fs } from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user from session
    const userEmail = session.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: 'User email not found in session' });
    }

    // Connect to database
    await connectDB();

    // Get user with membership information
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has an active membership
    const hasMembership = !!user.membership;
    const isActive = user.membership?.status === 'active';

    if (!hasMembership || !isActive) {
      return res.status(403).json({ error: 'Active membership required to upload images' });
    }

    // Parse the incoming form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Validate file type
    if (!file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    // Read the file
    const fileBuffer = await fs.readFile(file.filepath);

    // Convert buffer to base64 string for Cloudinary upload
    const base64 = fileBuffer.toString('base64');
    const fileStr = `data:${file.mimetype};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileStr, {
        folder: 'listings',
        resource_type: 'image',
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // Clean up the temporary file
    await fs.unlink(file.filepath);

    return res.status(200).json({
      secure_url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to upload image'
    });
  }
} 