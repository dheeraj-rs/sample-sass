// Application constants

export const PLAN_LIMITS = {
  free: {
    projects: 0,
    storage: 'read-only',
    features: [
      'Read-only shared data access',
      'Basic authentication',
      'Community support',
    ],
  },
  pro: {
    projects: 10,
    storage: 'isolated',
    features: [
      'Isolated database',
      'Up to 10 projects',
      'Priority support',
      'Advanced features',
      'API access',
    ],
  },
  max: {
    projects: 100,
    storage: 'dedicated',
    features: [
      'Dedicated database',
      'Up to 100 projects',
      '24/7 priority support',
      'All features included',
      'API access',
      'Custom integrations',
      'Advanced analytics',
    ],
  },
} as const;

export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  MAX: 'max',
} as const;

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
} as const;

export const TOKEN_EXPIRY = {
  JWT: '7d',
  TWO_FACTOR: 10 * 60 * 1000, // 10 minutes in milliseconds
} as const;

export const DATABASE_NAMES = {
  ADMIN: 'd-admin',
  FREE: 'd-admin-free',
  USER_PREFIX: 'd-',
} as const;

export const ROUTES = {
  PUBLIC: ['/', '/login', '/register'],
  PROTECTED: ['/dashboard', '/projects', '/settings'],
  OWNER_ONLY: ['/admin/owner'],
  ADMIN_ONLY: ['/admin'],
} as const;
