import { Schema, Model, Document } from 'mongoose';
import { getAdminConnection } from '../connections';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: 'owner' | 'admin' | 'user';
  plan: 'free' | 'pro' | 'max';
  accountName?: string; // For paid users, their isolated database identifier
  googleId?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorCode?: string;
  twoFactorExpiry?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'user'],
      default: 'user',
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'max'],
      default: 'free',
    },
    accountName: {
      type: String,
      sparse: true,
      unique: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    twoFactorCode: {
      type: String,
      select: false,
    },
    twoFactorExpiry: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Note: Indexes are already created by unique:true in schema definition
// No need to create duplicate indexes

let UserModel: Model<IUser>;

export async function getUserModel(): Promise<Model<IUser>> {
  if (UserModel) {
    return UserModel;
  }

  const connection = await getAdminConnection();
  UserModel = connection.model<IUser>('User', userSchema);
  return UserModel;
}

export default getUserModel;
