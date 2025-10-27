import { NextRequest, NextResponse } from 'next/server';
import { getUserModel } from '@/lib/database/models/User';
import { generateToken } from '@/lib/auth/jwt';
import { sendWelcomeEmail } from '@/lib/services/emailService';
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/auth/googleAuth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url));
    }

    // Exchange code for tokens
    const tokenData = await exchangeCodeForTokens(code);
    
    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/login?error=token_failed', request.url));
    }

    // Get user info from Google
    const googleUser = await getGoogleUserInfo(tokenData.access_token);
    
    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url));
    }

    const User = await getUserModel();

    // Check if user exists with this Google ID
    let user = await User.findOne({ googleId: googleUser.id });

    // If not found by Google ID, check by email
    if (!user) {
      user = await User.findOne({ email: googleUser.email.toLowerCase() });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = googleUser.id;
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
        googleId: googleUser.id,
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

    // Create redirect response
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
  }
}
