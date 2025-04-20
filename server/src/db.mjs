import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connecหกดtedd to DBffff');
    } catch (err) {
        console.error('Error dconndfectdfdfdfing to DB', err);
        process.exit(1);
    }
};


export default connectDB;