import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { username, password } = await request.json();

  // Mock authentication
  if (username === 'admin' && password === 'nyaygrid2026') {
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Set a mock session cookie
    response.cookies.set('admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  return NextResponse.json(
    { message: 'Invalid credentials' },
    { status: 401 }
  );
}
