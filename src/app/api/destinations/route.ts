import { NextRequest, NextResponse } from 'next/server';
import { destinationDb } from '@/lib/db';
import { generalRateLimiter } from '@/lib/middleware/rateLimiter';
import { Destination } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = generalRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    const destinations = await destinationDb.getAll();
    
    // Parse JSON fields for response
    const formattedDestinations = destinations.map((dest: Destination) => ({
      ...dest,
      images: dest.images ? dest.images.split(',').map((img: string) => img.trim()) : []
    }));

    return NextResponse.json({ destinations: formattedDestinations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
