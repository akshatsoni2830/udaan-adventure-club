import { NextRequest, NextResponse } from 'next/server';
import { enquiryDb } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = requireAuth(request);
    if (authResponse) return authResponse;

    const enquiries = await enquiryDb.getAll();

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
