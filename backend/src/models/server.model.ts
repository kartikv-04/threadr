import mongoose, { Document, Types, Schema } from 'mongoose';

// types for Server model
interface Server extends Document {
    name: string,
    createdBy: Schema.Types.ObjectId,
    members: Types.ObjectId[],
    isPersonal: Boolean,
    inviteLink: string

}

// Schema for server model
const serverSchema = new mongoose.Schema<Server>({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        index: true
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
}, { timestamps: true })

// Export server model
export const serverModel = mongoose.model<Server>("Server", serverSchema);