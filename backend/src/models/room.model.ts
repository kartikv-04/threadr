import mongoose, { Document, Schema } from 'mongoose';

// Types for room model
interface Room extends Document {
  roomName: string;
  server: Schema.Types.ObjectId;
  isDefault: boolean;
  createdBy: Schema.Types.ObjectId;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Shchema for room model
const roomSchema = new mongoose.Schema<Room>(
  {
    roomName: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      minlength: [1, 'Room name must be at least 1 Character'],
      maxLength: [50, 'Room name cannot exceed 50 characters']
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User Refrence is required']
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    server: {
      type: Schema.Types.ObjectId,
      ref: 'Server',
      required: [true, 'Server Refrence is Required'],
      index: true
    }
  },
  { timestamps: true }
);

// Add indexes
roomSchema.index({ server: 1, roomName: 1 }, { unique: true });

// Export room model
export const roomModel = mongoose.model<Room>('Room', roomSchema);
