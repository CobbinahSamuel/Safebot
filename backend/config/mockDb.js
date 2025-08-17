// Mock database for testing when MongoDB is not available
const mockStudents = [
  {
    _id: "mock1",
    fullName: "John Kwame Asante",
    indexNumber: "BCS/21/001",
    department: "Computer Science",
    yearOfAdmission: 2021,
    programLevel: "Bachelor",
    email: "john.asante@umat.edu.gh",
    status: "Active",
    isVerifiedForSafebot: false,
    save: async function() { return this; }
  },
  {
    _id: "mock2", 
    fullName: "Sarah Akosua Mensah",
    indexNumber: "ENG/20/045",
    department: "Electrical Engineering", 
    yearOfAdmission: 2020,
    programLevel: "Bachelor",
    email: "sarah.mensah@umat.edu.gh",
    status: "Active",
    isVerifiedForSafebot: false,
    save: async function() { return this; }
  },
  {
    _id: "mock3",
    fullName: "Michael Kofi Osei", 
    indexNumber: "MIN/19/023",
    department: "Mining Engineering",
    yearOfAdmission: 2019,
    programLevel: "Bachelor",
    email: "michael.osei@umat.edu.gh", 
    status: "Active",
    isVerifiedForSafebot: false,
    save: async function() { return this; }
  }
];

// Mock Student model for testing
const MockStudent = {
  findOne: async (query) => {
    const student = mockStudents.find(s => {
      if (query.indexNumber && query.fullName) {
        const nameMatch = new RegExp(`^${query.fullName.$regex ? query.fullName.$regex.source : query.fullName}$`, 'i');
        return s.indexNumber === query.indexNumber && nameMatch.test(s.fullName);
      }
      if (query.indexNumber) return s.indexNumber === query.indexNumber;
      if (query.telegramChatId) return s.telegramChatId === query.telegramChatId;
      return false;
    });
    
    if (student) {
      return {
        ...student,
        isEligibleForSafebot: () => student.status === "Active" && ["Bachelor", "Master", "PhD"].includes(student.programLevel)
      };
    }
    return null;
  },

  findById: async (id) => {
    const student = mockStudents.find(s => s._id === id);
    return student || null;
  },

  verifyStudent: async (fullName, indexNumber) => {
    const student = await MockStudent.findOne({
      fullName: new RegExp(`^${fullName.trim()}$`, 'i'),
      indexNumber: indexNumber.trim().toUpperCase()
    });

    if (!student) {
      return { verified: false, message: "Student not found in UMaT records" };
    }

    if (!student.isEligibleForSafebot()) {
      return { verified: false, message: "Student status does not allow SAFEBOT access" };
    }

    return { verified: true, student };
  },

  insertMany: async (students) => {
    const newStudents = students.map((s, i) => ({
      ...s,
      _id: `mock${mockStudents.length + i + 1}`,
      save: async function() { return this; }
    }));
    mockStudents.push(...newStudents);
    return newStudents;
  },

  deleteMany: async (query) => {
    // For mock, we'll just clear and re-add
    mockStudents.length = 0;
    mockStudents.push(...[
      {
        _id: "mock1",
        fullName: "John Kwame Asante",
        indexNumber: "BCS/21/001",
        department: "Computer Science",
        yearOfAdmission: 2021,
        programLevel: "Bachelor",
        email: "john.asante@umat.edu.gh",
        status: "Active",
        isVerifiedForSafebot: false,
        save: async function() { return this; }
      },
      {
        _id: "mock2", 
        fullName: "Sarah Akosua Mensah",
        indexNumber: "ENG/20/045",
        department: "Electrical Engineering", 
        yearOfAdmission: 2020,
        programLevel: "Bachelor",
        email: "sarah.mensah@umat.edu.gh",
        status: "Active",
        isVerifiedForSafebot: false,
        save: async function() { return this; }
      },
      {
        _id: "mock3",
        fullName: "Michael Kofi Osei", 
        indexNumber: "MIN/19/023",
        department: "Mining Engineering",
        yearOfAdmission: 2019,
        programLevel: "Bachelor",
        email: "michael.osei@umat.edu.gh", 
        status: "Active",
        isVerifiedForSafebot: false,
        save: async function() { return this; }
      }
    ]);
    return { deletedCount: 0 };
  }
};

export default MockStudent;
