import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

// Types interface for Schema
interface User extends Document {
    username: string,
    name: string,
    email: string,
    password: string,
    refreshToken?: string,
    avatar?: string,
    isOnline: boolean,
    lastSeenAt: Date,

}

// Schema for user model
const userSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: [true, 'Username is Required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 Characters'],
        maxlength: [20, 'Username cannot exceed 20 Characters'],
        match: [/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"],
        lowercase: true,
        trim: true

    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        minlength: 6,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        minlength: [8, 'Password must be at least 8 characters'],
    },
    refreshToken: {
        type: String,
        select: false
    },
    avatar: {
        type: String,
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeenAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// Mongo Middleware to save user password
userSchema.pre("save", async function (next) {
    if (!this.isNew && !this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    };
    next();
})


// Export user model
export const userModel = mongoose.model<User>('User', userSchema);