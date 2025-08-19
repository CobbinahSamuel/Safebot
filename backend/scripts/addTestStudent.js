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

const addTestStudent = async () => {
  try {
    console.log('🌱 Adding test student...\n');
    
    await connectDB();
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ indexNumber: "BCS/21/001" });
    if (existingStudent) {
      console.log('✅ Student already exists:', existingStudent.fullName);
      process.exit(0);
    }
    
    // Add test student
    const testStudent = {
      fullName: "John Kwame Asante",
      indexNumber: "BCS/21/001",
      department: "Computer Science",
      yearOfAdmission: 2021,
      programLevel: "Bachelor",
      email: "john.asante@umat.edu.gh",
      status: "Active"
    };
    
    const student = await Student.create(testStudent);
    console.log('✅ Successfully created test student:', student.fullName);
    console.log('📚 Index:', student.indexNumber);
    console.log('🏫 Department:', student.department);
    
  } catch (error) {
    console.error('❌ Error adding test student:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   • ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    process.exit(0);
  }
};

// Run the function
addTestStudent();
