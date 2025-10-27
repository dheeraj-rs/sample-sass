import { Schema, Model, Document } from 'mongoose';
import { getFreeConnection } from '../connections';

export interface ISharedData extends Document {
  key: string;
  value: any;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sharedDataSchema = new Schema<ISharedData>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

sharedDataSchema.index({ category: 1, key: 1 });

let SharedDataModel: Model<ISharedData>;

/**
 * Get SharedData model from d-admin-free database
 * This is read-only data accessible to free-tier users
 */
export async function getSharedDataModel(): Promise<Model<ISharedData>> {
  if (SharedDataModel) {
    return SharedDataModel;
  }

  const connection = await getFreeConnection();
  SharedDataModel = connection.model<ISharedData>('SharedData', sharedDataSchema);
  return SharedDataModel;
}

export default getSharedDataModel;
