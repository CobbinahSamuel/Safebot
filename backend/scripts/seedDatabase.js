import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Student from "../models/studentModel.js";
import User from "../models/userModels.js";
import Incident from "../models/incidentModel.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Sample Students Data
const studentsData = [
  {
    fullName: "John Kwame Asante",
    indexNumber: "BCS/21/001",
    department: "Computer Science",
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "john.asante@umat.edu.gh",
    status: "Active",
  },
  {
    fullName: "Sarah Akosua Mensah",
    indexNumber: "ENG/20/045",
    department: "Electrical Engineering",
    yearOfAdmission: 2020,
    programLevel: "Bachelor",
    email: "sarah.mensah@umat.edu.gh",
    status: "Active",
  },
  {
    fullName: "Michael Kofi Osei",
    indexNumber: "MIN/19/023",
    department: "Mining Engineering",
    yearOfAdmission: 2019,
    programLevel: "Bachelor",
    email: "michael.osei@umat.edu.gh",
    status: "Active",
  },
  {
    fullName: "Grace Ama Boateng",
    indexNumber: "GEO/21/012",
    department: "Geological Engineering",
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "grace.boateng@umat.edu.gh",
    status: "Active",
  },
  {
    fullName: "Emmanuel Yaw Oppong",
    indexNumber: "MET/20/008",
    department: "Metallurgical Engineering",
    yearOfAdmission: 2020,
    programLevel: "Bachelor",
    email: "emmanuel.oppong@umat.edu.gh",
    status: "Active",
  },
  {
    fullName: "Priscilla Akua Nyame",
    indexNumber: "ENV/22/067",
    department: "Environmental Engineering",
    yearOfAdmission: 2022,
    programLevel: "Bachelor",
    email: "priscilla.nyame@umat.edu.gh",
    status: "Active",
  },
];

// Sample Users Data (Admin/Staff)
const usersData = [
  {
    name: "Dr. Samuel Agyei",
    email: "samuel.agyei@umat.edu.gh",
    password: "$2a$10$XYZ123HashPasswordExample", // In real app, hash properly
    role: "admin",
    department: "Computer Science",
    isVerified: true,
  },
  {
    name: "Mrs. Janet Kwarteng",
    email: "janet.kwarteng@umat.edu.gh",
    password: "$2a$10$ABC456HashPasswordExample",
    role: "staff",
    department: "Student Affairs",
    isVerified: true,
  },
  {
    name: "Prof. Isaac Nkrumah",
    email: "isaac.nkrumah@umat.edu.gh",
    password: "$2a$10$DEF789HashPasswordExample",
    role: "admin",
    department: "Mining Engineering",
    isVerified: true,
  },
];

