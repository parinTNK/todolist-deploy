import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connectedd to DB');
    } catch (err) {
        console.error('Error dconnecting to DB', err);
        process.exit(1);
    }
};


export default connectDB;