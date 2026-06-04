import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Make sure the MongoDB URI exists before trying to connect.
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    // Connect to MongoDB Atlas using the value from .env.
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;