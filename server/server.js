import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/dbConnection.js';
import cloudinary from "cloudinary";
const PORT=process.env.PORT||4034;

app.listen(PORT,async()=>
{
    await connectDB();
    console.log(`Server is running on the http://localhost:${PORT}`);
});