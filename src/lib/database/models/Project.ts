import { Schema, Model, Document, Connection } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: string; // User email
  status: 'active' | 'archived';
  settings: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ owner: 1, status: 1 });

/**
 * Get Project model for a specific connection
 * Used for user-specific databases (Pro/Max plans)
 */
export function getProjectModel(connection: Connection): Model<IProject> {
  if (connection.models.Project) {
    return connection.models.Project as Model<IProject>;
  }
  return connection.model<IProject>('Project', projectSchema);
}

export default getProjectModel;
