import { NextRequest, NextResponse } from 'next/server';
import { destinationDb } from '@/lib/db';
import { generalRateLimiter } from '@/lib/middleware/rateLimiter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = generalRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await params;
    const destinationId = parseInt(id);

    if (isNaN(destinationId)) {
      return NextResponse.json(
        { error: 'Invalid destination ID' },
        { status: 400 }
      );
    }

    const destination = await destinationDb.getById(destinationId);

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields for response
    const formattedDestination = {
      ...destination,
      images: destination.images ? destination.images.split(',').map((img: string) => img.trim()) : []
    };

    return NextResponse.json({ destination: formattedDestination }, { status: 200 });
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
