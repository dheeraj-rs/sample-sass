import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getUserModel } from '@/lib/database/models/User';

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const User = await getUserModel();
    const userData = await User.findById(user.userId).select('-password -twoFactorCode -twoFactorSecret -twoFactorExpiry');

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        plan: userData.plan,
        accountName: userData.accountName,
        emailVerified: userData.emailVerified,
        twoFactorEnabled: userData.twoFactorEnabled,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
