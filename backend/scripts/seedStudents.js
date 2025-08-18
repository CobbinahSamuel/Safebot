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

// Enhanced Students Data - Focus on names and index numbers
// Note: All index numbers follow the format: 2-4 uppercase letters, /, 2 digits, /, 4 digits (e.g., BCS/21/0001)
const studentsData = [
  {
    fullName: "John Kwame Asante",
    indexNumber: "BCS/21/0001",
    department: "Computer Science",
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "john.asante@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Sarah Akosua Mensah", 
    indexNumber: "ELE/20/0045",
    department: "Electrical Engineering",
    yearOfAdmission: 2020,
    programLevel: "Bachelor", 
    email: "sarah.mensah@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Michael Kwaku Boateng",
    indexNumber: "MIN/22/0012", 
    department: "Mining Engineering",
    yearOfAdmission: 2022,
    programLevel: "Bachelor",
    email: "michael.boateng@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Grace Abena Osei",
    indexNumber: "CHE/21/0089",
    department: "Chemical Engineering", 
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "grace.osei@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Emmanuel Yaw Darko",
    indexNumber: "GEO/23/0034",
    department: "Geological Engineering",
    yearOfAdmission: 2023,
    programLevel: "Bachelor", 
    email: "emmanuel.darko@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Priscilla Akua Nyame",
    indexNumber: "ENV/22/0067", 
    department: "Environmental Engineering",
    yearOfAdmission: 2022,
    programLevel: "Bachelor",
    email: "priscilla.nyame@umat.edu.gh", 
    status: "Active"
  },
  {
    fullName: "Kwame Nkrumah Asiedu",
    indexNumber: "CIV/21/0078",
    department: "Civil Engineering",
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "kwame.asiedu@umat.edu.gh",
    status: "Active"  
  },
  {
    fullName: "Akosua Ama Serwaa",
    indexNumber: "BCS/22/0156", 
    department: "Computer Science",
    yearOfAdmission: 2022,
    programLevel: "Bachelor",
    email: "akosua.serwaa@umat.edu.gh",
    status: "Active"
  },
  {
    fullName: "Yaw Berko Amponsah", 
    indexNumber: "ELEC/20/0234",
    department: "Electronics Engineering",
    yearOfAdmission: 2020,
    programLevel: "Bachelor",
    email: "yaw.amponsah@umat.edu.gh", 
    status: "Active"
  },
  {
    fullName: "Efua Akoto Mensah",
    indexNumber: "MET/23/0098",
    department: "Metallurgical Engineering", 
    yearOfAdmission: 2023,
    programLevel: "Bachelor",
    email: "efua.mensah@umat.edu.gh",
    status: "Active"
  }
];

const populateStudents = async () => {
  try {
    console.log('🌱 Starting student database population...\n');
    
    await connectDB();
    
    // Check current student count
    const existingCount = await Student.countDocuments();
    console.log(`📊 Current students in database: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('🗑️  Clearing existing student records...');
      await Student.deleteMany({});
      console.log('✅ Existing records cleared');
    }
    
    console.log('📚 Inserting new student records...');
    const students = await Student.insertMany(studentsData);
    console.log(`✅ Successfully created ${students.length} student records`);
    
    console.log('\n🎓 Students Available for Testing:');
    console.log('=' .repeat(50));
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullName}`);
      console.log(`   Index: ${student.indexNumber}`);
      console.log(`   Department: ${student.department}`);
      console.log(`   Email: ${student.email}`);
      console.log('');
    });
    
    console.log('🎯 Primary Test Accounts:');
    console.log(`   • Name: ${students[0].fullName}`);
    console.log(`   • Index: ${students[0].indexNumber}`);
    console.log(`   • Name: ${students[1].fullName}`); 
    console.log(`   • Index: ${students[1].indexNumber}`);
    
    console.log('\n🎉 Student database population completed successfully!');
    console.log('📋 You can now test student verification with the bot.');
    
  } catch (error) {
    console.error('❌ Error populating student database:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`   • ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    process.exit(0);
  }
};

// Run the population
populateStudents();
