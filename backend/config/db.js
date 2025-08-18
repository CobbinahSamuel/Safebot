import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;