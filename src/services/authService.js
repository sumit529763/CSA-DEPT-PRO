// src/services/authService.js

/**
 * Fake backend auth service
 * Replace logic later with real API calls
 */

const FAKE_USERS = [
  {
    id: 1,
    email: "naiks0234@gmail.com",
    password: "1234",
    role: "admin",
    name: "Department Admin",
  },
  {
    id: 2,
    email: "naiks0234@giet.edu",
    password: "4321",
    role: "superadmin",
    name: "Super Admin",
  },
];

export const authService = {
  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 500));

    const user = FAKE_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return {
      token: "fake-jwt-token-" + user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  logout: async () => true,
};
