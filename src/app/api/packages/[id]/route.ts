import { NextRequest, NextResponse } from 'next/server';
import { packageDb } from '@/lib/db';
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
    const packageId = parseInt(id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    const pkg = await packageDb.getById(packageId);

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Parse JSON fields for response
    const formattedPackage = {
      ...pkg,
      departureCities: pkg.departureCities ? pkg.departureCities.split(', ') : [],
      fixedDepartures: pkg.fixedDepartures ? pkg.fixedDepartures.split(', ') : [],
      costDetails: pkg.costDetails ? pkg.costDetails.split('; ').map((cost: string) => {
        const [description, price] = cost.split(': ');
        return { description: description || '', price: price || '' };
      }) : [],
      inclusions: pkg.inclusions ? pkg.inclusions.split('; ') : [],
      notes: pkg.notes ? pkg.notes.split('; ') : [],
      itemsToCarry: pkg.itemsToCarry ? pkg.itemsToCarry.split('; ') : [],
      paymentTerms: pkg.paymentTerms ? pkg.paymentTerms.split('; ') : [],
      cancellationTerms: pkg.cancellationTerms ? pkg.cancellationTerms.split('; ') : [],
      images: pkg.images ? pkg.images.split(',').map((img: string) => img.trim()) : []
    };

    return NextResponse.json({ package: formattedPackage }, { status: 200 });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
