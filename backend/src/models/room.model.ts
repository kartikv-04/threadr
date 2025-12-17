import mongoose, {Document, Types, Schema} from "mongoose";

// Types for room model
interface Room extends Document {
    roomName : string,
    server : Schema.Types.ObjectId,
    messages : Types.ObjectId[]
}

// Shchema for room model
const roomSchema = new mongoose.Schema<Room>({
    roomName : {
        type : String,
        required : true,
        unique : true
    },
    server : {
        type : mongoose.Types.ObjectId,
        ref : "Server",
        index : true
    },
    messages : [{
        type : mongoose.Types.ObjectId,
        ref : "Message",
    }]
},{timestamps : true})

// Export room model
export const roomModel = mongoose.model<Room>("Room", roomSchema); 