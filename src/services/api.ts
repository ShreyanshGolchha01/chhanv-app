// API Service (Mocked) - Only Frontend, No Backend Integration

// Dummy delay function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// User API endpoints (Mock)
export const userAPI = {
  register: async (userData: any) => {
    await delay(500);
    return { success: true, message: "Registration successful (mock)", user: { ...userData, _id: "mockid" } };
  },

  login: async (credentials: { phoneNumber: string; password: string }) => {
    await delay(500);
    // Dummy login: phoneNumber '9999999999' and password 'password' will succeed
    if (credentials.phoneNumber === "9999999999" && credentials.password === "password") {
      return {
        success: true,
        message: "Login successful (mock)",
        user: {
          _id: "mockid",
          firstName: "Demo",
          lastName: "User",
          phoneNumber: "9999999999",
          email: "demo@mock.com",
          role: "user",
          dateOfBirth: "1990-01-01",
          gender: "male",
          bloodGroup: "O+"
        },
        token: "mocktoken"
      };
    }
    return { success: false, message: "Invalid credentials (mock)" };
  },

  getProfile: async () => {
    await delay(300);
    return {
      success: true,
      user: {
        _id: "mockid",
        firstName: "Demo",
        lastName: "User",
        phoneNumber: "9999999999",
        email: "demo@mock.com",
        role: "user",
        dateOfBirth: "1990-01-01",
        gender: "male",
        bloodGroup: "O+"
      }
    };
  },

  updateProfile: async (profileData: any) => {
    await delay(300);
    return { success: true, message: "Profile updated (mock)", user: profileData };
  },

  logout: async () => {
    await delay(200);
    return { success: true, message: "Logged out (mock)" };
  },

  getHealthRecords: async () => {
    await delay(300);
    return { success: true, records: [] };
  },

  addFamilyMember: async (familyMemberData: any) => {
    await delay(300);
    return { success: true, message: "Family member added (mock)", member: familyMemberData };
  },
};

// Admin API endpoints (Mock)
export const adminAPI = {
  getAllUsers: async () => {
    await delay(300);
    return { success: true, users: [] };
  },
  createCamp: async (campData: any) => {
    await delay(300);
    return { success: true, camp: campData };
  },
  getAllCamps: async () => {
    await delay(300);
    return { success: true, camps: [] };
  },
  getSchemes: async () => {
    await delay(300);
    return { success: true, schemes: [] };
  },
  createScheme: async (schemeData: any) => {
    await delay(300);
    return { success: true, scheme: schemeData };
  },
};

// Doctor API endpoints (Mock)
export const doctorAPI = {
  getProfile: async () => {
    await delay(300);
    return { success: true, doctor: { name: "Dr. Mock" } };
  },
  updateProfile: async (profileData: any) => {
    await delay(300);
    return { success: true, doctor: profileData };
  },
};

// Health reports API (Mock)
export const reportsAPI = {
  getUserReports: async () => {
    await delay(300);
    return { success: true, reports: [] };
  },
  getReportById: async (reportId: string) => {
    await delay(300);
    return { success: true, report: { id: reportId } };
  },
  createReport: async (reportData: any) => {
    await delay(300);
    return { success: true, report: reportData };
  },
};

// Error handling utility (unchanged)
export const handleAPIError = (error: any) => {
  console.error('API Error:', error);
  return error.message || 'Something went wrong';
};
