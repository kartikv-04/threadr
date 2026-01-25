import mongoose, { Document, Schema } from 'mongoose';

// Types for Server model
interface Server extends Document {
    name: string;
    createdBy: Schema.Types.ObjectId;
    isPersonal: boolean;
    inviteLink?: string;
    createdAt: Date;
    updatedAt: Date;
    icon : string
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
    isPersonal: {
        type: Boolean,
        default: true
    },
    icon : {
        type : String,
        default : null
    }
}, { timestamps: true });


// Export server model
export const serverModel = mongoose.model<Server>("Server", serverSchema);