// Sample Incidents Data
const incidentsData = [
  {
    incidentTitle: "Suspicious Activity in Library",
    category: "Other",
    detailedDescription:
      "Individual acting suspiciously near computer lab, taking photos of security systems and asking students for personal information",
    location: "Main Library - Computer Lab Section",
    whenOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    urgencyLevel: "High",
    submitAnonymously: true,
    status: "investigating",
    responseTime: 15,
  },
  {
    incidentTitle: "Harassment at Dormitory",
    category: "Harassment",
    detailedDescription:
      "Female student being verbally harassed and followed by group of male individuals near dormitory entrance. Incident occurred multiple times.",
    location: "Dormitory Block A - Main Entrance",
    whenOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    urgencyLevel: "Critical",
    submitAnonymously: false,
    contactEmail: "concerned.student@umat.edu.gh",
    status: "resolved",
    responseTime: 8,
  },
  {
    incidentTitle: "Theft of Personal Property",
    category: "Theft",
    detailedDescription:
      "Laptop and textbooks stolen from classroom during break period. Bag was left unattended for approximately 15 minutes.",
    location: "Engineering Block - Room 203",
    whenOccurred: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    urgencyLevel: "Medium",
    submitAnonymously: false,
    contactEmail: "victim.student@umat.edu.gh",
    status: "pending",
    responseTime: null,
  },
  {
    incidentTitle: "Fire Safety Violation",
    category: "Safety Violation",
    detailedDescription:
      "Fire exit door blocked by construction materials and equipment. Emergency evacuation route is completely inaccessible.",
    location: "Science Building - 2nd Floor East Wing",
    whenOccurred: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    urgencyLevel: "High",
    submitAnonymously: true,
    status: "resolved",
    responseTime: 45,
  },
  {
    incidentTitle: "Student Accident on Campus",
    category: "Accident",
    detailedDescription:
      "Student fell down stairs due to wet floor without proper warning signs or barriers. Minor injuries sustained, first aid administered.",
    location: "Administration Building - Main Staircase",
    whenOccurred: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    urgencyLevel: "Critical",
    submitAnonymously: false,
    contactEmail: "witness.staff@umat.edu.gh",
    status: "closed",
    responseTime: 5,
  },
  {
    incidentTitle: "Vehicle Vandalism in Parking Area",
    category: "Other",
    detailedDescription:
      "Multiple vehicles damaged with scratches, broken mirrors, and deflated tires. Appears to be deliberate vandalism affecting 6 vehicles.",
    location: "Student Parking Lot B - North Section",
    whenOccurred: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    urgencyLevel: "Medium",
    submitAnonymously: true,
    status: "investigating",
    responseTime: 30,
  },
  {
    incidentTitle: "Bullying in Academic Block",
    category: "Harassment",
    detailedDescription:
      "Repeated instances of verbal bullying and intimidation of first-year students by senior students in corridor areas.",
    location: "Academic Block C - 1st Floor Corridor",
    whenOccurred: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    urgencyLevel: "High",
    submitAnonymously: false,
    contactEmail: "reporting.student@umat.edu.gh",
    status: "resolved",
    responseTime: 20,
  },
  {
    incidentTitle: "Unauthorized Access to Lab",
    category: "Other",
    detailedDescription:
      "Unknown individuals found in chemistry lab after hours without proper authorization. Lab equipment may have been tampered with.",
    location: "Chemistry Laboratory - Block D",
    whenOccurred: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    urgencyLevel: "High",
    submitAnonymously: true,
    status: "closed",
    responseTime: 12,
  },
];

// Seed Functions
const seedStudents = async () => {
  try {
    await Student.deleteMany({});
    console.log("🗑️  Cleared existing students");

    const students = await Student.insertMany(studentsData);
    console.log(`✅ Created ${students.length} students`);

    // Display sample students for verification testing
    console.log("\n📚 Test Students for Verification:");
    students.slice(0, 2).forEach((student) => {
      console.log(`   • ${student.fullName} - ${student.indexNumber}`);
    });
  } catch (error) {
    console.error("❌ Error seeding students:", error.message);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} admin/staff users`);
  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
  }
};

const seedIncidents = async () => {
  try {
    await Incident.deleteMany({});
    console.log("🗑️  Cleared existing incidents");

    const incidents = await Incident.insertMany(incidentsData);
    console.log(`✅ Created ${incidents.length} sample incidents`);

    // Display incident statistics
    const statusCounts = {};
    incidents.forEach((incident) => {
      statusCounts[incident.status] = (statusCounts[incident.status] || 0) + 1;
    });

    console.log("\n📊 Incident Statistics:");
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count} incidents`);
    });
  } catch (error) {
    console.error("❌ Error seeding incidents:", error.message);
  }
};

// Main seeding function
const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...\n");

  await connectDB();

  await seedStudents();
  console.log("");
  await seedUsers();
  console.log("");
  await seedIncidents();

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 You can now test:");
  console.log("   • Student verification with bot");
  console.log("   • Incident reporting and analytics");
  console.log("   • Complete end-to-end authentication flow");

  process.exit(0);
};

// Handle errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err.message);
  process.exit(1);
});

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
