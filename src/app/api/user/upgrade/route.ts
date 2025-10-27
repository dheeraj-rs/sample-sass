import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/authMiddleware';
import { getUserModel } from '@/lib/database/models/User';
import { generateToken } from '@/lib/auth/jwt';
import { getUserConnection } from '@/lib/database/connections';
import mongoose from 'mongoose';

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { plan, accountName } = body;

    // Validation
    if (!plan || !['pro', 'max'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "pro" or "max"' },
        { status: 400 }
      );
    }

    if (!accountName || accountName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Account name is required for paid plans' },
        { status: 400 }
      );
    }

    // Validate account name format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(accountName.toLowerCase())) {
      return NextResponse.json(
        { error: 'Account name must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    const User = await getUserModel();

    // Check if account name is already taken
    const existingAccount = await User.findOne({ 
      accountName: accountName.toLowerCase(),
      _id: { $ne: user.userId }
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Account name is already taken' },
        { status: 409 }
      );
    }

    // ✨ CREATE ISOLATED DATABASE for paid user
    const normalizedAccountName = accountName.toLowerCase();
    let databaseCreated = false;
    
    try {
      // Get connection to the new isolated database
      const userConnection = await getUserConnection(normalizedAccountName);
      
      // Create a system collection to initialize the database
      const SystemInfo = userConnection.model('SystemInfo', new mongoose.Schema({
        accountName: String,
        plan: String,
        createdAt: Date,
        features: {
          maxProjects: Number,
          storage: String,
          apiAccess: Boolean,
        }
      }));

      // Initialize database with system info
      await SystemInfo.create({
        accountName: normalizedAccountName,
        plan,
        createdAt: new Date(),
        features: {
          maxProjects: plan === 'pro' ? 10 : 100,
          storage: plan === 'pro' ? 'isolated' : 'dedicated',
          apiAccess: true,
        }
      });

      databaseCreated = true;
      console.log(`✅ Created isolated database: d-${normalizedAccountName}`);
    } catch (dbError) {
      console.error('Database creation error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create isolated database. Please try again.' },
        { status: 500 }
      );
    }

    // Update user with new plan and account name
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        plan,
        accountName: normalizedAccountName,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new token with updated plan and accountName
    const token = generateToken({
      userId: String(updatedUser._id),
      email: updatedUser.email,
      role: updatedUser.role,
      plan: updatedUser.plan,
      accountName: updatedUser.accountName,
    });

    // Create response with database creation status
    const response = NextResponse.json(
      {
        message: 'Plan upgraded successfully! Your isolated database is ready.',
        databaseCreated,
        databaseName: `d-${normalizedAccountName}`,
        features: {
          maxProjects: plan === 'pro' ? 10 : 100,
          storage: plan === 'pro' ? 'isolated' : 'dedicated',
          apiAccess: true,
        },
        user: {
          id: String(updatedUser._id),
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          plan: updatedUser.plan,
          accountName: updatedUser.accountName,
        },
      },
      { status: 200 }
    );

    // Update cookie with new token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Upgrade plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
