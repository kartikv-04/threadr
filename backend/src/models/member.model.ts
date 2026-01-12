import mongoose, { Document, mongo, Schema } from "mongoose";

// Interface for member model
interface Member extends Document {
    server : Schema.Types.ObjectId,
    user : Schema.Types.ObjectId,
    role : string[],
    joinedAt : Date,
    isBanned : boolean,
}

// Member Schema
const memberSchema = new mongoose.Schema({
    server : {
        type : Schema.Types.ObjectId,
        ref : "server",
        required : [true, "Server reference is required"],
        index : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User reference is required"],
        index : true
    },
    role : [{
        type : String,
        enum : ["admin, memeber"],
        required : true,
        default : "memeber"
    }],
    isBanned : {
        type : Boolean,
        default : false
    }
}, {timestamps : {createdAt : 'joinedAt', updatedAt : 'false'}});

// Compound index
memberSchema.index({ server : 1, user : 1}, {unique : true});

export const memberModel = mongoose.model<Member>("Member", memberSchema);