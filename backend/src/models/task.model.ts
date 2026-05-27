import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, maxlength: 100, trim: true },
    description: { type: String, maxlength: 500, default: '' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, default: null },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ owner: 1, status: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);
