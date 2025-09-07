// Simple test login without database
// This creates a test admin user for you to login

const testUsers = {
  admin: {
    id: 1,
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123", // In real app, this would be hashed
    role: "admin",
    college_id: 1
  },
  student: {
    id: 2,
    name: "Test Student", 
    email: "student@test.com",
    password: "password123",
    role: "student",
    college_id: 1
  }
};

// Simple login function
function testLogin(email, password, userType) {
  const user = testUsers[userType];
  
  if (user && user.email === email && user.password === password) {
    return {
      success: true,
      token: "test-token-123",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        college_id: user.college_id
      }
    };
  }
  
  return {
    success: false,
    error: "Invalid credentials"
  };
}

console.log("Test Login Credentials:");
console.log("Admin: admin@test.com / password123");
console.log("Student: student@test.com / password123");
console.log("\nUse these credentials to login!");

export { testLogin, testUsers };
