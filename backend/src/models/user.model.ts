import mongoose, {Document} from "mongoose";

// Types interface for Schema
interface User extends Document {
    username : string,
    name : string,
    password : string,
    isOnline : boolean,
    lastSeenAt : Date,

}

// Schema for user model
const userSchema = new mongoose.Schema<User> ({
    username : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    password : {
        type  :String,
        required : true,
        selected : false
    },
    isOnline : {
        type : Boolean,
        default : false
    },
    lastSeenAt : {
        type : Date,
        default : Date.now()
    }
}, {timestamps : true})

// Export user model
export const userModel = mongoose.model<User>('User', userSchema);