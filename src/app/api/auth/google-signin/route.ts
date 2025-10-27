import { NextRequest, NextResponse } from 'next/server';
import { getUserModel } from '@/lib/database/models/User';
import { generateToken } from '@/lib/auth/jwt';
import { sendWelcomeEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { error: 'Google credential is required' },
        { status: 400 }
      );
    }

    // Decode the JWT credential from Google
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const googleUser = JSON.parse(jsonPayload);

    if (!googleUser.email || !googleUser.email_verified) {
      return NextResponse.json(
        { error: 'Email not verified with Google' },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: googleUser.sub });

    // If not found by Google ID, check by email
    if (!user) {
      user = await User.findOne({ email: googleUser.email.toLowerCase() });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleUser.sub;
        user.emailVerified = true;
        await user.save();
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      const isOwner = googleUser.email.toLowerCase() === process.env.OWNER_EMAIL?.toLowerCase();
      
      user = await User.create({
        email: googleUser.email.toLowerCase(),
        name: googleUser.name || googleUser.email.split('@')[0],
        googleId: googleUser.sub,
        role: isOwner ? 'owner' : 'user',
        plan: 'free',
        emailVerified: true,
        twoFactorEnabled: isOwner,
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(user.email, user.name).catch(err => 
        console.error('Failed to send welcome email:', err)
      );
    }

    // Update last login
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
        success: true,
        message: 'Login successful',
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
          plan: user.plan,
          accountName: user.accountName,
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
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process Google sign-in',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
