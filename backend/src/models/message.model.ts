import mongoose, { Document, Schema, } from "mongoose";

// Types for message model
interface Message extends Document {
    content: string,
    isEdited: boolean,
    editedAt?: Date
    sentBy: Schema.Types.ObjectId,
    room: Schema.Types.ObjectId,
    server: Schema.Types.ObjectId,
    replyTo?: Schema.Types.ObjectId,
    mentions: Schema.Types.ObjectId[],
    attachments: Array<{
        url: string,
        filename: string,
        mimetype: string,
        size: number
    }>,
    isPinned: boolean,
    deletedAt?: Date,
    createdAt: Date,
    updatedAt: Date
}

// Schema for message model
const messageSchema = new mongoose.Schema<Message>({
    content: {
        type: String,
        required: [true, 'message content is required'],
        trim: true,
        minlength: [1, 'message cannot be empty'],
        maxlength: [200, 'message cannot exceed 200 characters']
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'refrence is required'],
        index: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: [true, 'refrence is required'],
        index: true
    },
    server: {
        type: Schema.Types.ObjectId,
        required: [true, 'Server reference is required'],
        ref: "Server",
        index: true
    },
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    mentions: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    attachments: [{
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }

}, { timestamps: true });

// Compound indexes
messageSchema.index({ room: 1, createdAt: -1 });  // Get Messages in room sorted by time
messageSchema.index({ sentBy: 1, createdAt: -1 }); // Get users message
messageSchema.index({ isPinned: 1, createdAt: 1 }); // Get Pinned Messages

// Save edited messages through middleware
messageSchema.pre("save", function (next) {
    if (!this.isNew && !this.isModified("content")) {
        this.isEdited = true;
        this.editedAt = new Date;
    };
    next();

})


// Export message model
export const messageModel = mongoose.model<Message>('Message', messageSchema);