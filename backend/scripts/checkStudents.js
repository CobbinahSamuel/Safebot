import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Student from '../models/studentModel.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const checkStudents = async () => {
  try {
    console.log('🔍 Checking students in database...\n');
    
    await connectDB();
    
    // Get all students
    const students = await Student.find({});
    console.log(`📊 Total students in database: ${students.length}`);
    
    if (students.length > 0) {
      console.log('\n👥 Students found:');
      students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName} - ${student.indexNumber}`);
      });
    } else {
      console.log('\n❌ No students found in database');
    }
    
  } catch (error) {
    console.error('❌ Error checking students:', error.message);
  } finally {
    process.exit(0);
  }
};

// Run the function
checkStudents();
