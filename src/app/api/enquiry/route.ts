import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For now, we'll just return success since the actual WhatsApp integration
    // is handled on the client side in ContactForm.tsx
    // In a real implementation, you might want to:
    // 1. Send an email notification
    // 2. Store the enquiry in a database
    // 3. Send a WhatsApp message via API

    console.log('New enquiry received:', { name, email, phone, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
