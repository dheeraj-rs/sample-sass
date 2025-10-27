// Global type definitions for the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'user';
  plan: 'free' | 'pro' | 'max';
  accountName?: string;
  googleId?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: string;
  status: 'active' | 'archived';
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedData {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
  requires2FA?: boolean;
  userId?: string;
}

export interface PlanLimits {
  free: {
    projects: 0;
    storage: 'read-only';
    features: string[];
  };
  pro: {
    projects: 10;
    storage: 'isolated';
    features: string[];
  };
  max: {
    projects: 100;
    storage: 'dedicated';
    features: string[];
  };
}

export type UserRole = 'owner' | 'admin' | 'user';
export type UserPlan = 'free' | 'pro' | 'max';
export type ProjectStatus = 'active' | 'archived';
