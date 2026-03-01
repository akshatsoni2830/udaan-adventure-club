import { NextRequest, NextResponse } from 'next/server';
import { destinationDb } from '@/lib/db';
import { requireAuth } from '@/lib/middleware/auth';
import { adminRateLimiter } from '@/lib/middleware/rateLimiter';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = adminRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Check authentication
    const authResponse = requireAuth(request);
    if (authResponse) return authResponse;

    const { id } = await params;
    const destinationId = parseInt(id);

    if (isNaN(destinationId)) {
      return NextResponse.json(
        { error: 'Invalid destination ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Update destination
    const updatedDestination = await destinationDb.update(destinationId, {
      title: body.title,
      description: body.description,
      images: Array.isArray(body.images) ? body.images.join(', ') : body.images
    });

    return NextResponse.json({ destination: updatedDestination }, { status: 200 });
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResponse = adminRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Check authentication
    const authResponse = requireAuth(request);
    if (authResponse) return authResponse;

    const { id } = await params;
    const destinationId = parseInt(id);

    if (isNaN(destinationId)) {
      return NextResponse.json(
        { error: 'Invalid destination ID' },
        { status: 400 }
      );
    }

    await destinationDb.delete(destinationId);

    return NextResponse.json({ message: 'Destination deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
