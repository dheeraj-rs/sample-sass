import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from '../auth/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Middleware to authenticate requests
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: TokenPayload; error: null } | { user: null; error: string }> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return { user: null, error: 'No authentication token provided' };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user: payload, error: null };
}

/**
 * Require authentication for API routes
 */
export function requireAuth(handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

/**
 * Require specific role for API routes
 */
export function requireRole(roles: string[]) {
  return function (handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const { user, error } = await authenticateRequest(request);

      if (error || !user) {
        return NextResponse.json(
          { error: error || 'Authentication required' },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      return handler(request, user);
    };
  };
}

/**
 * Require specific plan for API routes
 */
export function requirePlan(plans: string[]) {
  return function (handler: (request: NextRequest, user: TokenPayload) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
      const { user, error } = await authenticateRequest(request);

      if (error || !user) {
        return NextResponse.json(
          { error: error || 'Authentication required' },
          { status: 401 }
        );
      }

      if (!plans.includes(user.plan)) {
        return NextResponse.json(
          { error: 'Upgrade your plan to access this feature' },
          { status: 403 }
        );
      }

      return handler(request, user);
    };
  };
}
