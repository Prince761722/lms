import 'dotenv/config';
import mongoose from "mongoose";
mongoose.set('strictQuery', false);

export const connectDB = async () => {
    try{
        const {connection}= await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connection.host}`);
    }
    catch(error){
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }

}