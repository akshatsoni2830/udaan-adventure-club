import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (sessionCookie) {
      deleteSession(sessionCookie.value);
    }
    
    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    }, { status: 200 });

    response.cookies.delete('admin_session');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
