import mongoose, { Document, Schema } from 'mongoose';

// 1. Define the Interface (for TypeScript)
export interface Invite extends Document {
  code: string;
  serverId: Schema.Types.ObjectId;
  creatorId: Schema.Types.ObjectId; // Who created it
  createdAt: Date;
  expiresAt?: Date | null; // Null means "never expires"
  maxUses?: number | null; // Null means "unlimited uses"
  uses: number; // Track how many people used it
}

// 2. Create the Schema
const inviteSchema = new Schema<Invite>(
  {
    code: {
      type: String,
      required: true,
      unique: true, // Crucial: No two invites can share a code
      trim: true
    },
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server', // Links to your Server model
      required: true
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Or "Profile", depending on your auth setup
      required: true
    },
    expiresAt: {
      type: Date,
      default: null // Default to no expiration
    },
    maxUses: {
      type: Number,
      default: null // Default to unlimited
    },
    uses: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// 3. Create Indexes (Speed Optimization)
inviteSchema.index({ serverId: 1 });

// 4. Export the Model
export const inviteModel = mongoose.model<Invite>('Invite', inviteSchema);
