import 'dotenv/config.js';
import mongoose from 'mongoose';

export async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`);
        console.log(`MONGODB CONNECTION SUCCESSFULL !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`DATABASE CONNECTION IS FAILED AT START $$ ${error}`);
        process.exit(1);
    }
}