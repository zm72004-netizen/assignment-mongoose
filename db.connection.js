import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/StickyNotesDB');
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed', error);
    }
};