import { NextRequest, NextResponse } from 'next/server';
import { getUserModel } from '@/lib/database/models/User';
import { verify2FACode } from '@/lib/auth/twoFactor';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, code } = body;

    // Validation
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID and code are required' },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    // Find user and include 2FA fields
    const user = await User.findById(userId).select('+twoFactorCode +twoFactorExpiry');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify 2FA code
    if (!user.twoFactorCode || !user.twoFactorExpiry) {
      return NextResponse.json(
        { error: 'No 2FA code found. Please request a new one.' },
        { status: 400 }
      );
    }

    const isValidCode = verify2FACode(code, user.twoFactorCode, user.twoFactorExpiry);
    
    if (!isValidCode) {
      return NextResponse.json(
        { error: 'Invalid or expired 2FA code' },
        { status: 401 }
      );
    }

    // Clear 2FA code
    user.twoFactorCode = undefined;
    user.twoFactorExpiry = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
      plan: user.plan,
      accountName: user.accountName,
    });

    // Create response
    const response = NextResponse.json(
      {
        message: '2FA verification successful',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Allow in development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
