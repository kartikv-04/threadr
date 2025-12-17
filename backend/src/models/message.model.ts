import mongoose, {Document, Schema,} from "mongoose";

// Types for message model
interface Message extends Document {
    content : string,
    isEdited : boolean,
    sentBy : Schema.Types.ObjectId,
    room : Schema.Types.ObjectId
}

// Schema for message model
const messageSchema = new mongoose.Schema<Message>({
    content : {
        type : String,
        required : true
    },
    isEdited : {
        type : Boolean,
        default : false
    },
    sentBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    room : {
        type : mongoose.Types.ObjectId,
        ref : "Room",
        required : true,
        index : true
    }
    
}, {timestamps : true})

// Export message model
export const messageModel = mongoose.model<Message>('Message', messageSchema);