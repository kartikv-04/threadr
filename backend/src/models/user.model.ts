import mongoose, {Document} from "mongoose";

// Types interface for Schema
interface User extends Document {
    username : string,
    name : string,
    email : string,
    password : string,
    refreshToken : string
    isOnline : boolean,
    lastSeenAt : Date,

}

// Schema for user model
const userSchema = new mongoose.Schema<User> ({
    username : {
        type : String,
        required : true,
        unique : true,
        minlength : 3,
        maxlength : 20,
        match: [/^[a-z0-9_]+$/, "Invalid username"],
        lowercase : true,
        trim : true

    },
    name : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minlength : 6,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        trim : true,
        lowercase : true
    },
    password : {
        type  :String,
        required : true,
        select : false,
        minlength : 6
    },
    refreshToken : {
        type : String,
        select : false
    },
    isOnline : {
        type : Boolean,
        default : false
    },
    lastSeenAt : {
        type : Date,
        default : Date.now
    }
}, {timestamps : true})

// Export user model
export const userModel = mongoose.model<User>('User', userSchema);