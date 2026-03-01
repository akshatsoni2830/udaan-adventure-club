import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    
    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = { count: 1, resetTime: now + windowMs };
      return null; // Allow request
    }
    
    if (store[ip].count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((store[ip].resetTime - now) / 1000) },
        { status: 429 }
      );
    }
    
    store[ip].count++;
    return null; // Allow request
  };
}

// Predefined rate limiters
export const generalRateLimiter = rateLimiter(100, 60 * 1000); // 100 requests per minute
export const enquiryRateLimiter = rateLimiter(20, 60 * 1000); // 20 requests per minute
export const adminRateLimiter = rateLimiter(50, 60 * 1000); // 50 requests per minute
