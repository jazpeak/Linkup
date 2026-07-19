import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error){
        console.log("error connecting to MongoDB:", error.message);
        process.exit(1);//1 means failure
    }
}