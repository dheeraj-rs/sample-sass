import { NextRequest, NextResponse } from 'next/server';
import { getUserModel } from '@/lib/database/models/User';
import { generateToken } from '@/lib/auth/jwt';
import { sendWelcomeEmail } from '@/lib/services/emailService';

/**
 * Handle Google OAuth callback
 * In production, you'd use a proper OAuth flow with Google's OAuth library
 * This is a simplified version for demonstration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleId, email, name } = body;

    // Validation
    if (!googleId || !email || !name) {
      return NextResponse.json(
        { error: 'Google ID, email, and name are required' },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    // If not found by Google ID, check by email
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleId;
        user.emailVerified = true;
        await user.save();
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      const isOwner = email.toLowerCase() === process.env.OWNER_EMAIL?.toLowerCase();
      
      user = await User.create({
        email: email.toLowerCase(),
        name,
        googleId,
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
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      plan: user.plan,
      accountName: user.accountName,
    });

    // Create response
    const response = NextResponse.json(
      {
        message: 'Google login successful',
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
