import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getUserModel } from '@/lib/database/models/User';

export const PUT = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { name } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { name: name.trim() },
      { new: true }
    ).select('-password -twoFactorCode -twoFactorSecret -twoFactorExpiry');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        plan: updatedUser.plan,
        accountName: updatedUser.accountName,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
