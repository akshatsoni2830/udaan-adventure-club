import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/db';
import { AdminLoginSchema, validateData } from '@/lib/validations';
import { createSession } from '@/lib/middleware/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(AdminLoginSchema, body);
    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { username, password } = validation.data;

    // Get admin user from database
    const admin = await adminDb.getByUsername(username);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const sessionToken = createSession(username);
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    }, { status: 200 });

    // Set cookie on response
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
