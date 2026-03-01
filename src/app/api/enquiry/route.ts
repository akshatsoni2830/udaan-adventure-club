import { NextRequest, NextResponse } from 'next/server';
import { enquiryDb } from '@/lib/db';
import { EnquirySchema, validateData } from '@/lib/validations';
import { enquiryRateLimiter } from '@/lib/middleware/rateLimiter';
import { sanitizeObject } from '@/lib/middleware/sanitize';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting (20 requests per minute for enquiries)
    const rateLimitResponse = enquiryRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    
    // Sanitize input
    const sanitizedBody = sanitizeObject(body);
    
    // Validate input
    const validation = validateData(EnquirySchema, sanitizedBody);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { name, email, phone, message } = validation.data;

    // Check for duplicate enquiries within 5 minutes
    const isDuplicate = await enquiryDb.checkDuplicate(email, 5);
    if (isDuplicate) {
      return NextResponse.json(
        { error: 'You have already submitted an enquiry recently. Please wait before submitting again.' },
        { status: 429 }
      );
    }

    // Store enquiry in database
    const enquiry = await enquiryDb.create({
      name,
      email,
      phone,
      message
    });

    console.log('New enquiry received:', { id: enquiry.id, name, email });

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
