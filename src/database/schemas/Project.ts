import { Schema, model } from 'mongoose';

export interface IProject {
  name: string,
  filename?: string
  startTimeSeconds?: number,
  endTimeSeconds?: number,
  volumeLevel?: number,
  userId: Schema.Types.ObjectId
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      minLength: 2,
      maxLength: 128
    },
    filename: {
      type: String,
      required: false,
      unique: false,
      minLength: 20,
      maxLength: 128
    },
    startTimeSeconds: {
      type: Number,
      default: 0,
      required: false,
      unique: false,
    },
    endTimeSeconds: {
      type: Number,
      default: 0,
      required: false,
      unique: false,
    },
    volumeLevel: {
      type: Number,
      default: 0.8,
      required: false,
      unique: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Project = model<IProject>('Project', ProjectSchema);
