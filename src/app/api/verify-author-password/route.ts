import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Get author password from environment variable
    const authorPassword = process.env.AUTHOR_PASSWORD;

    if (!authorPassword) {
      return NextResponse.json(
        { success: false, message: 'Author authentication not configured' },
        { status: 500 }
      );
    }

    // Check if password matches
    const isValid = password === authorPassword;

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Author verified successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Verify author password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
