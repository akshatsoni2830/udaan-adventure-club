import { NextRequest, NextResponse } from 'next/server';
import { packageDb } from '@/lib/db';
import { generalRateLimiter } from '@/lib/middleware/rateLimiter';
import { Package } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = generalRateLimiter(request);
    if (rateLimitResponse) return rateLimitResponse;

    const packages = await packageDb.getAll();
    
    // Parse JSON fields for response
    const formattedPackages = packages.map((pkg: Package) => ({
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
    }));

    return NextResponse.json({ packages: formattedPackages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
