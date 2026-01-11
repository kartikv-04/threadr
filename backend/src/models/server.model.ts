import mongoose, { Document, Schema } from 'mongoose';

// Types for Server model
interface Server extends Document {
    name: string;
    createdBy: Schema.Types.ObjectId;
    members: Schema.Types.ObjectId[];
    isPersonal: boolean;
    inviteLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema for server model
const serverSchema = new mongoose.Schema<Server>({
    name: {
        type: String,
        required: [true, 'Server name is required'],
        trim: true,
        minlength: [1, 'Server name must be at least 1 character'],
        maxlength: [100, 'Server name cannot exceed 100 characters']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Creator reference is required'],
        immutable: true  // Creator cannot be changed after creation
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isPersonal: {
        type: Boolean,
        default: true
    },
    inviteLink: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

// Index for querying servers by member
serverSchema.index({ members: 1 });

// Ensure creator is in members array (middleware)
serverSchema.pre('save', function(next) {
    if (this.isNew && !this.members.includes(this.createdBy)) {
        this.members.push(this.createdBy);
    }
    next();
});

// Export server model
export const serverModel = mongoose.model<Server>("Server", serverSchema);