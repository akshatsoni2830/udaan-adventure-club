import { NextRequest, NextResponse } from 'next/server';
import { packageDb } from '@/lib/db';
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
    
    // Create package
    const newPackage = await packageDb.create({
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

    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
