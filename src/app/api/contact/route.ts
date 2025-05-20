import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/utils/sendgrid';

export async function POST(request: Request) {
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

    // Use SendGrid for reliable email delivery
    const result = await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact form:');
    console.error(error);
    
    // Get detailed error information
    let errorMessage = 'Failed to send contact form';
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
