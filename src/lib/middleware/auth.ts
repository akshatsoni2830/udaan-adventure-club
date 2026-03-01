import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple session store (in production, use Redis or database)
const sessions = new Map<string, { username: string; expiresAt: number }>();

// Clean up expired sessions every hour
setInterval(() => {
  const now = Date.now();
  sessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  });
}, 60 * 60 * 1000);

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createSession(username: string): string {
  const token = generateSessionToken();
  sessions.set(token, {
    username,
    expiresAt: Date.now() + SESSION_DURATION
  });
  return token;
}

export function verifySession(token: string): { valid: boolean; username?: string } {
  const session = sessions.get(token);
  
  if (!session) {
    return { valid: false };
  }
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return { valid: false };
  }
  
  return { valid: true, username: session.username };
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  
  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { valid } = verifySession(sessionCookie.value);
  
  if (!valid) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null; // Allow request
}

export function getSessionUsername(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  
  if (!sessionCookie) {
    return null;
  }
  
  const { valid, username } = verifySession(sessionCookie.value);
  
  return valid && username ? username : null;
}
