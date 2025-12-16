import mongoose, {Document, Types} from 'mongoose';

// types for Server model
interface Server extends Document{
    name : string,
    createdBy : string,
    members : Types.ObjectId[]

}

// Schema for server model
const serverSchema = new mongoose.Schema<Server>({
    name : {
        type : String,
        required : true
    },
    createdBy : {
        type : String,
        required : true
    },
    members : [{
        type : mongoose.Types.ObjectId,
        ref : "User"
    }]
}, {timestamps : true})

// Export server model
export const serverModel = mongoose.model<Server>("Server", serverSchema);