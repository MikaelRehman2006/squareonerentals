import { NextResponse } from 'next/server';
import { sendEmail, createContactFormEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

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

    const emailTemplate = createContactFormEmail(name, email, subject, message);
    
    await sendEmail(
      process.env.CONTACT_EMAIL || 'squareone.rental@gmail.com',
      emailTemplate
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send contact form' },
      { status: 500 }
    );
  }
}
