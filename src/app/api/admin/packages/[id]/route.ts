import { NextRequest, NextResponse } from 'next/server';
import { packageDb } from '@/lib/db';
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
    const packageId = parseInt(id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Update package
    const updatedPackage = await packageDb.update(packageId, {
      title: body.title,
      duration: body.duration,
      departureCities: Array.isArray(body.departureCities) ? body.departureCities.join(', ') : body.departureCities,
      fixedDepartures: Array.isArray(body.fixedDepartures) ? body.fixedDepartures.join(', ') : body.fixedDepartures,
      costDetails: Array.isArray(body.costDetails) 
        ? body.costDetails.map((c: { description: string; price: string }) => `${c.description}: ${c.price}`).join('; ')
        : body.costDetails,
      inclusions: Array.isArray(body.inclusions) ? body.inclusions.join('; ') : body.inclusions,
      notes: Array.isArray(body.notes) ? body.notes.join('; ') : body.notes,
      itemsToCarry: Array.isArray(body.itemsToCarry) ? body.itemsToCarry.join('; ') : body.itemsToCarry,
      paymentTerms: Array.isArray(body.paymentTerms) ? body.paymentTerms.join('; ') : body.paymentTerms,
      cancellationTerms: Array.isArray(body.cancellationTerms) ? body.cancellationTerms.join('; ') : body.cancellationTerms,
      images: Array.isArray(body.images) ? body.images.join(', ') : body.images
    });

    return NextResponse.json({ package: updatedPackage }, { status: 200 });
  } catch (error) {
    console.error('Error updating package:', error);
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
    const packageId = parseInt(id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    await packageDb.delete(packageId);

    return NextResponse.json({ message: 'Package deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
