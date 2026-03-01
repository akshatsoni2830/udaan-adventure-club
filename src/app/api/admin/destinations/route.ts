import { NextRequest, NextResponse } from 'next/server';
import { destinationDb } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';
import { adminRateLimiter } from '@/lib/middleware/rateLimiter';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = adminRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Check authentication
    const authResponse = requireAuth(request);
    if (authResponse) return authResponse;

    const body = await request.json();
    
    // Create destination
    const newDestination = await destinationDb.create({
      title: body.title,
      description: body.description,
      images: Array.isArray(body.images) ? body.images.join(', ') : body.images
    });

    return NextResponse.json({ destination: newDestination }, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
