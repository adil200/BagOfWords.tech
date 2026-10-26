import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Verifies the author password for elevated privileges such as verified comment badges.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const authorPassword = process.env.AUTHOR_PASSWORD;

    if (!authorPassword) {
      return NextResponse.json(
        { success: false, message: 'Author authentication not configured' },
        { status: 500 }
      );
    }

    if (password === authorPassword) {
      return NextResponse.json({
        success: true,
        message: 'Author verified successfully',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Verify author password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
