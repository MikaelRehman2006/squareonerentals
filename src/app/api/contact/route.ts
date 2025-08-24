import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/utils/sendgrid';
import { contactFormRateLimit } from '@/lib/rateLimiter';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await contactFormRateLimit(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  try {
    // Log that we received a contact form request
    console.log('Contact form submission received');
    
    // Parse the request body
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body));
    
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Store contact submission in database
    const contactSubmission = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress,
      userAgent,
      status: 'NEW'
    });

    console.log('Contact submission stored in database:', contactSubmission._id);

    // Use SendGrid for reliable email delivery
    const result = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    if (!result.success) {
      console.error('Failed to send email but contact was stored:', result.error);
      // Still return success since the contact was stored
      return NextResponse.json({ 
        success: true, 
        message: 'Contact form submitted successfully. We will get back to you soon.',
        warning: 'Email delivery failed but your message was received.'
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully. We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Error processing contact form:');
    console.error(error);
    
    // Get detailed error information
    let errorMessage = 'Failed to submit contact form';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
