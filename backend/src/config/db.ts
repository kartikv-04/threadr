import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";
import logger from "./logger.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI!,{dbName : "Discord"});
        logger.info("Databse Connected successfully!");
    
    }
    catch (error : any){
        logger.error({"error" : error.message}, "Error Connecting Databse");
        process.exit(1);
    }
}