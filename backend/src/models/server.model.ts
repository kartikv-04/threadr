import mongoose, {Document, Types, Schema} from 'mongoose';

// types for Server model
interface Server extends Document{
    name : string,
    createdBy : Schema.Types.ObjectId,
    members : Types.ObjectId[]

}

// Schema for server model
const serverSchema = new mongoose.Schema<Server>({
    name : {
        type : String,
        required : true
    },
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    members : [{
        type : mongoose.Types.ObjectId,
        ref : "User",
        index : true
    }]
}, {timestamps : true})

// Export server model
export const serverModel = mongoose.model<Server>("Server", serverSchema);